import { motion } from 'motion/react'
import { useId, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface Segment<T extends string> {
  value: T
  label: ReactNode
  ariaLabel?: string
}

interface SegmentedControlProps<T extends string> {
  value: T
  onChange: (value: T, event: MouseEvent) => void
  segments: Segment<T>[]
  size?: 'sm' | 'md'
  className?: string
}

export function SegmentedControl<T extends string>({ value, onChange, segments, size = 'md', className }: SegmentedControlProps<T>) {
  const layoutGroup = useId()
  return (
    <div
      role="tablist"
      className={cn('inline-flex items-center gap-0.5 rounded-xl border border-line bg-sunken p-0.5', className)}
    >
      {segments.map((segment) => {
        const active = segment.value === value
        return (
          <button
            key={segment.value}
            role="tab"
            aria-selected={active}
            aria-label={segment.ariaLabel}
            onClick={(event) => onChange(segment.value, event)}
            className={cn(
              'relative rounded-[10px] font-medium transition-colors duration-200',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-[13px]',
              active ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
            )}
          >
            {active && (
              <motion.span
                layoutId={`segment-${layoutGroup}`}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-[10px] bg-surface shadow-card"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">{segment.label}</span>
          </button>
        )
      })}
    </div>
  )
}
