import { motion } from 'motion/react'
import { cn } from '@/shared/lib/cn'

interface ProgressBarProps {
  /** 0..1 */
  value: number
  tone?: 'brand' | 'gold' | 'danger' | 'ok'
  className?: string
}

const toneClass = { brand: 'bg-brand', gold: 'bg-gold', danger: 'bg-danger', ok: 'bg-ok' }

export function ProgressBar({ value, tone = 'brand', className }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value))
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-sunken', className)} role="progressbar" aria-valuenow={Math.round(clamped * 100)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className={cn('h-full rounded-full', toneClass[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${clamped * 100}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
