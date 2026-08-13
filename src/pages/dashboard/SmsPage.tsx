import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, PenLine, RefreshCw, Search, Smartphone } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDateTime, formatPhone, formatTime } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { ApiError } from '@/shared/api/client'
import type { MessageStatus, SmsMessage } from '@/shared/api/types'
import { Button, Card, EmptyState, Input, MessageStatusBadge, Modal, PageHeader, PriorityBadge, Skeleton, Tabs, useToast } from '@/shared/ui'
import { fetchMessages, getContactName, getDeviceName, resendSms } from '@/features/sms/api/repository'

const dict = {
  uz: {
    meta: 'SMS xabarlar — Xabarchi',
    title: 'SMS xabarlar',
    subtitle: 'Yuborilgan barcha xabarlar tarixi va holati.',
    newSms: 'Yangi SMS',
    searchPlaceholder: 'Raqam, matn yoki ism bo‘yicha qidirish',
    tabs: { all: 'Barchasi', delivered: 'Yetkazildi', sent: 'Yuborildi', queued: 'Navbatda', failed: 'Xato' },
    cols: { recipient: 'Qabul qiluvchi', text: 'Matn', device: 'Qurilma', time: 'Vaqt', status: 'Holat' },
    empty: 'Hali xabar yo‘q',
    emptyBody: 'Birinchi SMSingizni yuboring — tarix shu yerda ko‘rinadi.',
    detail: {
      title: 'Xabar tafsilotlari',
      to: 'Qabul qiluvchi',
      device: 'Qurilma',
      segments: 'Segmentlar',
      created: 'Yaratildi',
      delivered: 'Yetkazildi',
      failReason: 'Sabab',
      reasons: { no_signal: 'Signal yo‘q', invalid_number: 'Raqam noto‘g‘ri', device_offline: 'Qurilma oflayn' },
    },
    resend: 'Qayta yuborish',
    resentToast: 'SMS qayta navbatga qo‘shildi',
    resendFailed: 'Qayta yuborib bo‘lmadi',
    pageOf: (page: number, total: number) => `${page} / ${total}-sahifa`,
  },
  ru: {
    meta: 'SMS сообщения — Xabarchi',
    title: 'SMS сообщения',
    subtitle: 'История и статус всех отправленных сообщений.',
    newSms: 'Новое SMS',
    searchPlaceholder: 'Поиск по номеру, тексту или имени',
    tabs: { all: 'Все', delivered: 'Доставлено', sent: 'Отправлено', queued: 'В очереди', failed: 'Ошибка' },
    cols: { recipient: 'Получатель', text: 'Текст', device: 'Устройство', time: 'Время', status: 'Статус' },
    empty: 'Сообщений пока нет',
    emptyBody: 'Отправьте первое SMS — история появится здесь.',
    detail: {
      title: 'Детали сообщения',
      to: 'Получатель',
      device: 'Устройство',
      segments: 'Сегменты',
      created: 'Создано',
      delivered: 'Доставлено',
      failReason: 'Причина',
      reasons: { no_signal: 'Нет сигнала', invalid_number: 'Неверный номер', device_offline: 'Устройство офлайн' },
    },
    resend: 'Отправить снова',
    resentToast: 'SMS снова добавлено в очередь',
    resendFailed: 'Не удалось отправить снова',
    pageOf: (page: number, total: number) => `Стр. ${page} из ${total}`,
  },
  en: {
    meta: 'SMS messages — Xabarchi',
    title: 'SMS messages',
    subtitle: 'History and status of everything you have sent.',
    newSms: 'New SMS',
    searchPlaceholder: 'Search by number, text or name',
    tabs: { all: 'All', delivered: 'Delivered', sent: 'Sent', queued: 'Queued', failed: 'Failed' },
    cols: { recipient: 'Recipient', text: 'Text', device: 'Device', time: 'Time', status: 'Status' },
    empty: 'No messages yet',
    emptyBody: 'Send your first SMS — the history will appear here.',
    detail: {
      title: 'Message details',
      to: 'Recipient',
      device: 'Device',
      segments: 'Segments',
      created: 'Created',
      delivered: 'Delivered',
      failReason: 'Reason',
      reasons: { no_signal: 'No signal', invalid_number: 'Invalid number', device_offline: 'Device offline' },
    },
    resend: 'Resend',
    resentToast: 'SMS re-queued',
    resendFailed: 'Could not resend',
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
  },
}

type StatusTab = 'all' | Extract<MessageStatus, 'delivered' | 'sent' | 'queued' | 'failed'>

function useDebounced<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return debounced
}

export default function SmsPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()

  const [tab, setTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<SmsMessage | null>(null)
  const [resending, setResending] = useState(false)
  const debouncedSearch = useDebounced(search)

  const pageSize = 12
  const { data, loading, error, refetch } = useAsync(
    () => fetchMessages({ status: tab, search: debouncedSearch, page, pageSize }),
    [tab, debouncedSearch, page],
  )

  useEffect(() => {
    setPage(1)
  }, [tab, debouncedSearch])

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1
  const counts = data?.countsByStatus

  const resend = async (message: SmsMessage) => {
    setResending(true)
    try {
      await resendSms(message.id)
      toast('success', t.resentToast, formatPhone(message.to))
      setSelected(null)
      refetch()
    } catch (err) {
      toast('error', err instanceof ApiError ? err.message : t.resendFailed)
    } finally {
      setResending(false)
    }
  }

  const tabs = useMemo(
    () => [
      { value: 'all' as const, label: t.tabs.all, count: counts?.all },
      { value: 'delivered' as const, label: t.tabs.delivered, count: counts?.delivered },
      { value: 'sent' as const, label: t.tabs.sent, count: counts?.sent },
      { value: 'queued' as const, label: t.tabs.queued, count: counts?.queued },
      { value: 'failed' as const, label: t.tabs.failed, count: counts?.failed },
    ],
    [t, counts],
  )

  return (
    <div>
      <PageHeader
        title={t.title}
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

      <Card>
        <div className="flex flex-col gap-3 border-b border-line px-5 pt-4">
          <Input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            leading={<Search className="size-4" />}
            aria-label={c.search}
            containerClassName="max-w-md"
          />
          <div className="-mx-2 overflow-x-auto px-2">
            <Tabs value={tab} onChange={setTab} tabs={tabs} className="border-b-0" />
          </div>
        </div>

        {error ? (
          <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
        ) : loading || !data ? (
          <div className="space-y-2.5 p-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          debouncedSearch || tab !== 'all' ? (
            <EmptyState icon={<Search />} title={c.noResults} body={c.noResultsBody} />
          ) : (
            <EmptyState
              title={t.empty}
              body={t.emptyBody}
              action={
                <Link to="/app/sms/new">
                  <Button>{t.newSms}</Button>
                </Link>
              }
            />
          )
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-3">
                    <th className="px-5 py-3 font-semibold">{t.cols.recipient}</th>
                    <th className="px-3 py-3 font-semibold">{t.cols.text}</th>
                    <th className="px-3 py-3 font-semibold">{t.cols.device}</th>
                    <th className="px-3 py-3 font-semibold">{t.cols.time}</th>
                    <th className="px-5 py-3 text-right font-semibold">{t.cols.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((message, index) => {
                    const name = getContactName(message.contactId)
                    return (
                      <motion.tr
                        key={message.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
                        onClick={() => setSelected(message)}
                        className="cursor-pointer border-b border-line transition-colors last:border-none hover:bg-sunken/60"
                      >
                        <td className="px-5 py-3.5">
                          {name && <p className="font-medium text-ink">{name}</p>}
                          <p className={cn('tnum font-mono text-[13px]', name ? 'text-ink-3' : 'text-ink')}>{formatPhone(message.to)}</p>
                        </td>
                        <td className="max-w-72 px-3 py-3.5">
                          <span className="flex items-center gap-2">
                            <PriorityBadge priority={message.priority} className="shrink-0" />
                            <span className="truncate text-ink-2">{message.text}</span>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-ink-2">
                          <span className="inline-flex items-center gap-1.5">
                            <Smartphone className="size-3.5 text-ink-3" />
                            {getDeviceName(message.deviceId)}
                          </span>
                        </td>
                        <td className="tnum whitespace-nowrap px-3 py-3.5 text-ink-2">{formatDateTime(message.createdAt, lang)}</td>
                        <td className="px-5 py-3.5 text-right">
                          <MessageStatusBadge status={message.status} />
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {data.items.map((message) => {
                const name = getContactName(message.contactId)
                return (
                  <button
                    key={message.id}
                    onClick={() => setSelected(message)}
                    className="w-full rounded-xl border border-line p-3.5 text-left transition-colors hover:border-line-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="tnum font-mono text-[13px] font-medium text-ink">{name ?? formatPhone(message.to)}</span>
                      <MessageStatusBadge status={message.status} />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] text-ink-2">{message.text}</p>
                    <p className="mt-1.5 flex items-center justify-between gap-2">
                      <PriorityBadge priority={message.priority} />
                      <span className="tnum text-xs text-ink-3">{formatDateTime(message.createdAt, lang)}</span>
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
                <span className="tnum text-[13px] text-ink-3">{t.pageOf(page, totalPages)}</span>
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label={c.back}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} aria-label={c.next}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={t.detail.title}
        closeLabel={c.close}
        footer={
          selected && (
            <Button loading={resending} onClick={() => resend(selected)}>
              <RefreshCw className="size-4" />
              {t.resend}
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="rounded-2xl rounded-bl-md bg-brand-soft p-4">
              <p className="text-sm leading-relaxed text-ink">{selected.text}</p>
              <p className="tnum mt-2 flex items-center justify-end gap-1.5 text-xs text-ink-3">
                {formatTime(selected.createdAt, lang)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">{t.detail.to}</dt>
                <dd className="tnum mt-1 font-mono text-ink">{formatPhone(selected.to)}</dd>
                {getContactName(selected.contactId) && <dd className="text-[13px] text-ink-2">{getContactName(selected.contactId)}</dd>}
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">{t.detail.device}</dt>
                <dd className="mt-1 text-ink">{getDeviceName(selected.deviceId)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">{t.detail.created}</dt>
                <dd className="tnum mt-1 text-ink">{formatDateTime(selected.createdAt, lang)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">
                  {selected.status === 'failed' ? t.detail.failReason : t.detail.delivered}
                </dt>
                <dd className="mt-1 text-ink">
                  {selected.status === 'failed' && selected.failReason
                    ? t.detail.reasons[selected.failReason]
                    : selected.deliveredAt
                      ? formatDateTime(selected.deliveredAt, lang)
                      : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">{t.detail.segments}</dt>
                <dd className="tnum mt-1 text-ink">{selected.segments}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">{t.cols.status}</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  <MessageStatusBadge status={selected.status} />
                  <PriorityBadge priority={selected.priority} />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}
