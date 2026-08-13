import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { storageGet, storageSet } from '@/shared/lib/storage'

export type Lang = 'uz' | 'ru' | 'en'

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

const STORAGE_KEY = 'xabarchi:lang'

/** BCP-47 locales used for Intl date/number formatting. */
export const INTL_LOCALE: Record<Lang, string> = {
  uz: 'uz-Latn-UZ',
  ru: 'ru-RU',
  en: 'en-GB',
}

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readStoredLang(): Lang {
  const raw = storageGet(STORAGE_KEY)
  return raw === 'uz' || raw === 'ru' || raw === 'en' ? raw : 'uz'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  // Keep <html lang> in sync with the restored preference on first paint too
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    storageSet(STORAGE_KEY, next)
    document.documentElement.lang = next
    setLangState(next)
  }, [])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useLang() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useLang must be used within I18nProvider')
  return ctx
}

/**
 * Resolve a per-feature dictionary to the active language.
 * Dictionaries live next to the feature that owns them:
 *   const t = useT({ uz: {...}, ru: {...}, en: {...} })
 */
export function useT<T>(dict: Record<Lang, T>): T {
  const { lang } = useLang()
  return dict[lang]
}
