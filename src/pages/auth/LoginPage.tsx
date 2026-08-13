import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { ApiError } from '@/shared/api/client'
import { Button, Input } from '@/shared/ui'
import { login } from '@/features/auth/model/authStore'
import { SocialAuth } from './SocialAuth'

const dict = {
  uz: {
    meta: 'Kirish — Xabarchi',
    title: 'Qaytganingizdan xursandmiz',
    subtitle: 'Hisobingizga kiring va yuborishni davom eting.',
    email: 'Email',
    password: 'Parol',
    forgot: 'Parolni unutdingizmi?',
    submit: 'Kirish',
    noAccount: 'Hisobingiz yo‘qmi?',
    register: "Ro'yxatdan o'tish",
    errors: {
      email: 'To‘g‘ri email kiriting',
      password: 'Parol kamida 8 belgi bo‘lsin',
      credentials: 'Email yoki parol noto‘g‘ri.',
      network: 'Server bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.',
    },
    showPassword: 'Parolni ko‘rsatish',
  },
  ru: {
    meta: 'Вход — Xabarchi',
    title: 'Рады видеть вас снова',
    subtitle: 'Войдите в аккаунт и продолжайте отправлять.',
    email: 'Email',
    password: 'Пароль',
    forgot: 'Забыли пароль?',
    submit: 'Войти',
    noAccount: 'Нет аккаунта?',
    register: 'Зарегистрироваться',
    errors: {
      email: 'Введите корректный email',
      password: 'Пароль — минимум 8 символов',
      credentials: 'Неверный email или пароль.',
      network: 'Не удалось связаться с сервером. Попробуйте ещё раз.',
    },
    showPassword: 'Показать пароль',
  },
  en: {
    meta: 'Sign in — Xabarchi',
    title: 'Welcome back',
    subtitle: 'Sign in to your account and keep sending.',
    email: 'Email',
    password: 'Password',
    forgot: 'Forgot password?',
    submit: 'Sign in',
    noAccount: 'No account yet?',
    register: 'Create one',
    errors: {
      email: 'Enter a valid email',
      password: 'Password must be at least 8 characters',
      credentials: 'Wrong email or password.',
      network: 'Could not reach the server. Please try again.',
    },
    showPassword: 'Show password',
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!EMAIL_RE.test(email)) next.email = t.errors.email
    if (password.length < 8) next.password = t.errors.password
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      await login(email, password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/app', { replace: true })
    } catch (error) {
      setErrors({
        form: error instanceof ApiError && error.status === 401 ? t.errors.credentials : t.errors.network,
      })
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.title}</h1>
      <p className="mt-2 text-sm text-ink-2">{t.subtitle}</p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <Input
          type="email"
          label={t.email}
          placeholder="siz@kompaniya.uz"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          leading={<Mail className="size-4" />}
          autoComplete="email"
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          label={t.password}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          leading={<Lock className="size-4" />}
          autoComplete="current-password"
          trailing={
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={t.showPassword} className="p-1 text-ink-3 transition-colors hover:text-ink">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-[13px] font-medium text-brand transition-colors hover:text-brand-2">
            {t.forgot}
          </Link>
        </div>
        {errors.form && <p className="text-[13px] font-medium text-danger">{errors.form}</p>}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          {t.submit}
        </Button>
      </form>

      <SocialAuth />

      <p className="mt-6 text-center text-sm text-ink-2">
        {t.noAccount}{' '}
        <Link to="/register" className="font-semibold text-brand transition-colors hover:text-brand-2">
          {t.register}
        </Link>
      </p>
    </motion.div>
  )
}
