import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { delay } from '@/shared/api/mockClient'
import { Button, Input } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Parolni tiklash — Xabarchi',
    title: 'Parolni tiklash',
    subtitle: 'Emailingizni kiriting — tiklash havolasini yuboramiz.',
    email: 'Email',
    submit: 'Havola yuborish',
    back: 'Kirish sahifasiga qaytish',
    sentTitle: 'Havola yuborildi',
    sentBody: (email: string) => `${email} manziliga parolni tiklash havolasini yubordik. Pochta qutingizni tekshiring.`,
    resend: 'Qayta yuborish',
    error: 'To‘g‘ri email kiriting',
  },
  ru: {
    meta: 'Восстановление пароля — Xabarchi',
    title: 'Восстановление пароля',
    subtitle: 'Введите email — отправим ссылку для сброса.',
    email: 'Email',
    submit: 'Отправить ссылку',
    back: 'Вернуться ко входу',
    sentTitle: 'Ссылка отправлена',
    sentBody: (email: string) => `Мы отправили ссылку для сброса пароля на ${email}. Проверьте почту.`,
    resend: 'Отправить ещё раз',
    error: 'Введите корректный email',
  },
  en: {
    meta: 'Reset password — Xabarchi',
    title: 'Reset your password',
    subtitle: 'Enter your email — we’ll send a reset link.',
    email: 'Email',
    submit: 'Send reset link',
    back: 'Back to sign in',
    sentTitle: 'Link sent',
    sentBody: (email: string) => `We sent a password reset link to ${email}. Check your inbox.`,
    resend: 'Send again',
    error: 'Enter a valid email',
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setError(t.error)
      return
    }
    setError(undefined)
    setLoading(true)
    await delay(900)
    setLoading(false)
    setSent(true)
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-brand-soft">
              <MailCheck className="size-8 text-brand" />
            </span>
            <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t.sentTitle}</h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">{t.sentBody(email)}</p>
            <Button variant="ghost" className="mt-6" onClick={() => setSent(false)}>
              {t.resend}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.title}</h1>
            <p className="mt-2 text-sm text-ink-2">{t.subtitle}</p>
            <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
              <Input
                type="email"
                label={t.email}
                placeholder="siz@kompaniya.uz"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={error}
                leading={<Mail className="size-4" />}
                autoComplete="email"
              />
              <Button type="submit" loading={loading} className="w-full" size="lg">
                {t.submit}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="size-4" />
        {t.back}
      </Link>
    </div>
  )
}
