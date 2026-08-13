import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Lock } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { api, ApiError } from '@/shared/api/client'
import { Button, Input } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Yangi parol — Xabarchi',
    title: 'Yangi parol o‘rnating',
    subtitle: 'Hisobingiz uchun yangi parol kiriting.',
    password: 'Yangi parol',
    confirm: 'Parolni takrorlang',
    submit: 'Parolni yangilash',
    back: 'Kirish sahifasiga qaytish',
    errors: {
      password: 'Parol kamida 8 belgi bo‘lsin',
      mismatch: 'Parollar mos kelmadi',
      token: 'Havola eskirgan yoki yaroqsiz. Qayta so‘rang.',
      network: 'Server bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.',
    },
  },
  ru: {
    meta: 'Новый пароль — Xabarchi',
    title: 'Задайте новый пароль',
    subtitle: 'Введите новый пароль для аккаунта.',
    password: 'Новый пароль',
    confirm: 'Повторите пароль',
    submit: 'Обновить пароль',
    back: 'Вернуться ко входу',
    errors: {
      password: 'Пароль — минимум 8 символов',
      mismatch: 'Пароли не совпадают',
      token: 'Ссылка устарела или недействительна. Запросите новую.',
      network: 'Не удалось связаться с сервером. Попробуйте ещё раз.',
    },
  },
  en: {
    meta: 'New password — Xabarchi',
    title: 'Set a new password',
    subtitle: 'Enter a new password for your account.',
    password: 'New password',
    confirm: 'Repeat password',
    submit: 'Update password',
    back: 'Back to sign in',
    errors: {
      password: 'Password must be at least 8 characters',
      mismatch: 'Passwords do not match',
      token: 'The link is expired or invalid. Request a new one.',
      network: 'Could not reach the server. Please try again.',
    },
  },
}

export default function ResetPasswordPage() {
  const t = useT(dict)
  usePageMeta(t.meta)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (password.length < 8) return setError(t.errors.password)
    if (password !== confirm) return setError(t.errors.mismatch)
    setError(undefined)
    setLoading(true)
    try {
      await api('/auth/password/reset', { method: 'POST', body: { token, password }, auth: false })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? t.errors.token : t.errors.network)
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.title}</h1>
      <p className="mt-2 text-sm text-ink-2">{t.subtitle}</p>
      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <Input
          type="password"
          label={t.password}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          leading={<Lock className="size-4" />}
          autoComplete="new-password"
        />
        <Input
          type="password"
          label={t.confirm}
          placeholder="••••••••"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          leading={<Lock className="size-4" />}
          autoComplete="new-password"
        />
        {error && <p className="text-[13px] font-medium text-danger">{error}</p>}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          {t.submit}
        </Button>
      </form>
      <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="size-4" />
        {t.back}
      </Link>
    </motion.div>
  )
}
