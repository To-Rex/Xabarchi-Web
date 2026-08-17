import { useEffect, useState } from 'react'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { fetchPlans, updatePlan } from '@/features/admin/api/repository'
import type { Plan } from '@/shared/api/types'
import { Button, Card, CardBody, CardHeader, CardTitle, EmptyState, Input, Skeleton, Switch, useToast } from '@/shared/ui'

export default function AdminPlansPage() {
  usePageMeta('Admin — Tariflar')
  const { data, loading, error, refetch } = useAsync(fetchPlans, [])

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Tariflar</h1>
        <p className="mt-0.5 text-sm text-ink-2">Har bir tarifning limitlari va narxini o‘zgartiring.</p>
      </div>

      {error ? (
        <EmptyState title="Xatolik" body="Yuklab bo‘lmadi." action={<Button onClick={refetch}>Qayta urinish</Button>} />
      ) : loading || !data ? (
        <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {data.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
      )}
    </div>
  )
}

const POLAR_SYNC_MSG: Record<string, string> = {
  synced: 'Narx Polarga sinxronlandi ✓',
  polar_disabled: 'Polar sozlanmagan — faqat bazada saqlandi',
  not_purchasable: 'Bu tarif Polarda sotilmaydi',
  skipped: '',
}

function PlanCard({ plan }: { plan: Plan }) {
  const toast = useToast()
  const [form, setForm] = useState(plan)
  const [syncPolar, setSyncPolar] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => setForm(plan), [plan])

  const purchasable = plan.id !== 'start'
  const num = (key: 'monthlyPrice' | 'smsPerMonth' | 'maxDevices') => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: Number(e.target.value.replace(/\D/g, '')) || 0 }))

  const save = async () => {
    setBusy(true)
    try {
      const { polarSync } = await updatePlan(plan.id, {
        monthlyPrice: form.monthlyPrice,
        smsPerMonth: form.smsPerMonth,
        maxDevices: form.maxDevices,
        apiAccess: form.apiAccess,
        prioritySupport: form.prioritySupport,
        syncToPolar: syncPolar,
      })
      toast('success', 'Tarif saqlandi')
      if (polarSync.startsWith('error:')) toast('error', `Polar: ${polarSync.slice(6)}`)
      else if (POLAR_SYNC_MSG[polarSync]) toast(polarSync === 'synced' ? 'success' : 'info', POLAR_SYNC_MSG[polarSync])
    } catch {
      toast('error', 'Saqlab bo‘lmadi')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{plan.id}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        <Input label="Oylik narx (so‘m)" value={String(form.monthlyPrice)} onChange={num('monthlyPrice')} className="font-mono" />
        <Input label="SMS / oy" value={String(form.smsPerMonth)} onChange={num('smsPerMonth')} className="font-mono" />
        <Input label="Qurilmalar soni" value={String(form.maxDevices)} onChange={num('maxDevices')} className="font-mono" />
        <label className="flex items-center justify-between pt-1">
          <span className="text-[13px] text-ink">API kirish</span>
          <Switch checked={form.apiAccess} onChange={(v) => setForm((f) => ({ ...f, apiAccess: v }))} />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-[13px] text-ink">Ustuvor qo‘llab-quvvatlash</span>
          <Switch checked={form.prioritySupport} onChange={(v) => setForm((f) => ({ ...f, prioritySupport: v }))} />
        </label>
        {purchasable && (
          <label className="flex items-center justify-between rounded-lg bg-brand-soft/60 px-2.5 py-2">
            <span className="text-[12.5px] font-medium text-brand-2 dark:text-brand">Narxni Polarga sinxronlash</span>
            <Switch checked={syncPolar} onChange={setSyncPolar} />
          </label>
        )}
        <Button loading={busy} onClick={save} className="mt-2 w-full">Saqlash</Button>
      </CardBody>
    </Card>
  )
}
