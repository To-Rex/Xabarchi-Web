import { useState } from 'react'
import { Percent, Tag, Ticket } from 'lucide-react'
import { ApiError } from '@/shared/api/client'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { createDiscount, fetchDiscounts, type Discount, type DiscountPayload } from '@/features/admin/api/repository'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, EmptyState, Input, SegmentedControl, Skeleton, useToast } from '@/shared/ui'

function discountValue(d: Discount): string {
  if (d.type === 'percentage' && typeof d.basisPoints === 'number') return `${d.basisPoints / 100}%`
  if (typeof d.amount === 'number') return `${Math.round(d.amount / 100).toLocaleString()} ${(d.currency ?? '').toUpperCase()}`
  return '—'
}

export default function AdminDiscountsPage() {
  usePageMeta('Admin — Chegirmalar')
  const toast = useToast()
  const [version, setVersion] = useState(0)
  const { data, loading, error, refetch } = useAsync(fetchDiscounts, [version])

  const [name, setName] = useState('')
  const [kind, setKind] = useState<'percentage' | 'fixed'>('percentage')
  const [value, setValue] = useState('20')
  const [code, setCode] = useState('')
  const [duration, setDuration] = useState<'once' | 'forever' | 'repeating'>('once')
  const [planId, setPlanId] = useState<'' | 'biznes' | 'korxona'>('')
  const [busy, setBusy] = useState(false)

  const create = async () => {
    if (!name.trim()) { toast('error', 'Nom kiriting'); return }
    setBusy(true)
    try {
      const payload: DiscountPayload = {
        name: name.trim(),
        kind,
        value: Number(value.replace(/\D/g, '')) || 0,
        code: code.trim() || undefined,
        duration,
        planId: planId || undefined,
      }
      await createDiscount(payload)
      toast('success', 'Chegirma yaratildi')
      setName(''); setCode('')
      setVersion((v) => v + 1)
    } catch (err) {
      toast('error', err instanceof ApiError ? err.message : 'Yaratib bo‘lmadi — Polar sozlanganini tekshiring')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Chegirmalar</h1>
        <p className="mt-0.5 text-sm text-ink-2">Polar orqali istalgancha chegirma (kupon) yarating.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="size-4 text-brand" /> Yangi chegirma</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <Input label="Nom" placeholder="Yangi yil aksiyasi" value={name} onChange={(e) => setName(e.target.value)} />
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-ink-2">Turi</p>
              <SegmentedControl size="sm" value={kind} onChange={setKind} segments={[{ value: 'percentage', label: 'Foiz %' }, { value: 'fixed', label: 'Qat’iy summa' }]} />
            </div>
            <Input
              label={kind === 'percentage' ? 'Foiz (0–100)' : 'Summa (UZS so‘m)'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="font-mono"
              leading={kind === 'percentage' ? <Percent className="size-4" /> : undefined}
            />
            <Input label="Kupon kodi (ixtiyoriy)" placeholder="NEWYEAR25" value={code} onChange={(e) => setCode(e.target.value)} className="font-mono uppercase" />
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-ink-2">Amal muddati</p>
              <SegmentedControl size="sm" value={duration} onChange={setDuration} segments={[{ value: 'once', label: 'Bir marta' }, { value: 'repeating', label: 'Takroriy' }, { value: 'forever', label: 'Doimiy' }]} />
            </div>
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-ink-2">Cheklash (tarif)</p>
              <div className="flex gap-1.5">
                {([['', 'Barchasi'], ['biznes', 'Biznes'], ['korxona', 'Korxona']] as const).map(([v, label]) => (
                  <button key={v} type="button" onClick={() => setPlanId(v)} className={`flex-1 rounded-lg py-1.5 text-[13px] font-semibold transition-colors ${planId === v ? 'bg-brand text-brand-ink' : 'bg-sunken text-ink-2 hover:text-ink'}`}>{label}</button>
                ))}
              </div>
            </div>
            <Button loading={busy} onClick={create} className="w-full">Chegirma yaratish</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Ticket className="size-4 text-brand" /> Mavjud chegirmalar</CardTitle></CardHeader>
          <CardBody>
            {error ? (
              <EmptyState title="Xatolik" body="Polar sozlanmagan yoki ulanmadi." action={<Button onClick={refetch}>Qayta urinish</Button>} />
            ) : loading || !data ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : data.length === 0 ? (
              <EmptyState icon={<Ticket />} title="Chegirma yo‘q" body="Hali chegirma yaratilmagan." />
            ) : (
              <div className="space-y-2">
                {data.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand"><Percent className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-ink">{d.name}</p>
                      {d.code && <p className="tnum font-mono text-[12px] text-ink-3">{d.code}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[15px] font-bold text-brand">{discountValue(d)}</p>
                      {d.duration && <Badge tone="neutral" className="capitalize">{d.duration}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
