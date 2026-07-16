import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, BellOff, CheckCheck, CreditCard, MessageSquareText, Settings2, Smartphone } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatRelative } from '@/shared/lib/format'
import type { AppNotification } from '@/shared/mock/types'
import { cn } from '@/shared/lib/cn'
import { Button, Card, EmptyState, PageHeader, Tabs } from '@/shared/ui'
import { markAllRead, markRead, useNotifications } from '@/features/notifications/model/store'

const dict = {
  uz: {
    meta: 'Bildirishnomalar — Xabarchi',
    title: 'Bildirishnomalar',
    subtitle: 'Qurilmalar, to‘lovlar va tizim xabarlari.',
    markAll: "Barchasini o'qilgan deb belgilash",
    tabs: { all: 'Barchasi', device: 'Qurilmalar', sms: 'SMS', billing: "To'lovlar", system: 'Tizim' },
    empty: 'Bildirishnoma yo‘q',
    emptyBody: 'Hammasi joyida — yangi bildirishnomalar shu yerda paydo bo‘ladi.',
    unread: 'yangi',
  },
  ru: {
    meta: 'Уведомления — Xabarchi',
    title: 'Уведомления',
    subtitle: 'Устройства, платежи и системные сообщения.',
    markAll: 'Отметить все прочитанными',
    tabs: { all: 'Все', device: 'Устройства', sms: 'SMS', billing: 'Платежи', system: 'Система' },
    empty: 'Уведомлений нет',
    emptyBody: 'Всё в порядке — новые уведомления появятся здесь.',
    unread: 'новых',
  },
  en: {
    meta: 'Notifications — Xabarchi',
    title: 'Notifications',
    subtitle: 'Devices, billing and system messages.',
    markAll: 'Mark all as read',
    tabs: { all: 'All', device: 'Devices', sms: 'SMS', billing: 'Billing', system: 'System' },
    empty: 'No notifications',
    emptyBody: 'All clear — new notifications will show up here.',
    unread: 'new',
  },
}

const kindIcon: Record<AppNotification['kind'], typeof Smartphone> = {
  device: Smartphone,
  sms: MessageSquareText,
  billing: CreditCard,
  system: Settings2,
}

const severityStyles: Record<AppNotification['severity'], string> = {
  info: 'bg-info-soft text-info',
  success: 'bg-ok-soft text-ok',
  warn: 'bg-gold-soft text-gold',
  error: 'bg-danger-soft text-danger',
}

type Filter = 'all' | AppNotification['kind']

export default function NotificationsPage() {
  const t = useT(dict)
  const { lang } = useLang()
  usePageMeta(t.meta)

  const items = useNotifications()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => (filter === 'all' ? items : items.filter((item) => item.kind === filter)), [items, filter])
  const unread = items.filter((item) => !item.read).length

  const tabs = useMemo(
    () => [
      { value: 'all' as const, label: t.tabs.all, count: items.length },
      { value: 'device' as const, label: t.tabs.device },
      { value: 'sms' as const, label: t.tabs.sms },
      { value: 'billing' as const, label: t.tabs.billing },
      { value: 'system' as const, label: t.tabs.system },
    ],
    [t, items.length],
  )

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={unread > 0 ? `${t.title} · ${unread} ${t.unread}` : t.title}
        subtitle={t.subtitle}
        actions={
          unread > 0 ? (
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCheck className="size-4" />
              {t.markAll}
            </Button>
          ) : undefined
        }
      />

      <Card>
        <div className="px-5 pt-2">
          <Tabs value={filter} onChange={setFilter} tabs={tabs} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<BellOff />} title={t.empty} body={t.emptyBody} />
        ) : (
          <div className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {filtered.map((item, index) => {
                const Icon = kindIcon[item.kind] ?? Bell
                return (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.25) }}
                    onClick={() => markRead(item.id)}
                    className={cn(
                      'flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-sunken/60',
                      !item.read && 'bg-brand-soft/30',
                    )}
                  >
                    <span className={cn('mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl', severityStyles[item.severity])}>
                      <Icon className="size-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={cn('text-sm text-ink', item.read ? 'font-medium' : 'font-semibold')}>{item.title[lang]}</span>
                        {!item.read && <span className="size-2 shrink-0 rounded-full bg-brand" />}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-ink-2">{item.body[lang]}</span>
                      <span className="tnum mt-1.5 block text-xs text-ink-3">{formatRelative(item.createdAt, lang)}</span>
                    </span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  )
}
