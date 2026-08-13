import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, CreditCard, FileText } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatMoney, formatNumber } from '@/shared/lib/format'
import { ApiError } from '@/shared/api/client'
import type { Plan } from '@/shared/api/types'
import { cn } from '@/shared/lib/cn'
import { fetchInvoices, fetchPlans, openPortal, startCheckout } from '@/features/billing/api/repository'
import { fetchOverview } from '@/features/dashboard/api/repository'
import { useCurrentUser } from '@/features/auth/model/authStore'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, EmptyState, Modal, PageHeader, ProgressBar, Skeleton, useToast } from '@/shared/ui'

const dict = {
  uz: {
    meta: "To'lovlar — Xabarchi",
    title: "To'lovlar",
    subtitle: 'Tarif, limit va hisob-fakturalar.',
    current: 'Joriy tarif',
    usage: 'Oylik SMS limiti',
    resets: 'Limit 1-avgustda yangilanadi',
    perMonth: '/oy',
    free: 'Bepul',
    yourPlan: 'Sizning tarifingiz',
    choose: "O'tish",
    features: { sms: 'SMS / oy', devices: 'qurilma', api: 'API kirish', support: 'Ustuvor qo‘llab-quvvatlash' },
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<Plan['id'], string>,
    confirmTitle: 'Tarifni almashtirish',
    confirmBody: (name: string, price: string) => `«${name}» tarifiga o'tmoqchimisiz? Yangi narx: ${price}/oy. O'zgarish darhol kuchga kiradi.`,
    confirm: 'Tasdiqlash',
    switchedToast: 'Tarif almashtirildi',
    invoices: 'Hisob-fakturalar',
    cols: { number: 'Raqam', period: 'Davr', amount: 'Summa', status: 'Holat' },
    statuses: { paid: "To'langan", due: 'Kutilmoqda', failed: 'Xato' },
    download: 'Yuklab olish',
    downloadToast: 'Hisob-faktura yuklab olinmoqda',
    used: 'ishlatildi',
  },
  ru: {
    meta: 'Платежи — Xabarchi',
    title: 'Платежи',
    subtitle: 'Тариф, лимит и счета.',
    current: 'Текущий тариф',
    usage: 'Месячный лимит SMS',
    resets: 'Лимит обновится 1 августа',
    perMonth: '/мес',
    free: 'Бесплатно',
    yourPlan: 'Ваш тариф',
    choose: 'Перейти',
    features: { sms: 'SMS / мес', devices: 'устройств', api: 'Доступ к API', support: 'Приоритетная поддержка' },
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<Plan['id'], string>,
    confirmTitle: 'Смена тарифа',
    confirmBody: (name: string, price: string) => `Перейти на тариф «${name}»? Новая цена: ${price}/мес. Изменение вступит в силу сразу.`,
    confirm: 'Подтвердить',
    switchedToast: 'Тариф изменён',
    invoices: 'Счета',
    cols: { number: 'Номер', period: 'Период', amount: 'Сумма', status: 'Статус' },
    statuses: { paid: 'Оплачен', due: 'Ожидает', failed: 'Ошибка' },
    download: 'Скачать',
    downloadToast: 'Счёт скачивается',
    used: 'использовано',
  },
  en: {
    meta: 'Billing — Xabarchi',
    title: 'Billing',
    subtitle: 'Plan, quota and invoices.',
    current: 'Current plan',
    usage: 'Monthly SMS quota',
    resets: 'Quota resets on 1 August',
    perMonth: '/mo',
    free: 'Free',
    yourPlan: 'Your plan',
    choose: 'Switch',
    features: { sms: 'SMS / mo', devices: 'devices', api: 'API access', support: 'Priority support' },
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<Plan['id'], string>,
    confirmTitle: 'Change plan',
    confirmBody: (name: string, price: string) => `Switch to the “${name}” plan? New price: ${price}/mo. The change takes effect immediately.`,
    confirm: 'Confirm',
    switchedToast: 'Plan changed',
    invoices: 'Invoices',
    cols: { number: 'Number', period: 'Period', amount: 'Amount', status: 'Status' },
    statuses: { paid: 'Paid', due: 'Due', failed: 'Failed' },
    download: 'Download',
    downloadToast: 'Invoice downloading',
    used: 'used',
  },
}

async function fetchBilling() {
  const [plans, invoices, overview] = await Promise.all([fetchPlans(), fetchInvoices(), fetchOverview()])
  return { plans, invoices, used: overview.monthlyUsed }
}

export default function BillingPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()
  const user = useCurrentUser()

  const { data, loading, error, refetch } = useAsync(fetchBilling)
  const [switching, setSwitching] = useState<Plan | null>(null)
  const [busy, setBusy] = useState(false)

  const planId = user?.planId

  const confirmSwitch = async () => {
    if (!switching) return
    setBusy(true)
    try {
      // Paid plans go through Polar checkout; downgrading to the free plan
      // is done by cancelling the subscription in the Polar customer portal.
      const url = switching.monthlyPrice === 0 ? await openPortal() : await startCheckout(switching.id)
      window.location.href = url
    } catch (err) {
      toast('error', err instanceof ApiError ? err.message : c.errorTitle)
      setBusy(false)
      setSwitching(null)
    }
  }

  if (error) {
    return <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
  }

  const currentPlan = data?.plans.find((plan) => plan.id === planId)

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle} />

      {/* Current usage */}
      {loading || !data || !currentPlan ? (
        <Skeleton className="h-36 w-full rounded-2xl" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card>
            <CardBody className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-[13px] font-medium text-ink-2">{t.current}</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-semibold text-ink">{t.planNames[currentPlan.id]}</span>
                  <span className="tnum text-sm text-ink-3">
                    {currentPlan.monthlyPrice === 0 ? t.free : `${formatMoney(currentPlan.monthlyPrice, lang)}${t.perMonth}`}
                  </span>
                </p>
              </div>
              <div className="min-w-56 flex-1">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-2">{t.usage}</span>
                  <span className="tnum font-medium text-ink">
                    {formatNumber(data.used, lang)} / {formatNumber(currentPlan.smsPerMonth, lang)} {t.used}
                  </span>
                </div>
                <ProgressBar value={data.used / currentPlan.smsPerMonth} tone={data.used / currentPlan.smsPerMonth > 0.9 ? 'danger' : 'gold'} className="mt-2.5 h-2" />
                <p className="mt-2 text-xs text-ink-3">{t.resets}</p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Plans */}
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {loading || !data
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-64 w-full rounded-2xl" />)
          : data.plans.map((plan, index) => {
              const isCurrent = plan.id === planId
              return (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.07 }}>
                  <Card className={cn('flex h-full flex-col p-6', isCurrent && 'border-brand shadow-glow')}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-ink">{t.planNames[plan.id]}</h3>
                      {isCurrent && <Badge tone="brand">{t.yourPlan}</Badge>}
                    </div>
                    <p className="mt-3">
                      {plan.monthlyPrice === 0 ? (
                        <span className="font-display text-2xl font-semibold text-ink">{t.free}</span>
                      ) : (
                        <>
                          <span className="tnum font-display text-2xl font-semibold text-ink">{formatNumber(plan.monthlyPrice, lang)}</span>
                          <span className="ml-1 text-[13px] text-ink-3">{lang === 'en' ? 'UZS' : lang === 'ru' ? 'сум' : "so'm"}{t.perMonth}</span>
                        </>
                      )}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2.5 text-sm text-ink-2">
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-brand" />
                        <span className="tnum font-medium text-ink">{formatNumber(plan.smsPerMonth, lang)}</span> {t.features.sms}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-brand" />
                        <span className="tnum font-medium text-ink">{plan.maxDevices}</span> {t.features.devices}
                      </li>
                      {plan.apiAccess && (
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-brand" />
                          {t.features.api}
                        </li>
                      )}
                      {plan.prioritySupport && (
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-brand" />
                          {t.features.support}
                        </li>
                      )}
                    </ul>
                    <Button
                      variant={isCurrent ? 'ghost' : 'primary'}
                      disabled={isCurrent}
                      className="mt-6 w-full"
                      onClick={() => setSwitching(plan)}
                    >
                      {isCurrent ? t.yourPlan : t.choose}
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
      </div>

      {/* Invoices */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4 text-brand" />
            {t.invoices}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-3">
          {loading || !data ? (
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-3">
                    <th className="py-2.5 pr-4 font-semibold">{t.cols.number}</th>
                    <th className="py-2.5 pr-4 font-semibold">{t.cols.period}</th>
                    <th className="py-2.5 pr-4 text-right font-semibold">{t.cols.amount}</th>
                    <th className="py-2.5 font-semibold">{t.cols.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-line last:border-none">
                      <td className="tnum py-3 pr-4 font-mono text-[13px] text-ink">{invoice.number}</td>
                      <td className="py-3 pr-4 text-ink-2">
                        {invoice.period}
                        <span className="tnum ml-2 text-xs text-ink-3">{formatDate(invoice.date, lang)}</span>
                      </td>
                      <td className="tnum py-3 pr-4 text-right font-medium text-ink">{formatMoney(invoice.amount, lang)}</td>
                      <td className="py-3">
                        <Badge tone={invoice.status === 'paid' ? 'ok' : invoice.status === 'due' ? 'gold' : 'danger'}>
                          {t.statuses[invoice.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.invoices.length === 0 && <p className="py-6 text-center text-sm text-ink-3">—</p>}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Switch confirm */}
      <Modal
        open={!!switching}
        onClose={() => setSwitching(null)}
        title={t.confirmTitle}
        closeLabel={c.close}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSwitching(null)}>{c.cancel}</Button>
            <Button loading={busy} onClick={confirmSwitch}>
              <CreditCard className="size-4" />
              {t.confirm}
            </Button>
          </>
        }
      >
        {switching && (
          <p className="text-sm leading-relaxed text-ink-2">
            {t.confirmBody(t.planNames[switching.id], switching.monthlyPrice === 0 ? t.free : formatMoney(switching.monthlyPrice, lang))}
          </p>
        )}
      </Modal>
    </div>
  )
}
