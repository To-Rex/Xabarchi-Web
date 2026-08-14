import { useEffect, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  BatteryFull,
  Bot,
  Braces,
  FileText,
  Image,
  Inbox,
  Power,
  QrCode,
  PlayCircle,
  Send,
  Settings,
  ShieldCheck,
  SignalHigh,
  Smartphone,
  Sparkles,
  Users,
  Wifi,
  Zap,
} from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { formatCompact } from '@/shared/lib/format'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { cn } from '@/shared/lib/cn'
import { AnimatedNumber, Button, CodeBlock, Reveal } from '@/shared/ui'

const dict = {
  uz: {
    meta: { title: 'Xabarchi — SMS platformasi', desc: "O'z Android telefoningiz orqali SMS yuboring. Aggregatorlarsiz, o'z SIM-kartangiz bilan." },
    hero: {
      eyebrow: 'Biznes uchun SMS shlyuz',
      title1: 'SMS yuboring.',
      title2: "O'z telefoningizdan.",
      body: "Xabarchi oddiy Android telefonni biznesingizning SMS shlyuziga aylantiradi. Aggregator shartnomalari, oldindan to'lovlar va murakkab hujjatlarsiz — o'z SIM-kartangiz, o'z tarifingiz.",
      ctaPrimary: 'Bepul boshlash',
      ctaDemo: 'Jonli demo',
      ctaSecondary: "API hujjatlari",
      note: 'Kredit karta shart emas · 500 SMS/oy bepul',
      phoneApp: 'Xabarchi Android',
      dashboardChip: 'Boshqaruv paneli',
      phoneStatus: 'Ishlayapti',
      phoneSent: 'Bugun',
      phoneBattery: 'Batareya',
      phoneSignal: 'Signal',
      phoneQueue: 'Navbat',
      phoneHistory: 'Tarix',
    },
    how: {
      eyebrow: 'Qanday ishlaydi',
      title: '3 daqiqada ishga tushiring',
      steps: [
        { title: 'Ilovani o‘rnating', body: "Android telefoningizga Xabarchi ilovasini yuklab oling. Eski telefon ham bo'laveradi — Android 8 va undan yuqori." },
        { title: 'QR orqali ulang', body: 'Boshqaruv panelidagi QR kodni skanerlang — telefon hisobingizga xavfsiz bog‘lanadi va shlyuzga aylanadi.' },
        { title: 'Yuborishni boshlang', body: 'Panel, shablonlar yoki API orqali xabar yuboring. Har bir SMS holati jonli kuzatiladi: navbatda → yuborildi → yetkazildi.' },
      ],
    },
    features: {
      eyebrow: 'Imkoniyatlar',
      title: 'Katta platformalar darajasida.\nO‘z telefoningiz narxida.',
      items: [
        { title: 'Bir nechta qurilma', body: "Bir hisobga bir nechta telefon ulang. Yuklama avtomatik taqsimlanadi, biri o'chsa — navbat boshqasiga o'tadi." },
        { title: 'Shablonlar', body: "OTP, buyurtma, eslatma — {ism} kabi o'zgaruvchilar bilan tayyor matnlar. Bir marta yozing, ming marta yuboring." },
        { title: 'Kontaktlar va guruhlar', body: 'Mijozlar bazasini guruhlar bilan tartibda saqlang. Ommaviy yuborish — ikki bosishda.' },
        { title: 'Jonli analitika', body: 'Yetkazish darajasi, qurilma yuklamasi, xarajatlar — hammasi bitta ekranda, real vaqtda.' },
        { title: 'Dasturchilar uchun API', body: 'REST API va webhooklar. CRM yoki saytingizdan to‘g‘ridan-to‘g‘ri SMS yuboring — 5 qator kod bilan.' },
        { title: 'Xavfsizlik', body: 'Xabarlar shifrlangan kanal orqali o‘tadi. Kalitlar faqat sizda — biz matnlarni saqlamaymiz.' },
      ],
    },
    stats: {
      title: 'Raqamlar o‘zi gapiradi',
      items: [
        { value: 2_400_000, label: 'yuborilgan SMS', compact: true },
        { value: 1200, label: 'faol biznes', compact: false },
        { value: 99.1, label: 'yetkazish darajasi, %', compact: false },
        { value: 3400, label: 'ulangan qurilma', compact: false },
      ],
    },
    api: {
      eyebrow: 'Dasturchilarga',
      title: 'Bitta so‘rov — SMS yo‘lda',
      body: 'Toza REST API, aniq hujjatlar, webhooklar va rasmiy SDKlar. Sinov kalitini oling-da, 5 daqiqada birinchi xabaringizni yuboring.',
      cta: 'Hujjatlarni ochish',
    },
    telegram: {
      eyebrow: 'Yangi xizmat',
      title: 'Telegram bot ham — o‘sha bitta paneldan',
      body: "Kompaniyangizning o'z Telegram botini ulang va obunachilarga istalgan turdagi kontent yuboring — SMS bilan yonma-yon, alohida xizmat sifatida.",
      kinds: ['Matn', 'Rasm', 'Video', 'Fayllar', 'Tugmali postlar', 'Havolalar'],
      future: 'Tez orada: bot orqali mijozlar oqimini boshqarish — avto-javoblar, voronkalar va segmentlar.',
      cta: 'Batafsil hujjatlarda',
    },
    testimonials: {
      eyebrow: 'Mijozlar fikri',
      title: 'Bizga ishonishadi',
      items: [
        { text: 'Klinikamiz kuniga 300 ta eslatma yuboradi. Qabulga kelmaslik 40% ga kamaydi, SMS xarajati esa deyarli nolga tushdi.', name: 'Dilnoza Rahimova', role: 'MediPlus Klinika, administrator' },
        { text: 'CRM tizimimizga API orqali uladik — yarim kunda. Endi har bir buyurtma statusi mijozga avtomatik boradi.', name: 'Otabek Nazarov', role: 'Havas Market, IT direktor' },
        { text: 'Eski ikkita telefonni shlyuz qildik. Oyiga 2 mln so‘m tejaymiz va hech qanday shartnoma imzolamadik.', name: 'Sardor Berdiyev', role: 'Tez Dostavka, asoschi' },
      ],
    },
    cta: {
      title: 'Bugun birinchi SMSingizni yuboring',
      body: "Ro'yxatdan o'tish 1 daqiqa. Oyiga 500 SMS — doim bepul.",
      button: 'Hisob ochish',
    },
  },
  ru: {
    meta: { title: 'Xabarchi — SMS платформа', desc: 'Отправляйте SMS через собственный Android-телефон. Без агрегаторов, со своей SIM-картой.' },
    hero: {
      eyebrow: 'SMS-шлюз для бизнеса',
      title1: 'Отправляйте SMS.',
      title2: 'Со своего телефона.',
      body: 'Xabarchi превращает обычный Android-телефон в SMS-шлюз вашего бизнеса. Без договоров с агрегаторами, предоплат и бумажной волокиты — ваша SIM-карта, ваш тариф.',
      ctaPrimary: 'Начать бесплатно',
      ctaDemo: 'Живое демо',
      ctaSecondary: 'API документация',
      note: 'Без кредитной карты · 500 SMS/мес бесплатно',
      phoneApp: 'Xabarchi Android',
      dashboardChip: 'Панель управления',
      phoneStatus: 'Работает',
      phoneSent: 'Сегодня',
      phoneBattery: 'Батарея',
      phoneSignal: 'Сигнал',
      phoneQueue: 'Очередь',
      phoneHistory: 'История',
    },
    how: {
      eyebrow: 'Как это работает',
      title: 'Запуск за 3 минуты',
      steps: [
        { title: 'Установите приложение', body: 'Скачайте приложение Xabarchi на Android-телефон. Подойдёт и старый — Android 8 и выше.' },
        { title: 'Подключите по QR', body: 'Отсканируйте QR-код из панели — телефон безопасно привяжется к аккаунту и станет шлюзом.' },
        { title: 'Начните отправлять', body: 'Отправляйте из панели, по шаблонам или через API. Статус каждого SMS виден вживую: в очереди → отправлено → доставлено.' },
      ],
    },
    features: {
      eyebrow: 'Возможности',
      title: 'Уровень больших платформ.\nПо цене вашего телефона.',
      items: [
        { title: 'Несколько устройств', body: 'Подключите несколько телефонов к одному аккаунту. Нагрузка распределяется автоматически, при сбое очередь переходит на другой.' },
        { title: 'Шаблоны', body: 'OTP, заказы, напоминания — готовые тексты с переменными вроде {имя}. Напишите один раз, отправляйте тысячи.' },
        { title: 'Контакты и группы', body: 'Держите базу клиентов в порядке с группами. Массовая рассылка — в два клика.' },
        { title: 'Живая аналитика', body: 'Доставляемость, нагрузка устройств, расходы — всё на одном экране, в реальном времени.' },
        { title: 'API для разработчиков', body: 'REST API и вебхуки. Отправляйте SMS прямо из CRM или сайта — 5 строк кода.' },
        { title: 'Безопасность', body: 'Сообщения идут по шифрованному каналу. Ключи только у вас — мы не храним тексты.' },
      ],
    },
    stats: {
      title: 'Цифры говорят сами',
      items: [
        { value: 2_400_000, label: 'отправлено SMS', compact: true },
        { value: 1200, label: 'активных бизнесов', compact: false },
        { value: 99.1, label: 'доставляемость, %', compact: false },
        { value: 3400, label: 'подключённых устройств', compact: false },
      ],
    },
    api: {
      eyebrow: 'Разработчикам',
      title: 'Один запрос — SMS в пути',
      body: 'Чистый REST API, понятная документация, вебхуки и официальные SDK. Возьмите тестовый ключ и отправьте первое сообщение за 5 минут.',
      cta: 'Открыть документацию',
    },
    telegram: {
      eyebrow: 'Новый сервис',
      title: 'Telegram-бот — из той же панели',
      body: 'Подключите собственного Telegram-бота компании и отправляйте подписчикам контент любого типа — отдельный сервис рядом с SMS.',
      kinds: ['Текст', 'Фото', 'Видео', 'Файлы', 'Посты с кнопками', 'Ссылки'],
      future: 'Скоро: управление потоком клиентов через бота — автоответы, воронки и сегменты.',
      cta: 'Подробнее в документации',
    },
    testimonials: {
      eyebrow: 'Отзывы клиентов',
      title: 'Нам доверяют',
      items: [
        { text: 'Наша клиника отправляет 300 напоминаний в день. Неявки снизились на 40%, а расходы на SMS упали почти до нуля.', name: 'Дильноза Рахимова', role: 'MediPlus Klinika, администратор' },
        { text: 'Подключили к нашей CRM через API за полдня. Теперь статус каждого заказа уходит клиенту автоматически.', name: 'Отабек Назаров', role: 'Havas Market, IT-директор' },
        { text: 'Сделали шлюз из двух старых телефонов. Экономим 2 млн сум в месяц и не подписали ни одного договора.', name: 'Сардор Бердиев', role: 'Tez Dostavka, основатель' },
      ],
    },
    cta: {
      title: 'Отправьте первое SMS сегодня',
      body: 'Регистрация занимает 1 минуту. 500 SMS в месяц — бесплатно навсегда.',
      button: 'Создать аккаунт',
    },
  },
  en: {
    meta: { title: 'Xabarchi — SMS platform', desc: 'Send SMS through your own Android phone. No aggregators — your SIM card, your rates.' },
    hero: {
      eyebrow: 'SMS gateway for business',
      title1: 'Send SMS.',
      title2: 'From your own phone.',
      body: 'Xabarchi turns an ordinary Android phone into your business SMS gateway. No aggregator contracts, prepayments or paperwork — your SIM card, your rates.',
      ctaPrimary: 'Start for free',
      ctaDemo: 'Live demo',
      ctaSecondary: 'API docs',
      note: 'No credit card required · 500 SMS/mo free',
      phoneApp: 'Xabarchi Android',
      dashboardChip: 'Dashboard',
      phoneStatus: 'Running',
      phoneSent: 'Today',
      phoneBattery: 'Battery',
      phoneSignal: 'Signal',
      phoneQueue: 'Queue',
      phoneHistory: 'History',
    },
    how: {
      eyebrow: 'How it works',
      title: 'Live in 3 minutes',
      steps: [
        { title: 'Install the app', body: 'Download the Xabarchi app to an Android phone. An old one works fine — Android 8 and up.' },
        { title: 'Pair with a QR', body: 'Scan the QR code from your dashboard — the phone securely links to your account and becomes a gateway.' },
        { title: 'Start sending', body: 'Send from the dashboard, templates or the API. Watch every SMS live: queued → sent → delivered.' },
      ],
    },
    features: {
      eyebrow: 'Features',
      title: 'Big-platform power.\nAt the price of your own phone.',
      items: [
        { title: 'Multiple devices', body: 'Connect several phones to one account. Load balances automatically; if one drops, the queue reroutes to another.' },
        { title: 'Templates', body: 'OTP, orders, reminders — ready-made texts with variables like {name}. Write once, send thousands.' },
        { title: 'Contacts & groups', body: 'Keep your customer base tidy with groups. Bulk sending takes two clicks.' },
        { title: 'Live analytics', body: 'Delivery rate, device load, spending — all on one screen, in real time.' },
        { title: 'Developer API', body: 'REST API and webhooks. Send SMS straight from your CRM or website — 5 lines of code.' },
        { title: 'Security', body: 'Messages travel over an encrypted channel. Keys stay with you — we never store your texts.' },
      ],
    },
    stats: {
      title: 'The numbers speak',
      items: [
        { value: 2_400_000, label: 'SMS sent', compact: true },
        { value: 1200, label: 'active businesses', compact: false },
        { value: 99.1, label: 'delivery rate, %', compact: false },
        { value: 3400, label: 'connected devices', compact: false },
      ],
    },
    api: {
      eyebrow: 'For developers',
      title: 'One request — SMS on its way',
      body: 'A clean REST API, clear docs, webhooks and official SDKs. Grab a test key and send your first message in 5 minutes.',
      cta: 'Open the docs',
    },
    telegram: {
      eyebrow: 'New service',
      title: 'A Telegram bot — from the same dashboard',
      body: 'Connect your company’s own Telegram bot and push any kind of content to its subscribers — a standalone service next to SMS.',
      kinds: ['Text', 'Photos', 'Video', 'Files', 'Posts with buttons', 'Links'],
      future: 'Coming soon: manage your customer flow through the bot — auto-replies, funnels and segments.',
      cta: 'More in the docs',
    },
    testimonials: {
      eyebrow: 'Customer stories',
      title: 'Trusted by teams',
      items: [
        { text: 'Our clinic sends 300 reminders a day. No-shows dropped 40%, and our SMS costs fell to almost nothing.', name: 'Dilnoza Rahimova', role: 'MediPlus Klinika, administrator' },
        { text: 'We wired it into our CRM via the API in half a day. Every order status now reaches the customer automatically.', name: 'Otabek Nazarov', role: 'Havas Market, IT director' },
        { text: 'We turned two old phones into a gateway. We save 2M UZS a month and never signed a single contract.', name: 'Sardor Berdiyev', role: 'Tez Dostavka, founder' },
      ],
    },
    cta: {
      title: 'Send your first SMS today',
      body: 'Sign-up takes 1 minute. 500 SMS a month — free forever.',
      button: 'Create account',
    },
  },
}

/* ------------------------------------------------------------------------ */
/* Hero phone: live dispatch simulation — the page's signature moment        */
/* ------------------------------------------------------------------------ */

interface SimMessage {
  id: number
  to: string
  text: string
  stage: 0 | 1 | 2 // 0 queued, 1 sent, 2 delivered
}

const SIM_POOL: { to: string; text: string }[] = [
  { to: '+998 90 123 45 67', text: 'Buyurtmangiz #4213 qabul qilindi ✅' },
  { to: '+998 93 555 77 13', text: 'Tasdiqlash kodingiz: 48213' },
  { to: '+998 91 782 24 40', text: 'Kuryer Sardor yo‘lga chiqdi 🛵' },
  { to: '+998 97 214 90 05', text: 'Ertaga 15:00 da qabulga yozilgansiz' },
  { to: '+998 88 402 11 76', text: 'Buyurtma #4225 yetkazib berildi' },
]

function StageTicks({ stage }: { stage: SimMessage['stage'] }) {
  if (stage === 0) return <span className="size-1.5 animate-pulse-soft rounded-full bg-gold" />
  return (
    <svg viewBox="0 0 16 12" className="h-3 w-4 text-ok" fill="none" aria-hidden>
      <path d="M1.5 6.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {stage === 2 && <path d="M8 9l1 1 5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

// Module-level so a StrictMode remount never reuses an id (duplicate keys)
let simMessageId = 0

function HeroPhone({ ui }: { ui: Record<string, string> }) {
  const [items, setItems] = useState<SimMessage[]>([])
  const [sentToday, setSentToday] = useState(128)
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const dailyLimit = 800

  // 3D tilt: cursor position over the mock, normalized to [-0.5, 0.5]
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 160, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 160, damping: 20, mass: 0.6 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-11, 11])
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9])
  const glareX = useTransform(sx, [-0.5, 0.5], ['32%', '68%'])
  const glareY = useTransform(sy, [-0.5, 0.5], ['22%', '58%'])
  const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(255,255,255,0.14), transparent 62%)`

  const onTiltMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - rect.left) / rect.width - 0.5)
    my.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const onTiltLeave = () => {
    setHovered(false)
    mx.set(0)
    my.set(0)
  }

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    setItems([])

    const spawn = () => {
      if (cancelled) return
      const seed = SIM_POOL[simMessageId % SIM_POOL.length]
      const msgId = ++simMessageId
      setItems((prev) => [...prev.slice(-4), { id: msgId, ...seed, stage: 0 }])
      timers.push(
        setTimeout(() => setItems((prev) => prev.map((m) => (m.id === msgId ? { ...m, stage: 1 } : m))), 1100),
        setTimeout(() => {
          setItems((prev) => prev.map((m) => (m.id === msgId ? { ...m, stage: 2 } : m)))
          setSentToday((n) => n + 1) // a delivery ticks the "sent today" counter
        }, 2300),
        setTimeout(spawn, 3000),
      )
    }
    spawn()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div
      className="relative mx-auto w-full max-w-md"
      style={{ perspective: '1200px' }}
      onMouseMove={onTiltMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onTiltLeave}
    >
      {/* dashboard chip feeding the phone */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute -left-2 top-6 z-10 hidden items-center gap-2 rounded-xl border border-line bg-raised px-3 py-2 shadow-card sm:flex"
      >
        <span className="size-2 rounded-full bg-brand" />
        <span className="text-xs font-medium text-ink-2">{ui.dashboardChip}</span>
      </motion.div>

      {/* dashed feed line into the phone */}
      <svg className="absolute left-10 top-14 hidden h-24 w-24 text-brand sm:block" viewBox="0 0 96 96" fill="none" aria-hidden>
        <path
          d="M6 6 C 6 60, 40 78, 88 82"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 10"
          className="animate-dash-travel"
          opacity="0.6"
        />
      </svg>

      {/* the phone — iPhone 17 Pro Max */}
      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative ml-auto w-[270px] sm:w-[290px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 3D tilt layer: follows the cursor, springs back on leave */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          animate={{ scale: hovered && !reduceMotion ? 1.025 : 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
        {/* titanium frame */}
        <div className="relative rounded-[3rem] bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-300 p-[3px] shadow-pop dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-600">
          {/* action button */}
          <span aria-hidden className="absolute -left-[2px] top-[5.5rem] h-6 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
          {/* volume up / down */}
          <span aria-hidden className="absolute -left-[2px] top-[8.5rem] h-11 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
          <span aria-hidden className="absolute -left-[2px] top-[11.75rem] h-11 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
          {/* power button */}
          <span aria-hidden className="absolute -right-[2px] top-[9.5rem] h-16 w-[3px] rounded-r-md bg-zinc-400 dark:bg-zinc-600" />
          {/* camera control */}
          <span aria-hidden className="absolute -right-[2px] top-[23rem] h-9 w-[3px] rounded-r-md bg-zinc-400 dark:bg-zinc-600" />
          {/* black bezel */}
          <div className="rounded-[2.85rem] bg-zinc-950 p-[7px]">
            {/* edge-to-edge screen */}
            <div className="relative overflow-hidden rounded-[2.45rem] bg-sunken dark:bg-bg">
              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-2.5 z-10 flex h-[26px] w-[92px] -translate-x-1/2 items-center justify-end rounded-full bg-zinc-950 pr-2.5">
                <span className="size-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700/70" />
              </div>
              <div className="px-4 pb-2 pt-2.5">
                {/* status bar */}
                <div className="flex h-[26px] items-center justify-between px-2 text-[11px] font-semibold text-ink-2">
                  <span className="tnum">09:41</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-ink-3">
                    <svg viewBox="0 0 14 10" className="h-2.5 w-3.5" fill="currentColor" aria-hidden>
                      <rect x="0" y="6" width="2.4" height="4" rx="0.6" />
                      <rect x="3.8" y="4" width="2.4" height="6" rx="0.6" />
                      <rect x="7.6" y="2" width="2.4" height="8" rx="0.6" />
                      <rect x="11.4" y="0" width="2.4" height="10" rx="0.6" opacity="0.35" />
                    </svg>
                    Ucell
                    <svg viewBox="0 0 25 12" className="h-3 w-[25px]" aria-hidden>
                      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
                      <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" />
                      <path d="M23.5 4v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
                    </svg>
                  </span>
                </div>
                {/* app top bar */}
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-[9px] bg-brand shadow-card">
                    <Send className="size-3.5 text-brand-ink" />
                  </span>
                  <div className="flex-1 leading-tight">
                    <p className="text-[13px] font-bold text-ink">Xabarchi</p>
                    <p className="text-[9px] text-ink-3">Galaxy A54</p>
                  </div>
                  <Inbox className="size-4 text-ink-3" />
                  <Settings className="size-4 text-ink-3" />
                </div>

                {/* on/off ring — the app's signature control */}
                <div className="relative mt-3 flex flex-col items-center">
                  <div className="absolute left-0 top-0 flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 shadow-card">
                    <Wifi className="size-3 text-ok" />
                    <div className="leading-none">
                      <p className="text-[8.5px] font-semibold text-ink">Wi-Fi</p>
                      <p className="tnum text-[7.5px] text-ink-3">≈ 48 Mbps</p>
                    </div>
                  </div>
                  <div className="relative flex size-[116px] items-center justify-center">
                    {!reduceMotion &&
                      [0, 1].map((i) => (
                        <motion.span
                          key={i}
                          aria-hidden
                          className="absolute size-full rounded-full border-2 border-brand"
                          animate={{ scale: [0.85, 1.65], opacity: [0.45, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, delay: i * 1.2, ease: 'easeOut' }}
                        />
                      ))}
                    <motion.div
                      aria-hidden
                      className="absolute size-full"
                      animate={reduceMotion ? undefined : { rotate: 360 }}
                      transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                    >
                      {[0, 60, 120, 180, 240, 300].map((a) => (
                        <span
                          key={a}
                          className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-brand-2"
                          style={{ transform: `rotate(${a}deg) translateY(-58px)` }}
                        />
                      ))}
                    </motion.div>
                    <motion.div
                      className="relative flex size-[82px] items-center justify-center rounded-full bg-gradient-to-b from-brand to-brand-2 shadow-pop"
                      animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Power className="size-7 text-brand-ink" strokeWidth={2.4} />
                    </motion.div>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-brand">
                    <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />
                    {ui.phoneStatus}
                  </p>
                </div>

                {/* three symmetric stat cards */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-surface p-2 shadow-card">
                    <Zap className="size-3.5 text-brand" />
                    <p className="mt-1 text-[8px] text-ink-3">{ui.phoneSent}</p>
                    <p className="tnum text-[13px] font-bold leading-none text-ink">
                      <AnimatedNumber value={sentToday} format={(v) => String(Math.round(v))} />
                      <span className="text-[8px] font-medium text-ink-3"> / {dailyLimit}</span>
                    </p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sunken">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (sentToday / dailyLimit) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="rounded-xl bg-surface p-2 shadow-card">
                    <BatteryFull className="size-3.5 text-ok" />
                    <p className="mt-1 text-[8px] text-ink-3">{ui.phoneBattery}</p>
                    <p className="tnum mt-0.5 text-[17px] font-bold leading-none text-ink">84%</p>
                  </div>
                  <div className="rounded-xl bg-surface p-2 shadow-card">
                    <SignalHigh className="size-3.5 text-gold" />
                    <p className="mt-1 text-[8px] text-ink-3">{ui.phoneSignal}</p>
                    <p className="tnum mt-0.5 text-[17px] font-bold leading-none text-ink">4/4</p>
                  </div>
                </div>

                {/* queue / history tabs */}
                <div className="mt-3 flex gap-0.5 rounded-xl bg-sunken p-0.5 text-[10px] font-semibold">
                  <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-surface py-1 text-ink shadow-card">
                    {ui.phoneQueue}
                    <span className="tnum rounded-full bg-brand/15 px-1.5 text-[8.5px] text-brand">{items.filter((m) => m.stage < 2).length}</span>
                  </span>
                  <span className="flex-1 py-1 text-center text-ink-3">{ui.phoneHistory}</span>
                </div>

                {/* live queue list — app LogCard style */}
                <div className="mt-2 flex h-[142px] flex-col gap-1.5 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {[...items].reverse().slice(0, 3).map((message) => (
                      <motion.div
                        key={message.id}
                        layout
                        initial={{ opacity: 0, y: -16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="rounded-xl border border-line bg-surface p-2.5 shadow-card"
                      >
                        <div className="flex items-center justify-between">
                          <p className="tnum font-mono text-[10px] text-ink-3">{message.to}</p>
                          <span className={cn(
                            'rounded-md px-1.5 py-0.5 text-[7.5px] font-semibold',
                            message.stage === 0 ? 'bg-gold-soft text-gold' : message.stage === 1 ? 'bg-brand-soft text-brand' : 'bg-ok-soft text-ok',
                          )}>
                            {message.stage === 0 ? ui.phoneQueue : message.stage === 1 ? 'SMS' : '✓✓'}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-[11.5px] leading-snug text-ink">{message.text}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-ink-3">
                          <span className="tnum">09:41</span>
                          <StageTicks stage={message.stage} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {/* home indicator */}
                <div aria-hidden className="mx-auto mt-1.5 h-1 w-24 rounded-full bg-ink/25" />
              </div>
              {/* cursor-following glass glare */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 rounded-[2.45rem] transition-opacity duration-300"
                style={{ background: glare, opacity: hovered && !reduceMotion ? 1 : 0 }}
              />
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>

      {/* ambient brand glow */}
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-brand/10 blur-3xl" />
    </div>
  )
}

/* ------------------------------------------------------------------------ */

const featureIcons = [Smartphone, FileText, Users, BarChart3, Braces, ShieldCheck]

export default function HomePage() {
  const t = useT(dict)
  const { lang } = useLang()
  usePageMeta(t.meta.title, t.meta.desc)

  return (
    <div>
      {/* HERO ------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 dark:opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(60% 50% at 70% 10%, var(--x-brand-glow), transparent 70%)',
          }}
        />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-14 px-5 py-10 supports-[height:100svh]:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-brand-2 dark:text-brand"
            >
              <span className="size-1.5 rounded-full bg-brand" />
              {t.hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-[clamp(2rem,5.4vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-ink"
            >
              {t.hero.title1}
              <br />
              <span className="text-brand">{t.hero.title2}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:text-lg"
            >
              {t.hero.body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/register">
                <Button size="lg">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="secondary">
                  <Braces className="size-4" />
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="ghost">
                  <PlayCircle className="size-4" />
                  {t.hero.ctaDemo}
                </Button>
              </Link>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-5 text-[13px] text-ink-3"
            >
              {t.hero.note}
            </motion.p>
          </div>

          <HeroPhone ui={t.hero} />
        </div>
      </section>

      {/* HOW IT WORKS ----------------------------------------------------- */}
      <section className="border-y border-line bg-surface" id="how">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{t.how.eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t.how.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.how.steps.map((step, index) => {
              const icons = [Smartphone, QrCode, Send]
              const Icon = icons[index]
              return (
                <Reveal key={step.title} delay={index * 0.12}>
                  <div className="group relative h-full rounded-2xl border border-line bg-bg p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-110">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-display text-sm font-semibold text-ink-3">{index + 1}/3</span>
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURES --------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-20" id="features">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{t.features.eyebrow}</p>
          <h2 className="mt-3 whitespace-pre-line font-display text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
            {t.features.title}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((feature, index) => {
            const Icon = featureIcons[index]
            return (
              <Reveal key={feature.title} delay={(index % 3) * 0.1}>
                <div className="group h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{feature.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* TELEGRAM BOT ------------------------------------------------------ */}
      <section className="border-t border-line bg-surface" id="telegram">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            {/* bot chat mockup */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="rounded-2xl border border-line bg-bg p-4 shadow-card">
                <div className="flex items-center gap-2.5 border-b border-line pb-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-ink">
                    <Bot className="size-[18px]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Samarqand Express</p>
                    <p className="tnum font-mono text-xs text-ink-3">@samarqand_express_bot</p>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl rounded-tl-md bg-sunken p-3">
                  <div className="flex h-28 items-center justify-center rounded-xl bg-brand/15 text-brand" aria-hidden>
                    <Image className="size-6" />
                  </div>
                  <p className="mt-2.5 text-[13px] leading-snug text-ink">
                    Yangi filial ochildi! Chilonzorda endi buyurtmalar 30 daqiqada yetkaziladi 🚀
                  </p>
                  <span className="mt-2.5 block rounded-lg border border-brand/40 py-1.5 text-center text-[13px] font-medium text-brand">
                    Buyurtma berish
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-2xl rounded-tl-md bg-sunken p-3">
                  <FileText className="size-4 shrink-0 text-brand" />
                  <span className="tnum font-mono text-[13px] text-ink">narxlar-iyul.pdf</span>
                </div>
              </div>
              <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-brand/10 blur-3xl" />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="order-1 lg:order-2">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{t.telegram.eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t.telegram.title}</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-2">{t.telegram.body}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.telegram.kinds.map((kind) => (
                <span key={kind} className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-[13px] font-medium text-ink-2">
                  {kind}
                </span>
              ))}
            </div>
            <p className="mt-6 flex max-w-lg items-start gap-2.5 text-[13px] leading-relaxed text-ink-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
              {t.telegram.future}
            </p>
            <Link to="/docs#telegram" className="mt-7 inline-block">
              <Button variant="secondary">
                {t.telegram.cta}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* STATS ------------------------------------------------------------ */}
      <section className="border-y border-line bg-ink text-white dark:bg-sunken">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{t.stats.title}</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {t.stats.items.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.08}>
                <p className="tnum font-display text-3xl font-semibold text-brand sm:text-4xl">
                  <AnimatedNumber
                    value={stat.value}
                    format={(v) =>
                      stat.compact
                        ? formatCompact(Math.round(v), lang)
                        : stat.value % 1 !== 0
                          ? v.toFixed(1)
                          : new Intl.NumberFormat().format(Math.round(v))
                    }
                  />
                  {stat.value % 1 === 0 && '+'}
                </p>
                <p className="mt-2 text-sm text-white/60">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* API TEASER -------------------------------------------------------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{t.api.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t.api.title}</h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-2">{t.api.body}</p>
          <Link to="/docs" className="mt-7 inline-block">
            <Button variant="secondary">
              {t.api.cta}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </Reveal>
        <Reveal delay={0.15}>
          <CodeBlock
            title="POST /v1/messages"
            code={`curl https://api.xabarchi.uz/v1/messages \\
  -H "Authorization: Bearer xab_live_..." \\
  -d to="+998901234567" \\
  -d text="Tasdiqlash kodingiz: 48213"

{
  "id": "sms_0421",
  "status": "queued",
  "device": "dev_01",
  "segments": 1
}`}
          />
        </Reveal>
      </section>

      {/* TESTIMONIALS ------------------------------------------------------ */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{t.testimonials.eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t.testimonials.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.testimonials.items.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.1}>
                <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-bg p-6">
                  <blockquote className="text-[15px] leading-relaxed text-ink">«{item.text}»</blockquote>
                  <figcaption className="mt-6">
                    <p className="text-sm font-semibold text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[13px] text-ink-3">{item.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className={cn('relative overflow-hidden rounded-3xl bg-brand px-6 py-16 text-center sm:px-16')}>
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.35), transparent 45%)',
              }}
            />
            <h2 className="relative font-display text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">{t.cta.title}</h2>
            <p className="relative mt-3 text-[15px] text-brand-ink/85">{t.cta.body}</p>
            <Link to="/register" className="relative mt-8 inline-block">
              <Button
                size="lg"
                className="bg-white text-brand-2 shadow-pop hover:bg-white hover:brightness-95 dark:bg-[#06211e] dark:text-brand"
              >
                {t.cta.button}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
