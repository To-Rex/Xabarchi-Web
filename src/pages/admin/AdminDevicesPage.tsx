import { useState } from 'react'
import { BatteryFull, SignalHigh, Smartphone } from 'lucide-react'
import { useLang } from '@/shared/i18n'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatNumber, formatRelative } from '@/shared/lib/format'
import { fetchDevices } from '@/features/admin/api/repository'
import { Badge, Button, Card, CardBody, EmptyState, PageHeader, Skeleton } from '@/shared/ui'

const STATUS_TONE: Record<string, 'ok' | 'gold' | 'neutral'> = { online: 'ok', realtime: 'ok', polling: 'gold', offline: 'neutral' }

export default function AdminDevicesPage() {
  usePageMeta('Admin — Qurilmalar')
  const { lang } = useLang()
  const [page, setPage] = useState(1)
  const { data, loading, error, refetch } = useAsync(() => fetchDevices(page), [page])
  const items = data?.items ?? []
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / 30))

  return (
    <div>
      <PageHeader title="Qurilmalar" subtitle={`Barcha ulangan telefonlar. Jami: ${formatNumber(data?.total ?? 0, lang)}`} />

      {error ? (
        <EmptyState title="Xatolik" body="Yuklab bo‘lmadi." action={<Button onClick={refetch}>Qayta urinish</Button>} />
      ) : loading && !data ? (
        <div className="space-y-2.5">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={<Smartphone />} title="Qurilma yo‘q" body="Hali hech kim qurilma ulamagan." />
      ) : (
        <div className="space-y-2.5">
          {items.map((d) => (
            <Card key={d.id}>
              <CardBody className="flex flex-wrap items-center gap-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand"><Smartphone className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                    {d.name}
                    <Badge tone={STATUS_TONE[d.status] ?? 'neutral'}>{d.status}</Badge>
                  </p>
                  <p className="tnum truncate text-[13px] text-ink-3">{d.model} · {d.operator} · {d.phone}</p>
                  <p className="tnum truncate text-[11px] text-ink-3">{d.ownerEmail} · {d.ownerCompany}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[12px] text-ink-2">
                  <span className="tnum flex items-center gap-3">
                    <span className="flex items-center gap-1"><BatteryFull className="size-3.5 text-ok" />{d.battery}%</span>
                    <span className="flex items-center gap-1"><SignalHigh className="size-3.5 text-gold" />{d.signal}/4</span>
                  </span>
                  <span className="tnum text-[11px] text-ink-3">{formatNumber(d.sentToday, lang)} / {formatNumber(d.dailyLimit, lang)} bugun</span>
                  {d.lastSeenAt && <span className="tnum text-[11px] text-ink-3">{formatRelative(d.lastSeenAt, lang)}</span>}
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
