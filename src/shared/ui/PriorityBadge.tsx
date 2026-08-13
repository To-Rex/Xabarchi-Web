import { Zap, Package, Megaphone } from 'lucide-react'
import type { SmsPriority } from '@/shared/api/types'
import { useT } from '@/shared/i18n'
import { Badge } from './Badge'

const dict = {
  uz: { urgent: 'Tezkor', transactional: 'Tranzaksion', bulk: 'Ommaviy' },
  ru: { urgent: 'Срочное', transactional: 'Транзакционное', bulk: 'Массовое' },
  en: { urgent: 'Urgent', transactional: 'Transactional', bulk: 'Bulk' },
}

const toneFor: Record<SmsPriority, 'gold' | 'info' | 'neutral'> = {
  urgent: 'gold',
  transactional: 'info',
  bulk: 'neutral',
}

const iconFor: Record<SmsPriority, typeof Zap> = {
  urgent: Zap,
  transactional: Package,
  bulk: Megaphone,
}

/** Queue-lane badge: urgent OTP jumps ahead, bulk rides the slow lane. */
export function PriorityBadge({ priority, className }: { priority: SmsPriority; className?: string }) {
  const t = useT(dict)
  const Icon = iconFor[priority]
  return (
    <Badge tone={toneFor[priority]} className={className}>
      <Icon className="size-3" />
      {t[priority]}
    </Badge>
  )
}
