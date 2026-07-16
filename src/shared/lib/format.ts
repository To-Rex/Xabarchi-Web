import { INTL_LOCALE, type Lang } from '@/shared/i18n'

/** 998901234567 -> +998 90 123 45 67 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 12 || !digits.startsWith('998')) return raw
  return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`
}

/* Browsers often lack uz-Latn CLDR data (numbers fall back to en grouping,
 * months render as "M07"), so uz uses ru grouping and manual month names. */
const NUMBER_LOCALE: Record<Lang, string> = { uz: 'ru-RU', ru: 'ru-RU', en: 'en-GB' }
const UZ_MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']

export function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[lang]).format(value)
}

export function formatCompact(value: number, lang: Lang): string {
  return new Intl.NumberFormat(INTL_LOCALE[lang], { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

const CURRENCY_WORD: Record<Lang, string> = { uz: "so'm", ru: 'сум', en: 'UZS' }

export function formatMoney(value: number, lang: Lang): string {
  return `${formatNumber(value, lang)} ${CURRENCY_WORD[lang]}`
}

export function formatDate(date: Date | string, lang: Lang): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (lang === 'uz') return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

/** Axis-friendly "16 iyl" / "16 июл." / "16 Jul" */
export function formatDayMonth(date: Date | string, lang: Lang): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (lang === 'uz') return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]}`
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { day: 'numeric', month: 'short' }).format(d)
}

export function formatDateTime(date: Date | string, lang: Lang): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (lang === 'uz') {
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]}, ${time}`
  }
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatTime(date: Date | string, lang: Lang): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { hour: '2-digit', minute: '2-digit' }).format(d)
}

const REL_WORDS: Record<Lang, { now: string; min: string; hour: string; day: string }> = {
  uz: { now: 'hozirgina', min: 'daqiqa oldin', hour: 'soat oldin', day: 'kun oldin' },
  ru: { now: 'только что', min: 'мин. назад', hour: 'ч. назад', day: 'дн. назад' },
  en: { now: 'just now', min: 'min ago', hour: 'h ago', day: 'd ago' },
}

export function formatRelative(date: Date | string, lang: Lang): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60_000)
  const w = REL_WORDS[lang]
  if (mins < 1) return w.now
  if (mins < 60) return `${mins} ${w.min}`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ${w.hour}`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ${w.day}`
  return formatDate(d, lang)
}

/** GSM-7 vs UCS-2 aware SMS segment math. */
export function smsSegments(text: string): { chars: number; segments: number; perSegment: number; unicode: boolean } {
  // Latin Uzbek apostrophes (oʻ/gʻ) and Cyrillic force UCS-2
  const gsm7 =
    /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà^{}\\[\]~|€]*$/
  const unicode = !gsm7.test(text)
  const chars = text.length
  if (chars === 0) return { chars: 0, segments: 0, perSegment: unicode ? 70 : 160, unicode }
  const single = unicode ? 70 : 160
  const multi = unicode ? 67 : 153
  const segments = chars <= single ? 1 : Math.ceil(chars / multi)
  return { chars, segments, perSegment: segments === 1 ? single : multi, unicode }
}
