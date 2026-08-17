import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { useLang } from '@/shared/i18n'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatMoney, formatNumber } from '@/shared/lib/format'
import { fetchInvoices } from '@/features/admin/api/repository'
import { Badge, Button, Card, CardBody, EmptyState, PageHeader, Skeleton } from '@/shared/ui'

const STATUS_TONE: Record<string, 'ok' | 'gold' | 'danger'> = { paid: 'ok', due: 'gold', failed: 'danger' }

export default function AdminInvoicesPage() {
  usePageMeta('Admin — Hisob-fakturalar')
  const { lang } = useLang()
  const [page, setPage] = useState(1)
  const { data, loading, error, refetch } = useAsync(() => fetchInvoices(page), [page])
  const items = data?.items ?? []
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / 30))

  return (
    <div>
      <PageHeader title="Hisob-fakturalar" subtitle={`Barcha to‘lovlar. Jami: ${formatNumber(data?.total ?? 0, lang)}`} />

      {error ? (
        <EmptyState title="Xatolik" body="Yuklab bo‘lmadi." action={<Button onClick={refetch}>Qayta urinish</Button>} />
      ) : loading && !data ? (
        <div className="space-y-2.5">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={<Receipt />} title="Hisob-faktura yo‘q" body="Hali to‘lovlar bo‘lmagan." />
      ) : (
        <div className="space-y-2">
          {items.map((inv) => (
            <Card key={inv.id}>
              <CardBody className="flex flex-wrap items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                    <span className="tnum font-mono">{inv.number}</span>
                    <Badge tone={STATUS_TONE[inv.status] ?? 'neutral'}>{inv.status}</Badge>
                    <Badge tone="neutral" className="capitalize">{inv.planId}</Badge>
                  </p>
                  <p className="tnum truncate text-[12px] text-ink-3">{inv.ownerEmail} · {inv.ownerCompany}</p>
                </div>
                <div className="text-right">
                  <p className="tnum font-display text-[15px] font-bold text-ink">{formatMoney(inv.amount, lang)}</p>
                  <p className="tnum text-[11px] text-ink-3">{formatDate(inv.date, lang)} · {inv.period}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Oldingi</Button>
          <span className="tnum text-sm text-ink-2">{page} / {pages}</span>
          <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Keyingi</Button>
        </div>
      )}
    </div>
  )
}
