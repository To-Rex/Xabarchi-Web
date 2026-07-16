import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { Button, Logo } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Sahifa topilmadi — Xabarchi',
    title: 'Xabar manzilga yetmadi',
    body: "Bu sahifa mavjud emas yoki ko'chirilgan. Bosh sahifaga qaytib, yo'lni qayta boshlang.",
    home: 'Bosh sahifa',
    app: 'Boshqaruv paneli',
  },
  ru: {
    meta: 'Страница не найдена — Xabarchi',
    title: 'Сообщение не дошло до адресата',
    body: 'Этой страницы не существует или она была перемещена. Вернитесь на главную и начните путь заново.',
    home: 'На главную',
    app: 'Панель управления',
  },
  en: {
    meta: 'Page not found — Xabarchi',
    title: 'The message never arrived',
    body: 'This page doesn’t exist or has moved. Head back home and start the route again.',
    home: 'Home',
    app: 'Dashboard',
  },
}

export default function NotFoundPage() {
  const t = useT(dict)
  usePageMeta(t.meta)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Link to="/" aria-label="Xabarchi">
        <Logo />
      </Link>

      {/* a dispatch path that never completes */}
      <motion.svg
        viewBox="0 0 240 24"
        className="mt-12 w-64 text-brand"
        fill="none"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <circle cx="8" cy="12" r="4" fill="currentColor" opacity="0.9" />
        <path d="M16 12 H 150" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 12" opacity="0.55" className="animate-dash-travel" />
        <path d="M162 6l12 12M174 6l-12 12" stroke="var(--x-danger)" strokeWidth="2.4" strokeLinecap="round" />
      </motion.svg>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="tnum mt-8 font-mono text-sm font-medium tracking-[0.3em] text-ink-3"
      >
        404
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.5 }}
        className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
      >
        {t.title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-3 max-w-md text-sm leading-relaxed text-ink-2"
      >
        {t.body}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.5 }}
        className="mt-8 flex gap-3"
      >
        <Link to="/">
          <Button variant="secondary">{t.home}</Button>
        </Link>
        <Link to="/app">
          <Button>{t.app}</Button>
        </Link>
      </motion.div>
    </div>
  )
}
