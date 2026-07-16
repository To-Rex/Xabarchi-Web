import { cn } from '@/shared/lib/cn'

/**
 * The Xabarchi signature: an SMS's journey drawn as a dashed path with a
 * traveling pulse — dashboard → SIM → recipient. Used in the hero, loading
 * and empty states.
 */
export function DispatchPath({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 240 24" fill="none" className={cn('text-brand', className)} aria-hidden>
      <circle cx="8" cy="12" r="4" fill="currentColor" opacity="0.9" />
      <path
        d="M16 12 H 104"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 12"
        opacity="0.55"
        className={animate ? 'animate-dash-travel' : undefined}
      />
      {/* SIM card waypoint */}
      <rect x="108" y="4" width="14" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9" />
      <path d="M112 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path
        d="M126 12 H 214"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 12"
        opacity="0.55"
        className={animate ? 'animate-dash-travel' : undefined}
      />
      {/* delivered double-tick */}
      <path d="M218 12.5l3 3 5.5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M224 15.5l6.5-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>
  )
}
