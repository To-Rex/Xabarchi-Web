import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, Minus } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { formatNumber } from '@/shared/lib/format'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { cn } from '@/shared/lib/cn'
import { Badge, Button, Reveal, SegmentedControl } from '@/shared/ui'

const dict = {
  uz: {
    meta: { title: 'Narxlar — Xabarchi', desc: "Xabarchi tariflari: Start bepul, Biznes va Korxona — o'sishingizga mos." },
    title: 'Oddiy va halol narxlar',
    subtitle: "SMS uchun operatoringizga to'laysiz — biz faqat platforma uchun olamiz. Yashirin to'lovlar yo'q.",
    monthly: 'Oylik',
    yearly: 'Yillik',
    yearlyBonus: '−20%',
    popular: 'Eng ommabop',
    free: 'Bepul',
    perMonth: '/oy',
    cta: 'Boshlash',
    ctaBiz: 'Biznesni tanlash',
    contact: "Bog'lanish",
    plans: {
      start: { name: 'Start', desc: 'Sinab ko‘rish va kichik ehtiyojlar uchun' },
      biznes: { name: 'Biznes', desc: "O'sayotgan biznes uchun asosiy tarif" },
      korxona: { name: 'Korxona', desc: 'Yuqori hajm va maxsus talablar uchun' },
    },
    features: {
      sms: 'SMS / oy',
      devices: 'Qurilmalar',
      api: 'API va webhooklar',
      templates: 'Shablonlar',
      analytics: 'Kengaytirilgan analitika',
      support: 'Ustuvor qo‘llab-quvvatlash',
      sla: 'SLA kafolati',
    },
    tableTitle: 'Tariflarni solishtiring',
    note: "Barcha tariflarda: cheksiz kontaktlar, barcha statuslar bo'yicha jonli kuzatuv, 3 til.",
  },
  ru: {
    meta: { title: 'Цены — Xabarchi', desc: 'Тарифы Xabarchi: Start бесплатно, Biznes и Korxona — под ваш рост.' },
    title: 'Простые и честные цены',
    subtitle: 'За SMS вы платите своему оператору — мы берём только за платформу. Никаких скрытых платежей.',
    monthly: 'Помесячно',
    yearly: 'За год',
    yearlyBonus: '−20%',
    popular: 'Самый популярный',
    free: 'Бесплатно',
    perMonth: '/мес',
    cta: 'Начать',
    ctaBiz: 'Выбрать Biznes',
    contact: 'Связаться',
    plans: {
      start: { name: 'Start', desc: 'Чтобы попробовать и для небольших задач' },
      biznes: { name: 'Biznes', desc: 'Основной тариф для растущего бизнеса' },
      korxona: { name: 'Korxona', desc: 'Для больших объёмов и особых требований' },
    },
    features: {
      sms: 'SMS / месяц',
      devices: 'Устройства',
      api: 'API и вебхуки',
      templates: 'Шаблоны',
      analytics: 'Расширенная аналитика',
      support: 'Приоритетная поддержка',
      sla: 'Гарантия SLA',
    },
    tableTitle: 'Сравните тарифы',
    note: 'Во всех тарифах: безлимитные контакты, живое отслеживание статусов, 3 языка.',
  },
  en: {
    meta: { title: 'Pricing — Xabarchi', desc: 'Xabarchi plans: Start is free; Biznes and Korxona scale with you.' },
    title: 'Simple, honest pricing',
    subtitle: 'You pay your carrier for the SMS — we only charge for the platform. No hidden fees.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearlyBonus: '−20%',
    popular: 'Most popular',
    free: 'Free',
    perMonth: '/mo',
    cta: 'Get started',
    ctaBiz: 'Choose Biznes',
    contact: 'Contact us',
    plans: {
      start: { name: 'Start', desc: 'For trying it out and small needs' },
      biznes: { name: 'Biznes', desc: 'The go-to plan for a growing business' },
      korxona: { name: 'Korxona', desc: 'For high volume and special requirements' },
    },
    features: {
      sms: 'SMS / month',
      devices: 'Devices',
      api: 'API & webhooks',
      templates: 'Templates',
      analytics: 'Advanced analytics',
      support: 'Priority support',
      sla: 'SLA guarantee',
    },
    tableTitle: 'Compare plans',
    note: 'Every plan includes unlimited contacts, live status tracking and 3 languages.',
  },
}

const PLANS = [
  { id: 'start', monthly: 0, sms: 500, devices: 1, api: false, analytics: false, support: false, sla: false },
  { id: 'biznes', monthly: 149_000, sms: 10_000, devices: 5, api: true, analytics: true, support: false, sla: false },
  { id: 'korxona', monthly: 490_000, sms: 60_000, devices: 20, api: true, analytics: true, support: true, sla: true },
] as const

export default function PricingPage() {
  const t = useT(dict)
  const { lang } = useLang()
  usePageMeta(t.meta.title, t.meta.desc)
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const price = (monthly: number) => (period === 'yearly' ? Math.round((monthly * 0.8) / 1000) * 1000 : monthly)

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <Reveal className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-2">{t.subtitle}</p>
        <div className="mt-8 inline-flex">
          <SegmentedControl
            value={period}
            onChange={(value) => setPeriod(value)}
            segments={[
              { value: 'monthly', label: t.monthly },
              { value: 'yearly', label: <>{t.yearly} <Badge tone="brand" className="ml-1">{t.yearlyBonus}</Badge></> },
            ]}
          />
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan, index) => {
          const info = t.plans[plan.id]
          const isPopular = plan.id === 'biznes'
          return (
            <Reveal key={plan.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className={cn(
                  'relative flex h-full flex-col rounded-2xl border bg-surface p-7',
                  isPopular ? 'border-brand shadow-glow' : 'border-line shadow-card',
                )}
              >
                {isPopular && (
                  <Badge tone="brand" className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-card">
                    {t.popular}
                  </Badge>
                )}
                <h2 className="font-display text-lg font-semibold text-ink">{info.name}</h2>
                <p className="mt-1.5 min-h-10 text-sm text-ink-2">{info.desc}</p>
                <p className="mt-5">
                  {plan.monthly === 0 ? (
                    <span className="font-display text-3xl font-semibold text-ink">{t.free}</span>
                  ) : (
                    <>
                      <span className="tnum font-display text-3xl font-semibold text-ink">{formatNumber(price(plan.monthly), lang)}</span>
                      <span className="ml-1.5 text-sm text-ink-3">{lang === 'en' ? 'UZS' : lang === 'ru' ? 'сум' : "so'm"}{t.perMonth}</span>
                    </>
                  )}
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  <li className="flex items-center gap-2.5 text-ink">
                    <Check className="size-4 shrink-0 text-brand" />
                    <span className="tnum font-medium">{formatNumber(plan.sms, lang)}</span> {t.features.sms}
                  </li>
                  <li className="flex items-center gap-2.5 text-ink">
                    <Check className="size-4 shrink-0 text-brand" />
                    <span className="tnum font-medium">{plan.devices}</span> {t.features.devices}
                  </li>
                  {([['api', t.features.api], ['analytics', t.features.analytics], ['support', t.features.support], ['sla', t.features.sla]] as const).map(
                    ([key, label]) => (
                      <li key={key} className={cn('flex items-center gap-2.5', plan[key] ? 'text-ink' : 'text-ink-3')}>
                        {plan[key] ? <Check className="size-4 shrink-0 text-brand" /> : <Minus className="size-4 shrink-0 opacity-50" />}
                        {label}
                      </li>
                    ),
                  )}
                </ul>
                <Link to="/register" className="mt-7 block">
                  <Button variant={isPopular ? 'primary' : 'secondary'} className="w-full">
                    {plan.id === 'korxona' ? t.contact : plan.id === 'biznes' ? t.ctaBiz : t.cta}
                  </Button>
                </Link>
              </motion.div>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mt-10 text-center">
        <p className="text-sm text-ink-3">{t.note}</p>
      </Reveal>
    </div>
  )
}
