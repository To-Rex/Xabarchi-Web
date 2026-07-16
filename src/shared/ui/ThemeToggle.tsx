import { Moon, Sun, MonitorSmartphone } from 'lucide-react'
import { useTheme, type ThemePref } from '@/shared/theme/ThemeProvider'
import { SegmentedControl } from './SegmentedControl'
import { cn } from '@/shared/lib/cn'

/** Compact icon button — cycles light → dark with a circular reveal from the cursor. */
export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, setPref } = useTheme()
  return (
    <button
      onClick={(event) => setPref(isDark ? 'light' : 'dark', { x: event.clientX, y: event.clientY })}
      aria-label={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-xl border border-line text-ink-2',
        'transition-all duration-200 hover:border-line-2 hover:text-ink',
        className,
      )}
    >
      <span className="relative block size-4">
        <Sun
          className={cn(
            'absolute inset-0 size-4 transition-all duration-300',
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 size-4 transition-all duration-300',
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
          )}
        />
      </span>
    </button>
  )
}

/** Full three-way control for settings pages. */
export function ThemeSegmented({ labels }: { labels: Record<ThemePref, string> }) {
  const { pref, setPref } = useTheme()
  return (
    <SegmentedControl
      value={pref}
      onChange={(value, event) => setPref(value, { x: event.clientX, y: event.clientY })}
      segments={[
        { value: 'light', label: <><Sun className="size-3.5" /> {labels.light}</>, ariaLabel: labels.light },
        { value: 'dark', label: <><Moon className="size-3.5" /> {labels.dark}</>, ariaLabel: labels.dark },
        { value: 'system', label: <><MonitorSmartphone className="size-3.5" /> {labels.system}</>, ariaLabel: labels.system },
      ]}
    />
  )
}
