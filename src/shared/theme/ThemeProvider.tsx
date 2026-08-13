import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { storageGet, storageSet } from '@/shared/lib/storage'

export type ThemePref = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'xabarchi:theme'

interface ThemeContextValue {
  pref: ThemePref
  isDark: boolean
  /**
   * Change the theme. Pass the pointer position (viewport px) of the control
   * that triggered it to run the circular reveal from that point.
   */
  setPref: (pref: ThemePref, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveDark(pref: ThemePref) {
  return pref === 'dark' || (pref === 'system' && systemPrefersDark())
}

function readStoredPref(): ThemePref {
  const raw = storageGet(STORAGE_KEY)
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(readStoredPref)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const applyDark = useCallback((dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark)
    setIsDark(dark)
  }, [])

  const setPref = useCallback(
    (next: ThemePref, origin?: { x: number; y: number }) => {
      storageSet(STORAGE_KEY, next)
      setPrefState(next)
      const nextDark = resolveDark(next)
      const current = document.documentElement.classList.contains('dark')
      if (nextDark === current) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduceMotion) {
        applyDark(nextDark)
        return
      }

      const transition = document.startViewTransition(() => {
        flushSync(() => applyDark(nextDark))
      })
      transition.ready.then(() => {
        const x = origin?.x ?? window.innerWidth / 2
        const y = origin?.y ?? 0
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 600,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
    },
    [applyDark],
  )

  // Follow OS theme while pref is "system"
  useEffect(() => {
    if (pref !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyDark(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [pref, applyDark])

  return <ThemeContext.Provider value={{ pref, isDark, setPref }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
