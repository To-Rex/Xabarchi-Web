import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { api } from '@/shared/api/client'
import { Spinner } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Email tasdiqlash — Xabarchi',
    working: 'Email tasdiqlanmoqda…',
    okTitle: 'Email tasdiqlandi!',
    okBody: 'Endi hisobingizga kirishingiz mumkin.',
    failTitle: 'Tasdiqlab bo‘lmadi',
    failBody: 'Havola eskirgan yoki yaroqsiz. Kirish sahifasidan xatni qayta yuborishingiz mumkin.',
    toApp: 'Kirishga o‘tish',
    toLogin: 'Kirish',
  },
  ru: {
    meta: 'Подтверждение email — Xabarchi',
    working: 'Подтверждаем email…',
    okTitle: 'Email подтверждён!',
    okBody: 'Теперь вы можете войти в аккаунт.',
    failTitle: 'Не удалось подтвердить',
    failBody: 'Ссылка устарела или недействительна. Отправьте её заново со страницы входа.',
    toApp: 'Перейти ко входу',
    toLogin: 'Войти',
  },
  en: {
    meta: 'Verify email — Xabarchi',
    working: 'Verifying your email…',
    okTitle: 'Email verified!',
    okBody: 'You can now sign in to your account.',
    failTitle: 'Verification failed',
    failBody: 'The link is expired or invalid. Resend it from the sign-in page.',
    toApp: 'Go to sign in',
    toLogin: 'Sign in',
  },
}

export default function VerifyEmailPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const [searchParams] = useSearchParams()
  const [state, setState] = useState<'working' | 'ok' | 'fail'>('working')
  const requested = useRef(false)

  useEffect(() => {
    if (requested.current) return
    requested.current = true
    const token = searchParams.get('token') ?? ''
    if (!token) {
      setState('fail')
      return
    }
    api('/auth/email/verify', { method: 'POST', body: { token }, auth: false })
      .then(() => setState('ok'))
      .catch(() => setState('fail'))
  }, [searchParams])

  return (
    <div className="flex flex-col items-center py-16 text-center">
      {state === 'working' && (
        <>
          <Spinner className="size-6" />
          <p className="mt-4 text-sm text-ink-2">{t.working}</p>
        </>
      )}
      {state === 'ok' && (
        <>
          <span className="flex size-16 items-center justify-center rounded-full bg-ok-soft">
            <CheckCircle2 className="size-8 text-ok" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t.okTitle}</h1>
          <p className="mt-2 text-sm text-ink-2">{t.okBody}</p>
          <Link to="/login" className="mt-6 text-sm font-semibold text-brand transition-colors hover:text-brand-2">
            {t.toApp}
          </Link>
        </>
      )}
      {state === 'fail' && (
        <>
          <span className="flex size-16 items-center justify-center rounded-full bg-danger-soft">
            <XCircle className="size-8 text-danger" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t.failTitle}</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-2">{t.failBody}</p>
          <Link to="/login" className="mt-6 text-sm font-semibold text-brand transition-colors hover:text-brand-2">
            {t.toLogin}
          </Link>
        </>
      )}
    </div>
  )
}
