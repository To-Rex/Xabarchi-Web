import { motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface Tab<T extends string> {
  value: T
  label: ReactNode
  count?: number
}

interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  tabs: Tab<T>[]
  className?: string
}

/** Underline tabs with a sliding indicator. */
export function Tabs<T extends string>({ value, onChange, tabs, className }: TabsProps<T>) {
  const layoutGroup = useId()
  return (
    <div role="tablist" className={cn('flex items-center gap-1 border-b border-line', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative -mb-px flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-brand' : 'text-ink-3 hover:text-ink-2',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'tnum rounded-full px-1.5 py-px text-[11px]',
                  active ? 'bg-brand-soft text-brand-2 dark:text-brand' : 'bg-sunken text-ink-3',
                )}
              >
                {tab.count}
              </span>
            )}
            {active && (
              <motion.span
                layoutId={`tab-underline-${layoutGroup}`}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
