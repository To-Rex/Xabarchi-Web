import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowUpRight, ArrowDownRight, BatteryLow, CheckCheck, Clock4, PenLine, Smartphone, Send } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatDayMonth, formatNumber, formatPhone, formatRelative } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { user } from '@/shared/mock/db'
import { AnimatedNumber, Badge, Button, Card, CardBody, CardHeader, CardTitle, EmptyState, MessageStatusBadge, PageHeader, Skeleton } from '@/shared/ui'
import { useChartPalette } from '@/shared/charts/tokens'
import { ChartTooltipCard } from '@/shared/charts/ChartTooltip'
import { fetchOverview } from '@/features/dashboard/api/repository'

const dict = {
  uz: {
    meta: 'Boshqaruv paneli — Xabarchi',
    greeting: { morning: 'Xayrli tong', day: 'Xayrli kun', evening: 'Xayrli kech' },
    subtitle: 'Bugungi holat bir qarashda.',
    newSms: 'Yangi SMS',
    stats: {
      sentToday: 'Bugun yuborildi',
      vsYesterday: 'kechagiga nisbatan',
      deliveryRate: 'Yetkazish darajasi',
      last30: "so'nggi 30 kun",
      devices: 'Faol qurilmalar',
      queued: 'Navbatda',
      queuedHint: 'yuborilishi kutilmoqda',
    },
    chart: { title: 'SMS dinamikasi', legend: 'Yuborilgan', days30: "So'nggi 30 kun" },
    devices: { title: 'Qurilmalar', battery: 'batareya', todaySent: 'bugun' },
    recent: { title: "So'nggi xabarlar", empty: 'Hali xabar yuborilmagan', emptyBody: 'Birinchi SMSingizni yuboring — bu bir daqiqa vaqt oladi.' },
  },
  ru: {
    meta: 'Панель управления — Xabarchi',
    greeting: { morning: 'Доброе утро', day: 'Добрый день', evening: 'Добрый вечер' },
    subtitle: 'Сегодняшняя картина одним взглядом.',
    newSms: 'Новое SMS',
    stats: {
      sentToday: 'Отправлено сегодня',
      vsYesterday: 'к вчерашнему',
      deliveryRate: 'Доставляемость',
      last30: 'за 30 дней',
      devices: 'Активные устройства',
      queued: 'В очереди',
      queuedHint: 'ждут отправки',
    },
    chart: { title: 'Динамика SMS', legend: 'Отправлено', days30: 'Последние 30 дней' },
    devices: { title: 'Устройства', battery: 'батарея', todaySent: 'сегодня' },
    recent: { title: 'Последние сообщения', empty: 'Сообщений пока нет', emptyBody: 'Отправьте первое SMS — это займёт минуту.' },
  },
  en: {
    meta: 'Dashboard — Xabarchi',
    greeting: { morning: 'Good morning', day: 'Good afternoon', evening: 'Good evening' },
    subtitle: 'Today at a glance.',
    newSms: 'New SMS',
    stats: {
      sentToday: 'Sent today',
      vsYesterday: 'vs yesterday',
      deliveryRate: 'Delivery rate',
      last30: 'last 30 days',
      devices: 'Active devices',
      queued: 'Queued',
      queuedHint: 'waiting to send',
    },
    chart: { title: 'SMS activity', legend: 'Sent', days30: 'Last 30 days' },
    devices: { title: 'Devices', battery: 'battery', todaySent: 'today' },
    recent: { title: 'Recent messages', empty: 'No messages yet', emptyBody: 'Send your first SMS — it takes a minute.' },
  },
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardBody>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-20" />
        <Skeleton className="mt-3 h-3 w-28" />
      </CardBody>
    </Card>
  )
}

export default function OverviewPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const palette = useChartPalette()
  const { data, loading, error, refetch } = useAsync(fetchOverview)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t.greeting.morning : hour < 18 ? t.greeting.day : t.greeting.evening

  if (error) {
    return (
      <EmptyState
        title={c.errorTitle}
        body={c.errorBody}
        action={<Button onClick={refetch}>{c.retry}</Button>}
      />
    )
  }

  const delta = data ? ((data.sentToday - data.sentYesterday) / data.sentYesterday) * 100 : 0

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user.firstName}!`}
        subtitle={t.subtitle}
        actions={
          <Link to="/app/sms/new">
            <Button>
              <PenLine className="size-4" />
              {t.newSms}
            </Button>
          </Link>
        }
      />

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !data ? (
          Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Card className="h-full">
                <CardBody>
                  <p className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                    <Send className="size-4 text-brand" />
                    {t.stats.sentToday}
                  </p>
                  <p className="tnum mt-2 font-display text-3xl font-semibold text-ink">
                    <AnimatedNumber value={data.sentToday} format={(v) => formatNumber(Math.round(v), lang)} />
                  </p>
                  <p className={cn('mt-2 flex items-center gap-1 text-[13px] font-medium', delta >= 0 ? 'text-ok' : 'text-danger')}>
                    {delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                    {Math.abs(delta).toFixed(0)}% <span className="font-normal text-ink-3">{t.stats.vsYesterday}</span>
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06 }}>
              <Card className="h-full">
                <CardBody>
                  <p className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                    <CheckCheck className="size-4 text-ok" />
                    {t.stats.deliveryRate}
                  </p>
                  <p className="tnum mt-2 font-display text-3xl font-semibold text-ink">
                    <AnimatedNumber value={data.deliveryRate} format={(v) => `${v.toFixed(1)}%`} />
                  </p>
                  <p className="mt-2 text-[13px] text-ink-3">{t.stats.last30}</p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>
              <Card className="h-full">
                <CardBody>
                  <p className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                    <Smartphone className="size-4 text-info" />
                    {t.stats.devices}
                  </p>
                  <p className="tnum mt-2 font-display text-3xl font-semibold text-ink">
                    {data.activeDevices}
                    <span className="text-lg text-ink-3">/{data.totalDevices}</span>
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-3">
                    <span className="size-1.5 rounded-full bg-ok" />
                    {c.online}
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.18 }}>
              <Card className="h-full">
                <CardBody>
                  <p className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                    <Clock4 className="size-4 text-gold" />
                    {t.stats.queued}
                  </p>
                  <p className="tnum mt-2 font-display text-3xl font-semibold text-ink">{data.queued}</p>
                  <p className="mt-2 text-[13px] text-ink-3">{t.stats.queuedHint}</p>
                </CardBody>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Activity chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t.chart.title}</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-3">{t.chart.days30}</p>
            </div>
          </CardHeader>
          <CardBody className="pt-3">
            {loading || !data ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.series} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={palette.primary} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={palette.primary} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={palette.grid} strokeDasharray="3 6" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: palette.axis, fontSize: 11 }}
                      tickFormatter={(value: string) => formatDayMonth(value, lang)}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={40}
                    />
                    <YAxis tick={{ fill: palette.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
                    <Tooltip
                      cursor={{ stroke: palette.axis, strokeDasharray: '3 3' }}
                      content={({ active, payload, label }) =>
                        active && payload?.length ? (
                          <ChartTooltipCard
                            title={formatDate(String(label), lang)}
                            rows={[{ color: palette.primary, label: t.chart.legend, value: formatNumber(payload[0].value as number, lang) }]}
                          />
                        ) : null
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="sent"
                      stroke={palette.primary}
                      strokeWidth={2}
                      fill="url(#sentFill)"
                      activeDot={{ r: 4, strokeWidth: 2, stroke: palette.surface }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Devices mini-list */}
        <Card>
          <CardHeader>
            <CardTitle>{t.devices.title}</CardTitle>
            <Link to="/app/devices" className="text-[13px] font-medium text-brand transition-colors hover:text-brand-2">
              {c.seeAll}
            </Link>
          </CardHeader>
          <CardBody className="space-y-3 pt-3">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />)
              : data.devices.map((device) => (
                  <div key={device.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-lg',
                        device.status === 'online' ? 'bg-brand-soft text-brand' : 'bg-sunken text-ink-3',
                      )}
                    >
                      <Smartphone className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-ink">{device.name}</p>
                      <p className="tnum truncate text-xs text-ink-3">{formatPhone(device.phone)} · {device.operator}</p>
                    </div>
                    <div className="text-right">
                      {device.status === 'online' ? (
                        device.battery <= 25 ? (
                          <Badge tone="gold"><BatteryLow className="size-3" /> {device.battery}%</Badge>
                        ) : (
                          <Badge tone="ok">{c.online}</Badge>
                        )
                      ) : (
                        <Badge tone="neutral">{c.offline}</Badge>
                      )}
                      <p className="tnum mt-1 text-[11px] text-ink-3">
                        {formatNumber(device.sentToday, lang)} {t.devices.todaySent}
                      </p>
                    </div>
                  </div>
                ))}
          </CardBody>
        </Card>
      </div>

      {/* Recent messages */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t.recent.title}</CardTitle>
          <Link to="/app/sms" className="text-[13px] font-medium text-brand transition-colors hover:text-brand-2">
            {c.seeAll}
          </Link>
        </CardHeader>
        <CardBody className="pt-3">
          {loading || !data ? (
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : data.recentMessages.length === 0 ? (
            <EmptyState
              title={t.recent.empty}
              body={t.recent.emptyBody}
              action={
                <Link to="/app/sms/new">
                  <Button>{t.newSms}</Button>
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-line">
              {data.recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-4 py-3"
                >
                  <span className="tnum w-36 shrink-0 font-mono text-[13px] text-ink">{formatPhone(message.to)}</span>
                  <span className="hidden min-w-0 flex-1 truncate text-[13px] text-ink-2 sm:block">{message.text}</span>
                  <span className="tnum hidden shrink-0 text-xs text-ink-3 md:block">{formatRelative(message.createdAt, lang)}</span>
                  <span className="ml-auto shrink-0 sm:ml-0">
                    <MessageStatusBadge status={message.status} />
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
