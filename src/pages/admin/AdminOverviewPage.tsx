import { Bot, CheckCircle2, MessageSquareText, Send, Smartphone, TrendingUp, Users, Wallet } from 'lucide-react'
import { useLang } from '@/shared/i18n'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatCompact, formatMoney, formatNumber } from '@/shared/lib/format'
import { fetchOverview } from '@/features/admin/api/repository'
import { AnimatedNumber, Card, CardBody, EmptyState, PageHeader, Skeleton } from '@/shared/ui'

const PLAN_LABEL: Record<string, string> = { start: 'Start (bepul)', biznes: 'Biznes', korxona: 'Korxona' }

export default function AdminOverviewPage() {
  usePageMeta('Admin — Umumiy')
  const { lang } = useLang()
  const { data, loading, error, refetch } = useAsync(fetchOverview, [])

  if (error) return <EmptyState title="Xatolik" body="Ma’lumotni yuklab bo‘lmadi." action={<button onClick={refetch} className="text-brand">Qayta urinish</button>} />

  const stats = [
    { icon: Users, label: 'Foydalanuvchilar', value: data?.totalUsers, tone: 'text-brand' },
    { icon: CheckCircle2, label: 'Faol obunalar', value: data?.paidUsers, tone: 'text-ok' },
    { icon: Smartphone, label: 'Qurilmalar', value: data?.totalDevices, sub: data ? `${data.onlineDevices} onlayn` : '', tone: 'text-brand' },
    { icon: Send, label: 'Bugun SMS', value: data?.messagesToday, tone: 'text-brand' },
    { icon: MessageSquareText, label: 'Oylik SMS', value: data?.messagesMonth, sub: data ? `${formatNumber(data.deliveredMonth, lang)} yetkazildi` : '', tone: 'text-brand' },
    { icon: Bot, label: 'Telegram botlar', value: data?.totalBots, tone: 'text-brand' },
  ]

  const maxPlan = data ? Math.max(1, ...Object.values(data.planCounts)) : 1

  return (
    <div>
      <PageHeader title="Umumiy ko‘rinish" subtitle="Platformaning jonli statistikasi." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody>
              <s.icon className={`size-5 ${s.tone}`} />
              <p className="mt-3 text-xs text-ink-3">{s.label}</p>
              <p className="tnum mt-0.5 font-display text-2xl font-bold text-ink">
                {loading || s.value === undefined ? <Skeleton className="h-7 w-16" /> : <AnimatedNumber value={s.value} format={(v) => formatCompact(Math.round(v), lang)} />}
              </p>
              {s.sub && <p className="tnum mt-0.5 text-[11px] text-ink-3">{s.sub}</p>}
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Wallet className="size-4 text-brand" /> Oylik daromad</p>
            <p className="tnum mt-2 font-display text-3xl font-bold text-brand">
              {loading || !data ? <Skeleton className="h-8 w-32" /> : formatMoney(data.revenueMonth, lang)}
            </p>
            <p className="mt-1 text-[12px] text-ink-3">Shu oyda to‘langan hisob-fakturalar.</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="flex items-center gap-2 text-sm font-semibold text-ink"><TrendingUp className="size-4 text-brand" /> Tariflar bo‘yicha</p>
            <div className="mt-3 space-y-2.5">
              {loading || !data
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)
                : ['start', 'biznes', 'korxona'].map((plan) => {
                    const count = data.planCounts[plan] ?? 0
                    return (
                      <div key={plan} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-[13px] text-ink-2">{PLAN_LABEL[plan] ?? plan}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sunken">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${(count / maxPlan) * 100}%` }} />
                        </div>
                        <span className="tnum w-10 shrink-0 text-right text-[13px] font-semibold text-ink">{formatNumber(count, lang)}</span>
                      </div>
                    )
                  })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
