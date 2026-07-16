import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type Tone = 'brand' | 'gold' | 'danger' | 'ok' | 'info' | 'neutral'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand-2 dark:text-brand',
  gold: 'bg-gold-soft text-gold',
  danger: 'bg-danger-soft text-danger',
  ok: 'bg-ok-soft text-ok',
  info: 'bg-info-soft text-info',
  neutral: 'bg-sunken text-ink-2',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
