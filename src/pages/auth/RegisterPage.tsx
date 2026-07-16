import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Building2, CheckCircle2, Lock, Mail, UserRound } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { delay } from '@/shared/api/mockClient'
import { Button, Input } from '@/shared/ui'
import { signIn } from '@/features/auth/model/authStore'

const dict = {
  uz: {
    meta: "Ro'yxatdan o'tish — Xabarchi",
    title: 'Hisob oching',
    subtitle: '1 daqiqa — va birinchi SMSingiz tayyor. Oyiga 500 SMS bepul.',
    name: 'Ismingiz',
    company: 'Kompaniya',
    email: 'Email',
    password: 'Parol',
    submit: 'Hisob ochish',
    haveAccount: 'Hisobingiz bormi?',
    login: 'Kirish',
    terms: 'Davom etish orqali siz foydalanish shartlari va maxfiylik siyosatiga rozilik bildirasiz.',
    successTitle: 'Hisobingiz tayyor!',
    successBody: 'Boshqaruv paneliga yo‘naltirilmoqdasiz…',
    errors: { name: 'Ismingizni kiriting', email: 'To‘g‘ri email kiriting', password: 'Parol kamida 6 belgi bo‘lsin' },
  },
  ru: {
    meta: 'Регистрация — Xabarchi',
    title: 'Создайте аккаунт',
    subtitle: '1 минута — и ваше первое SMS готово. 500 SMS в месяц бесплатно.',
    name: 'Ваше имя',
    company: 'Компания',
    email: 'Email',
    password: 'Пароль',
    submit: 'Создать аккаунт',
    haveAccount: 'Уже есть аккаунт?',
    login: 'Войти',
    terms: 'Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности.',
    successTitle: 'Аккаунт готов!',
    successBody: 'Перенаправляем в панель управления…',
    errors: { name: 'Введите имя', email: 'Введите корректный email', password: 'Пароль — минимум 6 символов' },
  },
  en: {
    meta: 'Create account — Xabarchi',
    title: 'Create your account',
    subtitle: 'One minute — and your first SMS is ready. 500 SMS a month free.',
    name: 'Your name',
    company: 'Company',
    email: 'Email',
    password: 'Password',
    submit: 'Create account',
    haveAccount: 'Already have an account?',
    login: 'Sign in',
    terms: 'By continuing you agree to the terms of service and privacy policy.',
    successTitle: 'Your account is ready!',
    successBody: 'Taking you to the dashboard…',
    errors: { name: 'Enter your name', email: 'Enter a valid email', password: 'Password must be at least 6 characters' },
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const next: Partial<typeof form> = {}
    if (form.name.trim().length < 2) next.name = t.errors.name
    if (!EMAIL_RE.test(form.email)) next.email = t.errors.email
    if (form.password.length < 6) next.password = t.errors.password
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    await delay(1100)
    setDone(true)
    await delay(1400)
    signIn()
    navigate('/app', { replace: true })
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="flex flex-col items-center py-16 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.1 }}
              className="flex size-16 items-center justify-center rounded-full bg-ok-soft"
            >
              <CheckCircle2 className="size-8 text-ok" />
            </motion.span>
            <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t.successTitle}</h1>
            <p className="mt-2 text-sm text-ink-2">{t.successBody}</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.title}</h1>
            <p className="mt-2 text-sm text-ink-2">{t.subtitle}</p>

            <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
              <Input label={t.name} placeholder="Jasur Karimov" value={form.name} onChange={set('name')} error={errors.name} leading={<UserRound className="size-4" />} autoComplete="name" />
              <Input label={t.company} placeholder="Samarqand Express" value={form.company} onChange={set('company')} leading={<Building2 className="size-4" />} autoComplete="organization" />
              <Input type="email" label={t.email} placeholder="siz@kompaniya.uz" value={form.email} onChange={set('email')} error={errors.email} leading={<Mail className="size-4" />} autoComplete="email" />
              <Input type="password" label={t.password} placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password} leading={<Lock className="size-4" />} autoComplete="new-password" />
              <Button type="submit" loading={loading} className="w-full" size="lg">
                {t.submit}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs leading-relaxed text-ink-3">{t.terms}</p>
            <p className="mt-6 text-center text-sm text-ink-2">
              {t.haveAccount}{' '}
              <Link to="/login" className="font-semibold text-brand transition-colors hover:text-brand-2">
                {t.login}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
