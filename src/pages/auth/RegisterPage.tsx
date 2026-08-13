import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Building2, Lock, Mail, MailCheck, Phone, UserRound } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { ApiError } from '@/shared/api/client'
import { Button, Input } from '@/shared/ui'
import { register, resendVerification } from '@/features/auth/model/authStore'
import { SocialAuth } from './SocialAuth'

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
    phone: 'Telefon',
    successTitle: 'Emailingizni tasdiqlang',
    successBody: 'Tasdiqlash havolasini quyidagi manzilga yubordik. Kirishdan oldin havolani bosib, emailingizni tasdiqlang.',
    successSpam: 'Xat kelmadimi? “Spam” papkasini ham tekshiring.',
    resend: 'Xatni qayta yuborish',
    resendDone: 'Yuborildi ✓',
    backToLogin: 'Kirishga o‘tish',
    errors: {
      name: 'Ismingizni kiriting',
      email: 'To‘g‘ri email kiriting',
      password: 'Parol kamida 8 belgi bo‘lsin',
      phone: 'Telefon raqamini kiriting',
      company: 'Kompaniya nomini kiriting',
      emailTaken: 'Bu email allaqachon ro‘yxatdan o‘tgan',
      network: 'Server bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.',
    },
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
    phone: 'Телефон',
    successTitle: 'Подтвердите email',
    successBody: 'Мы отправили ссылку для подтверждения на адрес ниже. Подтвердите email перед входом.',
    successSpam: 'Письма нет? Проверьте папку «Спам».',
    resend: 'Отправить письмо снова',
    resendDone: 'Отправлено ✓',
    backToLogin: 'Перейти ко входу',
    errors: {
      name: 'Введите имя',
      email: 'Введите корректный email',
      password: 'Пароль — минимум 8 символов',
      phone: 'Введите номер телефона',
      company: 'Введите название компании',
      emailTaken: 'Этот email уже зарегистрирован',
      network: 'Не удалось связаться с сервером. Попробуйте ещё раз.',
    },
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
    phone: 'Phone',
    successTitle: 'Verify your email',
    successBody: 'We sent a verification link to the address below. Confirm your email before signing in.',
    successSpam: 'No email? Check your “Spam” folder too.',
    resend: 'Resend email',
    resendDone: 'Sent ✓',
    backToLogin: 'Go to sign in',
    errors: {
      name: 'Enter your name',
      email: 'Enter a valid email',
      password: 'Password must be at least 8 characters',
      phone: 'Enter your phone number',
      company: 'Enter your company name',
      emailTaken: 'This email is already registered',
      network: 'Could not reach the server. Please try again.',
    },
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState<Partial<typeof form> & { form?: string }>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const resend = async () => {
    if (resending || !sentEmail) return
    setResending(true)
    try {
      await resendVerification(sentEmail)
      setResent(true)
    } finally {
      setResending(false)
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const next: Partial<typeof form> = {}
    if (form.name.trim().length < 2) next.name = t.errors.name
    if (form.company.trim().length < 1) next.company = t.errors.company
    if (!EMAIL_RE.test(form.email)) next.email = t.errors.email
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = t.errors.phone
    if (form.password.length < 8) next.password = t.errors.password
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    const [firstName, ...rest] = form.name.trim().split(/\s+/)
    try {
      await register({
        firstName,
        lastName: rest.join(' ') || firstName,
        email: form.email,
        phone: form.phone.replace(/\D/g, ''),
        company: form.company.trim(),
        password: form.password,
      })
      setSentEmail(form.email)
      setDone(true)
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError && error.code === 'email_taken'
            ? t.errors.emailTaken
            : error instanceof ApiError
              ? error.message
              : t.errors.network,
      })
      setLoading(false)
    }
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
            className="flex flex-col items-center py-12 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.1 }}
              className="flex size-16 items-center justify-center rounded-full bg-brand-soft"
            >
              <MailCheck className="size-8 text-brand" />
            </motion.span>
            <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t.successTitle}</h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">{t.successBody}</p>
            <p className="tnum mt-3 rounded-lg bg-sunken px-3 py-1.5 font-mono text-sm font-medium text-ink">{sentEmail}</p>
            <p className="mt-3 text-xs text-ink-3">{t.successSpam}</p>
            <Button variant="secondary" className="mt-6" loading={resending} disabled={resent} onClick={resend}>
              {resent ? t.resendDone : t.resend}
            </Button>
            <Link to="/login" className="mt-4 text-sm font-semibold text-brand transition-colors hover:text-brand-2">
              {t.backToLogin}
            </Link>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.title}</h1>
            <p className="mt-2 text-sm text-ink-2">{t.subtitle}</p>

            <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
              <Input label={t.name} placeholder="Jasur Karimov" value={form.name} onChange={set('name')} error={errors.name} leading={<UserRound className="size-4" />} autoComplete="name" />
              <Input label={t.company} placeholder="Samarqand Express" value={form.company} onChange={set('company')} error={errors.company} leading={<Building2 className="size-4" />} autoComplete="organization" />
              <Input type="email" label={t.email} placeholder="siz@kompaniya.uz" value={form.email} onChange={set('email')} error={errors.email} leading={<Mail className="size-4" />} autoComplete="email" />
              <Input type="tel" label={t.phone} placeholder="998 90 123 45 67" value={form.phone} onChange={set('phone')} error={errors.phone} leading={<Phone className="size-4" />} autoComplete="tel" />
              <Input type="password" label={t.password} placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password} leading={<Lock className="size-4" />} autoComplete="new-password" />
              {errors.form && <p className="text-[13px] font-medium text-danger">{errors.form}</p>}
              <Button type="submit" loading={loading} className="w-full" size="lg">
                {t.submit}
              </Button>
            </form>

            <SocialAuth />

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
