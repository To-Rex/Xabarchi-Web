import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { login } from '@/features/auth/model/authStore'
import { Spinner } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Demo — Xabarchi',
    working: 'Demo hisob ochilmoqda…',
    failed: 'Demo hozircha mavjud emas. Keyinroq urinib ko‘ring.',
    back: 'Bosh sahifaga qaytish',
  },
  ru: {
    meta: 'Демо — Xabarchi',
    working: 'Открываем демо-аккаунт…',
    failed: 'Демо сейчас недоступно. Попробуйте позже.',
    back: 'На главную',
  },
  en: {
    meta: 'Demo — Xabarchi',
    working: 'Opening the demo account…',
    failed: 'The demo is unavailable right now. Try again later.',
    back: 'Back home',
  },
}

/** /demo — signs into the shared demo account and lands on the dashboard. */
export default function DemoPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    login('demo@xabarchi.uz', 'demo1234')
      .then(() => navigate('/app', { replace: true }))
      .catch(() => setFailed(true))
  }, [navigate])

  return (
    <div className="flex flex-col items-center py-16 text-center">
      {failed ? (
        <>
          <p className="text-sm font-medium text-danger">{t.failed}</p>
          <Link to="/" className="mt-4 text-sm font-semibold text-brand transition-colors hover:text-brand-2">
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
