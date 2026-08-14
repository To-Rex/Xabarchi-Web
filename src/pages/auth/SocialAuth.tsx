import { useState } from 'react'
import { useT } from '@/shared/i18n'
import { API_BASE } from '@/shared/api/client'
import { Button } from '@/shared/ui'

const dict = {
  uz: { divider: 'yoki', google: 'Google bilan davom etish', apple: 'Apple bilan davom etish' },
  ru: { divider: 'или', google: 'Продолжить с Google', apple: 'Продолжить с Apple' },
  en: { divider: 'or', google: 'Continue with Google', apple: 'Continue with Apple' },
}

type Provider = 'google' | 'apple'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3a7.24 7.24 0 0 1-10.8-3.81H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.27a12 12 0 0 0 0 10.76l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.98 11.98 0 0 0 1.27 6.62l4 3.1A7.17 7.17 0 0 1 12 4.75Z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M17.05 12.54c-.03-2.89 2.36-4.28 2.47-4.35-1.35-1.97-3.44-2.24-4.18-2.27-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-1-1.94.03-3.72 1.13-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.49.96 1.39 2.1 2.94 3.6 2.88 1.44-.06 1.99-.93 3.73-.93s2.24.93 3.77.9c1.56-.03 2.55-1.41 3.5-2.8a12.5 12.5 0 0 0 1.58-3.25c-.04-.02-3.03-1.16-3.06-4.58ZM14.17 4.04c.8-.96 1.33-2.3 1.19-3.64-1.15.05-2.53.76-3.35 1.72-.74.85-1.38 2.21-1.2 3.52 1.27.1 2.57-.65 3.36-1.6Z" />
    </svg>
  )
}

/**
 * Real social sign-in: the backend owns the whole OAuth redirect flow.
 * We simply send the browser to its /start endpoint; it comes back to
 * /auth/callback with a token pair in the URL fragment.
 */
export function SocialAuth() {
  const t = useT(dict)
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null)

  const continueWith = (provider: Provider) => {
    if (loadingProvider) return
    setLoadingProvider(provider)
    // Tell the backend where to hand the tokens back to (this exact origin) so
    // localhost and the deployed site each return to themselves. The backend
    // allow-lists it against CORS_ORIGINS.
    const redirect = encodeURIComponent(window.location.origin)
    window.location.href = `${API_BASE}/auth/oauth/${provider}/start?redirect=${redirect}`
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-medium uppercase tracking-wider text-ink-3">{t.divider}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="secondary"
          loading={loadingProvider === 'google'}
          disabled={loadingProvider === 'apple'}
          onClick={() => continueWith('google')}
          aria-label={t.google}
          title={t.google}
        >
          <GoogleIcon />
          Google
        </Button>
        <Button
          type="button"
          variant="secondary"
          loading={loadingProvider === 'apple'}
          disabled={loadingProvider === 'google'}
          onClick={() => continueWith('apple')}
          aria-label={t.apple}
          title={t.apple}
        >
          <AppleIcon />
          Apple
        </Button>
      </div>
    </div>
  )
}
