import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CheckCheck, Send, TrendingUp, XCircle, Table2, ChartSpline } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatDayMonth, formatNumber } from '@/shared/lib/format'
import { api } from '@/shared/api/client'
import type { DailyStat, SmsMessage } from '@/shared/api/types'
import { fetchDailyStats } from '@/features/dashboard/api/repository'
import { fetchDevices } from '@/features/devices/api/repository'
import { AnimatedNumber, Button, Card, CardBody, CardHeader, CardTitle, EmptyState, PageHeader, SegmentedControl, Skeleton } from '@/shared/ui'
import { useChartPalette } from '@/shared/charts/tokens'
import { ChartTooltipCard } from '@/shared/charts/ChartTooltip'

const dict = {
  uz: {
    meta: 'Analitika — Xabarchi',
    title: 'Analitika',
    subtitle: 'Yuborish sifati va yuklamani kuzating.',
    range: { d7: '7 kun', d30: '30 kun' },
    kpi: { sent: 'Jami yuborilgan', delivered: 'Yetkazish darajasi', avg: 'Kunlik o‘rtacha', failed: 'Xatolar' },
    mainChart: 'Yetkazilgan va xatolar',
    legendDelivered: 'Yetkazildi',
    legendFailed: 'Xato',
    hourChart: 'Soat bo‘yicha yuklama',
    hourHint: 'So‘nggi 100 xabar bo‘yicha',
    deviceChart: 'Qurilmalar kesimida',
    tableView: 'Jadval',
    chartView: 'Grafik',
    cols: { date: 'Sana', delivered: 'Yetkazildi', failed: 'Xato', sent: 'Yuborildi' },
    sms: 'SMS',
  },
  ru: {
    meta: 'Аналитика — Xabarchi',
    title: 'Аналитика',
    subtitle: 'Следите за качеством отправки и нагрузкой.',
    range: { d7: '7 дней', d30: '30 дней' },
    kpi: { sent: 'Всего отправлено', delivered: 'Доставляемость', avg: 'В среднем за день', failed: 'Ошибки' },
    mainChart: 'Доставленные и ошибки',
    legendDelivered: 'Доставлено',
    legendFailed: 'Ошибка',
    hourChart: 'Нагрузка по часам',
    hourHint: 'По последним 100 сообщениям',
    deviceChart: 'По устройствам',
    tableView: 'Таблица',
    chartView: 'График',
    cols: { date: 'Дата', delivered: 'Доставлено', failed: 'Ошибки', sent: 'Отправлено' },
    sms: 'SMS',
  },
  en: {
    meta: 'Analytics — Xabarchi',
    title: 'Analytics',
    subtitle: 'Track sending quality and load.',
    range: { d7: '7 days', d30: '30 days' },
    kpi: { sent: 'Total sent', delivered: 'Delivery rate', avg: 'Daily average', failed: 'Failures' },
    mainChart: 'Delivered vs failures',
    legendDelivered: 'Delivered',
    legendFailed: 'Failed',
    hourChart: 'Load by hour',
    hourHint: 'Across the last 100 messages',
    deviceChart: 'By device',
    tableView: 'Table',
    chartView: 'Chart',
    cols: { date: 'Date', delivered: 'Delivered', failed: 'Failed', sent: 'Sent' },
    sms: 'SMS',
  },
}

interface AnalyticsData {
  series: DailyStat[]
  hourly: number[]
  perDevice: { name: string; sent: number }[]
}

async function fetchAnalytics(days: number): Promise<AnalyticsData> {
  const [series, devices, recent] = await Promise.all([
    fetchDailyStats(days),
    fetchDevices(),
    api<{ items: SmsMessage[] }>('/messages', { query: { pageSize: 100 } }),
  ])
  // Hour-of-day histogram over the latest messages.
  const hourly = Array.from({ length: 24 }, () => 0)
  for (const message of recent.items) hourly[new Date(message.createdAt).getHours()] += 1
  return {
    series,
    hourly,
    perDevice: devices.map((device) => ({ name: device.name, sent: device.sentToday })),
  }
}

export default function AnalyticsPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const palette = useChartPalette()

  const [days, setDays] = useState<'7' | '30'>('30')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const { data, loading, error, refetch } = useAsync(() => fetchAnalytics(Number(days)), [days])

  const totals = useMemo(() => {
    if (!data) return null
    const sent = data.series.reduce((sum, day) => sum + day.sent, 0)
    const delivered = data.series.reduce((sum, day) => sum + day.delivered, 0)
    const failed = data.series.reduce((sum, day) => sum + day.failed, 0)
    return {
      sent,
      delivered,
      failed,
      rate: sent > 0 ? (delivered / sent) * 100 : 0,
      avg: data.series.length > 0 ? Math.round(sent / data.series.length) : 0,
    }
  }, [data])

  const maxHour = data ? Math.max(1, ...data.hourly) : 1
  const maxDevice = data ? Math.max(1, ...data.perDevice.map((entry) => entry.sent)) : 1

  if (error) {
    return <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
  }

  const kpis = totals
    ? [
        { icon: <Send className="size-4 text-brand" />, label: t.kpi.sent, value: totals.sent, format: (v: number) => formatNumber(Math.round(v), lang) },
        { icon: <CheckCheck className="size-4 text-ok" />, label: t.kpi.delivered, value: totals.rate, format: (v: number) => `${v.toFixed(1)}%` },
        { icon: <TrendingUp className="size-4 text-info" />, label: t.kpi.avg, value: totals.avg, format: (v: number) => formatNumber(Math.round(v), lang) },
        { icon: <XCircle className="size-4 text-danger" />, label: t.kpi.failed, value: totals.failed, format: (v: number) => formatNumber(Math.round(v), lang) },
      ]
    : []

  return (
    <div>
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <SegmentedControl
            value={days}
            onChange={(value) => setDays(value)}
            segments={[
              { value: '7', label: t.range.d7 },
              { value: '30', label: t.range.d30 },
            ]}
          />
        }
      />

      {/* KPI tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !totals
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 w-full rounded-2xl" />)
          : kpis.map((kpi, index) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.06 }}>
                <Card className="h-full">
                  <CardBody>
                    <p className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                      {kpi.icon}
                      {kpi.label}
                    </p>
                    <p className="tnum mt-2 font-display text-[26px] font-semibold text-ink">
                      <AnimatedNumber value={kpi.value} format={kpi.format} />
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Main chart: delivered vs failed */}
      <Card className="mt-5">
        <CardHeader>
          <div>
            <CardTitle>{t.mainChart}</CardTitle>
            <p className="mt-1.5 flex items-center gap-4 text-xs text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: palette.primary }} />
                {t.legendDelivered}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: palette.danger }} />
                {t.legendFailed}
              </span>
            </p>
          </div>
          <SegmentedControl
            size="sm"
            value={view}
            onChange={(value) => setView(value)}
            segments={[
              { value: 'chart', label: <ChartSpline className="size-3.5" />, ariaLabel: t.chartView },
              { value: 'table', label: <Table2 className="size-3.5" />, ariaLabel: t.tableView },
            ]}
          />
        </CardHeader>
        <CardBody className="pt-4">
          {loading || !data ? (
            <Skeleton className="h-72 w-full" />
          ) : view === 'chart' ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.series} margin={{ top: 6, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke={palette.grid} strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: palette.axis, fontSize: 11 }}
                    tickFormatter={(value: string) => formatDayMonth(value, lang)}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={36}
                  />
                  <YAxis tick={{ fill: palette.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip
                    cursor={{ stroke: palette.axis, strokeDasharray: '3 3' }}
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <ChartTooltipCard
                          title={formatDate(String(label), lang)}
                          rows={payload.map((entry) => ({
                            color: entry.color,
                            label: entry.dataKey === 'delivered' ? t.legendDelivered : t.legendFailed,
                            value: formatNumber(entry.value as number, lang),
                          }))}
                        />
                      ) : null
                    }
                  />
                  <Line type="monotone" dataKey="delivered" stroke={palette.primary} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: palette.surface }} />
                  <Line type="monotone" dataKey="failed" stroke={palette.danger} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: palette.surface }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface">
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-3">
                    <th className="py-2.5 pr-4 font-semibold">{t.cols.date}</th>
                    <th className="py-2.5 pr-4 text-right font-semibold">{t.cols.sent}</th>
                    <th className="py-2.5 pr-4 text-right font-semibold">{t.cols.delivered}</th>
                    <th className="py-2.5 text-right font-semibold">{t.cols.failed}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.series].reverse().map((day) => (
                    <tr key={day.date} className="border-b border-line last:border-none">
                      <td className="tnum py-2.5 pr-4 text-ink-2">{formatDate(day.date, lang)}</td>
                      <td className="tnum py-2.5 pr-4 text-right text-ink">{formatNumber(day.sent, lang)}</td>
                      <td className="tnum py-2.5 pr-4 text-right text-ink">{formatNumber(day.delivered, lang)}</td>
                      <td className="tnum py-2.5 text-right text-ink">{formatNumber(day.failed, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Hourly load */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t.hourChart}</CardTitle>
              <p className="mt-0.5 text-xs text-ink-3">{t.hourHint}</p>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            {loading || !data ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.hourly.map((value, hour) => ({ hour, value }))} margin={{ top: 4, right: 0, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke={palette.grid} strokeDasharray="3 6" vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: palette.axis, fontSize: 10 }}
                      tickFormatter={(hour: number) => `${String(hour).padStart(2, '0')}`}
                      axisLine={false}
                      tickLine={false}
                      interval={2}
                    />
                    <YAxis tick={{ fill: palette.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload, label }) =>
                        active && payload?.length ? (
                          <ChartTooltipCard
                            title={`${String(label).padStart(2, '0')}:00`}
                            rows={[{ color: palette.primary, label: t.sms, value: formatNumber(payload[0].value as number, lang) }]}
                          />
                        ) : null
                      }
                    />
                    <Bar dataKey="value" fill={palette.primary} radius={[4, 4, 0, 0]} maxBarSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Per-device horizontal bars */}
        <Card>
          <CardHeader>
            <CardTitle>{t.deviceChart}</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4 pt-4">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-10 w-full" />)
              : data.perDevice.map((entry, index) => (
                  <div key={entry.name}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-ink">{entry.name}</span>
                      <span className="tnum text-ink-2">{formatNumber(entry.sent, lang)}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-sunken">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: palette.primary, opacity: 1 - index * 0.18 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(entry.sent / maxDevice) * 100}%` }}
                        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                ))}
          </CardBody>
        </Card>
      </div>

      {/* screen-reader summary of hourly peaks */}
      {data && (
        <p className="sr-only">
          {t.hourChart}: {data.hourly.map((value, hour) => `${hour}:00 — ${value}`).join(', ')}. Max: {maxHour}.
        </p>
      )}
    </div>
  )
}
