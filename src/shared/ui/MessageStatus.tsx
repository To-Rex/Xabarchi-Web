import type { MessageStatus } from '@/shared/api/types'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib/cn'
import { Badge } from './Badge'

const dict = {
  uz: { queued: 'Navbatda', sending: 'Yuborilmoqda', sent: 'Yuborildi', delivered: 'Yetkazildi', failed: 'Xato', canceled: 'Bekor qilindi' },
  ru: { queued: 'В очереди', sending: 'Отправляется', sent: 'Отправлено', delivered: 'Доставлено', failed: 'Ошибка', canceled: 'Отменено' },
  en: { queued: 'Queued', sending: 'Sending', sent: 'Sent', delivered: 'Delivered', failed: 'Failed', canceled: 'Canceled' },
}

const toneFor: Record<MessageStatus, 'gold' | 'info' | 'brand' | 'ok' | 'danger' | 'neutral'> = {
  queued: 'gold',
  sending: 'info',
  sent: 'brand',
  delivered: 'ok',
  failed: 'danger',
  canceled: 'neutral',
}

/** Single tick = sent, double tick = delivered — like the messengers people know. */
function Ticks({ status }: { status: MessageStatus }) {
  if (status === 'queued' || status === 'sending')
    return <span className={cn('size-1.5 rounded-full bg-current', status === 'sending' && 'animate-pulse-soft')} />
  if (status === 'failed' || status === 'canceled')
    return (
      <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  return (
    <svg viewBox="0 0 16 12" className="h-3 w-4" fill="none" aria-hidden>
      <path d="M1.5 6.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {status === 'delivered' && (
        <path d="M8 9l1 1 5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  const t = useT(dict)
  return (
    <Badge tone={toneFor[status]}>
      <Ticks status={status} />
      {t[status]}
    </Badge>
  )
}
