import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib/cn'
import { DispatchPath } from './DispatchPath'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  body?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}
    >
      {icon ? (
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand [&_svg]:size-6">
          {icon}
        </div>
      ) : (
        <DispatchPath className="mb-5 w-44 opacity-70" />
      )}
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-2">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
