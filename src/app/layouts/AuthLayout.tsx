import { Link, Outlet } from 'react-router-dom'
import { motion } from 'motion/react'
import { useT } from '@/shared/i18n'
import { DispatchPath, LangSwitcher, Logo, ThemeToggle } from '@/shared/ui'

const dict = {
  uz: {
    quote: '«Kuryer xizmatimiz kuniga 700 ta SMS yuboradi. Aggregator o‘rniga o‘z telefonlarimizdan foydalanamiz — xarajat 6 barobar kamaydi.»',
    author: 'Jasur Karimov',
    role: 'Samarqand Express asoschisi',
    stats: [
      ['2,4 mln+', 'yuborilgan SMS'],
      ['1 200+', 'faol biznes'],
      ['99,1%', 'yetkazish darajasi'],
    ],
  },
  ru: {
    quote: '«Наша курьерская служба отправляет 700 SMS в день. Вместо агрегатора используем свои телефоны — расходы упали в 6 раз.»',
    author: 'Жасур Каримов',
    role: 'Основатель Samarqand Express',
    stats: [
      ['2,4 млн+', 'отправленных SMS'],
      ['1 200+', 'активных бизнесов'],
      ['99,1%', 'доставляемость'],
    ],
  },
  en: {
    quote: '“Our courier service sends 700 SMS a day. We use our own phones instead of an aggregator — costs dropped 6×.”',
    author: 'Jasur Karimov',
    role: 'Founder, Samarqand Express',
    stats: [
      ['2.4M+', 'SMS sent'],
      ['1,200+', 'active businesses'],
      ['99.1%', 'delivery rate'],
    ],
  },
}

export function AuthLayout() {
  const t = useT(dict)
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,44%)]">
      <div className="relative flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Xabarchi">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <LangSwitcher compact />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-line bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* quiet tile-grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(var(--x-line) 1px, transparent 1px), linear-gradient(90deg, var(--x-line) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div aria-hidden className="absolute -right-32 -top-32 size-96 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative">
          <DispatchPath className="w-64" />
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <blockquote className="text-balance text-xl font-medium leading-relaxed text-ink">{t.quote}</blockquote>
          <figcaption className="mt-5">
            <p className="font-semibold text-ink">{t.author}</p>
            <p className="text-sm text-ink-2">{t.role}</p>
          </figcaption>
        </motion.figure>

        <div className="relative grid grid-cols-3 gap-6">
          {t.stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-xl font-semibold text-brand">{value}</p>
              <p className="mt-1 text-[13px] text-ink-2">{label}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
