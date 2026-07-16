import { cn } from '@/shared/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-shimmer rounded-lg bg-sunken', className)}
      style={{
        backgroundImage:
          'linear-gradient(90deg, transparent 25%, var(--x-line) 50%, transparent 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}
