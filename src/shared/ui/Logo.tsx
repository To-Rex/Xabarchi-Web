import { cn } from '@/shared/lib/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-brand" />
      <path
        d="M8 11.5C8 9.567 9.567 8 11.5 8h9C22.433 8 24 9.567 24 11.5v5c0 1.933-1.567 3.5-3.5 3.5H14l-4.2 3.36c-.655.524-1.8.058-1.8-.782V11.5z"
        className="fill-brand-ink"
      />
      <path
        d="M12.5 14.2l2 2 4.5-4.4"
        className="stroke-brand"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-[17px] font-semibold tracking-tight text-ink">xabarchi</span>
    </span>
  )
}
