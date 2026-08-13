import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { adoptSession } from '@/features/auth/model/authStore'
import { Spinner } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Kirish — Xabarchi',
    working: 'Hisobingizga kiritilmoqda…',
    failed: 'Kirish amalga oshmadi. Qaytadan urinib ko‘ring.',
    back: 'Kirish sahifasiga qaytish',
  },
  ru: {
    meta: 'Вход — Xabarchi',
    working: 'Выполняется вход…',
    failed: 'Не удалось войти. Попробуйте ещё раз.',
    back: 'Вернуться ко входу',
  },
  en: {
    meta: 'Signing in — Xabarchi',
    working: 'Signing you in…',
    failed: 'Sign-in failed. Please try again.',
    back: 'Back to sign in',
  },
}

/**
 * OAuth landing page: the backend redirects here with
 * `#accessToken=...&refreshToken=...` (or `#error=<code>`).
 */
export default function AuthCallbackPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const params = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    // Wipe the tokens out of the address bar/history immediately.
    window.history.replaceState(null, '', window.location.pathname)

    if (!accessToken || !refreshToken) {
      setFailed(true)
      return
    }
    adoptSession({ accessToken, refreshToken })
      .then(() => navigate('/app', { replace: true }))
      .catch(() => setFailed(true))
  }, [navigate])

  return (
    <div className="flex flex-col items-center py-16 text-center">
      {failed ? (
        <>
          <p className="text-sm font-medium text-danger">{t.failed}</p>
          <Link to="/login" className="mt-4 text-sm font-semibold text-brand transition-colors hover:text-brand-2">
            {t.back}
          </Link>
        </>
      ) : (
        <>
          <Spinner className="size-6" />
          <p className="mt-4 text-sm text-ink-2">{t.working}</p>
        </>
      )}
    </div>
  )
}
