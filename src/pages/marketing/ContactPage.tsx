import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Clock4, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { CONTACT } from '@/shared/config/contact'
import { Button, Input, Reveal, Select, Textarea, useToast } from '@/shared/ui'

const dict = {
  uz: {
    meta: { title: 'Aloqa — Xabarchi', desc: "Xabarchi jamoasi bilan bog'laning: telefon, email, Telegram yoki forma orqali." },
    title: "Biz bilan bog'laning",
    subtitle: "Savolingiz bormi? Yozing yoki qo'ng'iroq qiling — ish kunlari bir necha soat ichida javob beramiz.",
    cards: {
      phone: 'Telefon',
      phoneHint: 'Du–Ju, 9:00–18:00',
      email: 'Email',
      emailHint: 'Bir ish kunida javob beramiz',
      address: 'Manzil',
      addressHint: "O'zbekiston",
      hours: 'Ish vaqti',
      hoursValue: 'Du–Ju, 9:00–18:00',
      hoursHint: 'Shanba va yakshanba — dam olish',
    },
    telegram: "Telegram'da yozish",
    form: {
      title: 'Xabar qoldiring',
      name: 'Ismingiz',
      namePlaceholder: 'Jasur Karimov',
      email: 'Email',
      emailPlaceholder: 'siz@kompaniya.uz',
      topic: 'Mavzu',
      topics: { general: 'Umumiy savol', sales: 'Tariflar va sotuv', tech: 'Texnik yordam', api: 'API va integratsiya' },
      message: 'Xabar',
      messagePlaceholder: 'Savolingizni yozing…',
      submit: 'Yuborish',
      errors: { name: 'Ismingizni kiriting', email: 'To‘g‘ri email kiriting', message: 'Xabar matnini kiriting' },
    },
    success: {
      title: 'Xabaringiz yuborildi!',
      body: 'Rahmat! Ish kunlari bir necha soat ichida ko‘rsatgan emailingizga javob beramiz.',
      again: 'Yana xabar yozish',
    },
    toast: 'Xabar yuborildi',
  },
  ru: {
    meta: { title: 'Контакты — Xabarchi', desc: 'Свяжитесь с командой Xabarchi: телефон, email, Telegram или форма.' },
    title: 'Свяжитесь с нами',
    subtitle: 'Есть вопрос? Напишите или позвоните — в рабочие дни отвечаем в течение нескольких часов.',
    cards: {
      phone: 'Телефон',
      phoneHint: 'Пн–Пт, 9:00–18:00',
      email: 'Email',
      emailHint: 'Отвечаем в течение рабочего дня',
      address: 'Адрес',
      addressHint: 'Узбекистан',
      hours: 'Часы работы',
      hoursValue: 'Пн–Пт, 9:00–18:00',
      hoursHint: 'Суббота и воскресенье — выходные',
    },
    telegram: 'Написать в Telegram',
    form: {
      title: 'Оставьте сообщение',
      name: 'Ваше имя',
      namePlaceholder: 'Жасур Каримов',
      email: 'Email',
      emailPlaceholder: 'vy@kompaniya.uz',
      topic: 'Тема',
      topics: { general: 'Общий вопрос', sales: 'Тарифы и продажи', tech: 'Техническая поддержка', api: 'API и интеграция' },
      message: 'Сообщение',
      messagePlaceholder: 'Опишите ваш вопрос…',
      submit: 'Отправить',
      errors: { name: 'Введите имя', email: 'Введите корректный email', message: 'Введите текст сообщения' },
    },
    success: {
      title: 'Сообщение отправлено!',
      body: 'Спасибо! В рабочие дни мы ответим на указанный email в течение нескольких часов.',
      again: 'Написать ещё',
    },
    toast: 'Сообщение отправлено',
  },
  en: {
    meta: { title: 'Contact — Xabarchi', desc: 'Get in touch with the Xabarchi team: phone, email, Telegram or the form.' },
    title: 'Get in touch',
    subtitle: 'Have a question? Write or call — on business days we reply within a few hours.',
    cards: {
      phone: 'Phone',
      phoneHint: 'Mon–Fri, 9:00–18:00',
      email: 'Email',
      emailHint: 'We reply within one business day',
      address: 'Address',
      addressHint: 'Uzbekistan',
      hours: 'Working hours',
      hoursValue: 'Mon–Fri, 9:00–18:00',
      hoursHint: 'Closed on weekends',
    },
    telegram: 'Message on Telegram',
    form: {
      title: 'Leave a message',
      name: 'Your name',
      namePlaceholder: 'Jasur Karimov',
      email: 'Email',
      emailPlaceholder: 'you@company.uz',
      topic: 'Topic',
      topics: { general: 'General question', sales: 'Plans and sales', tech: 'Technical support', api: 'API and integration' },
      message: 'Message',
      messagePlaceholder: 'Describe your question…',
      submit: 'Send',
      errors: { name: 'Enter your name', email: 'Enter a valid email', message: 'Enter the message text' },
    },
    success: {
      title: 'Message sent!',
      body: 'Thank you! On business days we reply to your email within a few hours.',
      again: 'Write another',
    },
    toast: 'Message sent',
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactPage() {
  const t = useT(dict)
  usePageMeta(t.meta.title, t.meta.desc)
  const toast = useToast()

  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = t.form.errors.name
    if (!EMAIL_RE.test(form.email)) next.email = t.form.errors.email
    if (form.message.trim().length < 5) next.message = t.form.errors.message
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSending(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSending(false)
    setSent(true)
    toast('success', t.toast)
  }

  const cards = [
    {
      icon: Phone,
      label: t.cards.phone,
      value: (
        <a href={`tel:${CONTACT.phone}`} className="tnum font-mono transition-colors hover:text-brand">
          {CONTACT.phoneDisplay}
        </a>
      ),
      hint: t.cards.phoneHint,
    },
    {
      icon: Mail,
      label: t.cards.email,
      value: (
        <a href={`mailto:${CONTACT.email}`} className="break-all transition-colors hover:text-brand">
          {CONTACT.email}
        </a>
      ),
      hint: t.cards.emailHint,
    },
    { icon: MapPin, label: t.cards.address, value: CONTACT.address, hint: t.cards.addressHint },
    { icon: Clock4, label: t.cards.hours, value: t.cards.hoursValue, hint: t.cards.hoursHint },
  ]

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <Reveal className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-2">{t.subtitle}</p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Contact details */}
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card, index) => (
              <Reveal key={card.label} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-pop">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <card.icon className="size-4.5" />
                  </span>
                  <p className="mt-3.5 text-[13px] font-medium text-ink-3">{card.label}</p>
                  <p className="mt-1 text-[15px] font-semibold text-ink">{card.value}</p>
                  <p className="mt-1 text-[13px] text-ink-2">{card.hint}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.35}>
            <a href={CONTACT.telegram} target="_blank" rel="noreferrer" className="mt-5 block">
              <Button variant="secondary" className="w-full sm:w-auto">
                <Send className="size-4" />
                {t.telegram}
              </Button>
            </a>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.15}>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.1 }}
                    className="flex size-16 items-center justify-center rounded-full bg-ok-soft"
                  >
                    <CheckCircle2 className="size-8 text-ok" />
                  </motion.span>
                  <h2 className="mt-6 font-display text-xl font-semibold text-ink">{t.success.title}</h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">{t.success.body}</p>
                  <Button
                    variant="secondary"
                    className="mt-7"
                    onClick={() => {
                      setSent(false)
                      setForm({ name: '', email: '', topic: 'general', message: '' })
                    }}
                  >
                    {t.success.again}
                  </Button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} onSubmit={submit} noValidate>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{t.form.title}</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Input
                      label={t.form.name}
                      placeholder={t.form.namePlaceholder}
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <Input
                      type="email"
                      label={t.form.email}
                      placeholder={t.form.emailPlaceholder}
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      error={errors.email}
                      autoComplete="email"
                    />
                    <Select
                      label={t.form.topic}
                      value={form.topic}
                      onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
                      containerClassName="sm:col-span-2"
                    >
                      {Object.entries(t.form.topics).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                    <Textarea
                      label={t.form.message}
                      placeholder={t.form.messagePlaceholder}
                      value={form.message}
                      onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                      error={errors.message}
                      rows={5}
                      containerClassName="sm:col-span-2"
                    />
                  </div>
                  <Button type="submit" size="lg" loading={sending} className="mt-6 w-full sm:w-auto">
                    <Send className="size-4" />
                    {t.form.submit}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
