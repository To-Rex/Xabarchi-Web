import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BatteryFull,
  Bell,
  Globe,
  Inbox,
  Languages,
  Moon,
  Power,
  QrCode,
  RefreshCw,
  Send,
  Settings,
  SignalHigh,
  Smartphone,
  Timer,
  Volume2,
  Wifi,
  Zap,
} from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { Button, Reveal } from '@/shared/ui'

/* ------------------------------------------------------------------ i18n */

const dict = {
  uz: {
    meta: 'Mobil ilova qo‘llanmasi — Xabarchi',
    hero: {
      eyebrow: 'Mobil ilova',
      title: 'Xabarchi ilovasi bilan tanishing',
      body: 'Android telefoningizni SMS shlyuziga aylantiruvchi ilova. Har bir ekran va tugma nima uchun kerakligini — bosqichma-bosqich, vizual ko‘rsatamiz.',
      ctaStart: 'Bepul boshlash',
      ctaDocs: 'API hujjatlari',
    },
    steps: {
      eyebrow: 'Ishga tushirish',
      title: '3 qadamda tayyor',
      items: [
        { title: 'Ilovani o‘rnating', body: 'Android telefoningizga Xabarchi ilovasini yuklab oling va oching — qisqa tanishtiruv sizni kutib oladi.' },
        { title: 'QR orqali ulang', body: 'Boshqaruv panelidagi QR kodni skanerlang (yoki telefon raqami va operatorni kiriting) — qurilma hisobingizga xavfsiz bog‘lanadi.' },
        { title: 'Shlyuzni yoqing', body: 'Katta ON tugmasini bosing. Endi paneldan yuborilgan har bir SMS shu telefon orqali jo‘natiladi.' },
      ],
    },
    screen: {
      eyebrow: 'Asosiy ekran',
      title: 'Qaysi qismida nima bor',
      body: 'Ilovaning bosh ekranidagi har bir element va u nima uchun javob berishini quyida raqamlab ko‘rsatdik.',
      marks: [
        { title: 'ON / OFF tugmasi', body: 'Shlyuzni yoqadi va o‘chiradi. Yoniqligida ilova SMSlarni qabul qilib yuboradi; to‘lqinli halqa aktivlikni bildiradi. Internet uzilsa tugma qizil tusga kiradi.' },
        { title: 'Internet holati', body: 'Wi-Fi yoki mobil ulanish va taxminiy tezlikni ko‘rsatadi — server bilan aloqangiz borligini bir qarashda bilib turasiz.' },
        { title: 'Qurilma ko‘rsatkichlari', body: '“Bugun yuborildi” (kunlik limitga nisbatan), batareya foizi va signal darajasi — telefon holati bir joyda.' },
        { title: 'Navbat / Tarix', body: 'Navbat — yuborilishni kutayotgan SMSlar; Tarix — yuborilgan yoki xato bo‘lganlar. Bosib almashtiriladi.' },
        { title: 'Xabar kartasi', body: 'Har bir SMS: qabul qiluvchi, matn, holati (navbatda → yuborildi → yetkazildi yoki xato) va turi. Ustiga bosilsa to‘liq tafsilot ochiladi.' },
        { title: 'Yuqori panel', body: 'Xabarlar (Navbat va Tarixning to‘liq sahifasi) hamda Sozlamalar tugmalari.' },
      ],
    },
    detail: {
      eyebrow: 'Batafsil',
      title: 'Sozlamalar va imkoniyatlar',
      items: [
        { icon: Languages, title: 'Til', body: 'O‘zbek, rus va ingliz — bir tugmada butun ilova tili almashadi.' },
        { icon: Moon, title: 'Kun va tun mavzusi', body: 'Yorug‘, tungi yoki tizim mavzusi — ko‘zga qulay ko‘rinishni tanlang.' },
        { icon: Volume2, title: 'Ovoz va vibratsiya', body: 'SMS yuborilганda yoki xatolik bo‘lganda ovoz va tebranish bilan xabardor bo‘ling.' },
        { icon: Timer, title: 'SMS oralig‘i', body: 'Xabarlar orasidagi intervalni sozlang (masalan 5 soniya) — operator cheklovlariga moslashadi.' },
        { icon: Send, title: 'Kunlik limit', body: 'Bir kunda yuboriladigan maksimal SMS sonini belgilang — SIM-karta xavfsizligi uchun.' },
        { icon: RefreshCw, title: 'Offline sinxronizatsiya', body: 'Internet yo‘qolsa SMSlar navbatda saqlanadi, tiklanganda avtomatik yuboriladi va server bilan sinxronlanadi — bittasi ham yo‘qolmaydi.' },
        { icon: Globe, title: 'Fon rejimi', body: 'Ilova yopilganda yoki ekran o‘chganda ham ishlayveradi — telefon zaryadini tejagan holda.' },
        { icon: Smartphone, title: 'Qurilmani uzish', body: 'Sozlamalardan qurilmani hisobdan uzishingiz mumkin — istalgan payt qayta ulanadi.' },
      ],
    },
    cta: {
      title: 'Telefoningizni shlyuzga aylantiring',
      body: 'Ro‘yxatdan o‘ting, QR orqali ulang va bugun birinchi SMSingizni yuboring. Oyiga 500 SMS bepul.',
      button: 'Hisob ochish',
    },
    labels: { status: 'Ishlayapti', sent: 'Bugun', battery: 'Batareya', signal: 'Signal', queue: 'Navbat', history: 'Tarix', legend: 'Belgilar izohi' },
  },
  ru: {
    meta: 'Руководство по приложению — Xabarchi',
    hero: {
      eyebrow: 'Мобильное приложение',
      title: 'Знакомьтесь с приложением Xabarchi',
      body: 'Приложение, которое превращает ваш Android-телефон в SMS-шлюз. Наглядно и по шагам показываем, зачем нужен каждый экран и кнопка.',
      ctaStart: 'Начать бесплатно',
      ctaDocs: 'API документация',
    },
    steps: {
      eyebrow: 'Запуск',
      title: 'Готово за 3 шага',
      items: [
        { title: 'Установите приложение', body: 'Скачайте Xabarchi на Android-телефон и откройте — вас встретит короткое знакомство.' },
        { title: 'Подключите по QR', body: 'Отсканируйте QR-код из панели (или введите номер и оператора) — устройство безопасно привяжется к аккаунту.' },
        { title: 'Включите шлюз', body: 'Нажмите большую кнопку ON. Теперь каждое SMS из панели уходит через этот телефон.' },
      ],
    },
    screen: {
      eyebrow: 'Главный экран',
      title: 'Что и где находится',
      body: 'Ниже пронумерован каждый элемент главного экрана и объяснено, за что он отвечает.',
      marks: [
        { title: 'Кнопка ON / OFF', body: 'Включает и выключает шлюз. Когда включена — приложение принимает и отправляет SMS; волновое кольцо показывает активность. При потере интернета кнопка краснеет.' },
        { title: 'Состояние интернета', body: 'Показывает Wi-Fi или мобильную сеть и примерную скорость — сразу видно, есть ли связь с сервером.' },
        { title: 'Показатели устройства', body: '«Отправлено сегодня» (относительно дневного лимита), заряд батареи и уровень сигнала — состояние телефона в одном месте.' },
        { title: 'Очередь / История', body: 'Очередь — SMS в ожидании отправки; История — отправленные или с ошибкой. Переключается нажатием.' },
        { title: 'Карточка сообщения', body: 'Каждое SMS: получатель, текст, статус (в очереди → отправлено → доставлено или ошибка) и тип. По нажатию открывается полная информация.' },
        { title: 'Верхняя панель', body: 'Кнопки «Сообщения» (полная страница очереди и истории) и «Настройки».' },
      ],
    },
    detail: {
      eyebrow: 'Подробнее',
      title: 'Настройки и возможности',
      items: [
        { icon: Languages, title: 'Язык', body: 'Узбекский, русский и английский — язык всего приложения меняется одной кнопкой.' },
        { icon: Moon, title: 'Светлая и тёмная тема', body: 'Светлая, тёмная или системная тема — выберите комфортный вид.' },
        { icon: Volume2, title: 'Звук и вибрация', body: 'Уведомление звуком и вибрацией при отправке SMS или ошибке.' },
        { icon: Timer, title: 'Интервал SMS', body: 'Задайте интервал между сообщениями (например 5 секунд) — под ограничения оператора.' },
        { icon: Send, title: 'Дневной лимит', body: 'Установите максимум SMS в день — ради безопасности SIM-карты.' },
        { icon: RefreshCw, title: 'Офлайн-синхронизация', body: 'При потере интернета SMS хранятся в очереди, а при восстановлении отправляются автоматически и синхронизируются с сервером — ни одно не теряется.' },
        { icon: Globe, title: 'Фоновый режим', body: 'Работает даже когда приложение закрыто или экран выключен — экономно к заряду.' },
        { icon: Smartphone, title: 'Отвязать устройство', body: 'Устройство можно отвязать от аккаунта в настройках — и подключить снова в любой момент.' },
      ],
    },
    cta: {
      title: 'Превратите телефон в шлюз',
      body: 'Зарегистрируйтесь, подключите по QR и отправьте первое SMS сегодня. 500 SMS в месяц бесплатно.',
      button: 'Создать аккаунт',
    },
    labels: { status: 'Работает', sent: 'Сегодня', battery: 'Батарея', signal: 'Сигнал', queue: 'Очередь', history: 'История', legend: 'Пояснение к меткам' },
  },
  en: {
    meta: 'Mobile app guide — Xabarchi',
    hero: {
      eyebrow: 'Mobile app',
      title: 'Meet the Xabarchi app',
      body: 'The app that turns your Android phone into an SMS gateway. We show — visually and step by step — what every screen and button is for.',
      ctaStart: 'Start for free',
      ctaDocs: 'API docs',
    },
    steps: {
      eyebrow: 'Getting started',
      title: 'Ready in 3 steps',
      items: [
        { title: 'Install the app', body: 'Download Xabarchi to your Android phone and open it — a short intro welcomes you.' },
        { title: 'Pair with QR', body: 'Scan the QR code from the dashboard (or enter the phone number and operator) — the device links securely to your account.' },
        { title: 'Turn the gateway on', body: 'Tap the big ON button. Every SMS you send from the dashboard now goes out through this phone.' },
      ],
    },
    screen: {
      eyebrow: 'Home screen',
      title: 'What each part does',
      body: 'Every element of the home screen is numbered below, with what it’s responsible for.',
      marks: [
        { title: 'ON / OFF button', body: 'Turns the gateway on and off. When on, the app receives and sends SMS; the pulsing ring shows it’s active. If the internet drops, the button turns red.' },
        { title: 'Internet status', body: 'Shows Wi-Fi or mobile connection and an estimated speed — so you know at a glance whether the server link is alive.' },
        { title: 'Device stats', body: '“Sent today” (against your daily limit), battery percentage and signal strength — the phone’s health in one place.' },
        { title: 'Queue / History', body: 'Queue — SMS waiting to be sent; History — sent or failed. Tap to switch.' },
        { title: 'Message card', body: 'Each SMS: recipient, text, status (queued → sent → delivered or failed) and type. Tap it for full details.' },
        { title: 'Top bar', body: 'The “Messages” button (full queue & history page) and “Settings”.' },
      ],
    },
    detail: {
      eyebrow: 'In depth',
      title: 'Settings & capabilities',
      items: [
        { icon: Languages, title: 'Language', body: 'Uzbek, Russian and English — the whole app switches language with one tap.' },
        { icon: Moon, title: 'Light & dark theme', body: 'Light, dark or system theme — pick what’s easy on your eyes.' },
        { icon: Volume2, title: 'Sound & vibration', body: 'Get a sound and vibration when an SMS is sent or fails.' },
        { icon: Timer, title: 'SMS interval', body: 'Set the delay between messages (e.g. 5 seconds) to match carrier limits.' },
        { icon: Send, title: 'Daily limit', body: 'Cap how many SMS go out per day — to keep your SIM safe.' },
        { icon: RefreshCw, title: 'Offline sync', body: 'If the internet drops, SMS stay queued and send automatically once it’s back, syncing with the server — nothing is lost.' },
        { icon: Globe, title: 'Background mode', body: 'Keeps working even when the app is closed or the screen is off — gently on the battery.' },
        { icon: Smartphone, title: 'Unpair device', body: 'You can unlink the device from your account in settings — and reconnect any time.' },
      ],
    },
    cta: {
      title: 'Turn your phone into a gateway',
      body: 'Sign up, pair with QR and send your first SMS today. 500 SMS a month, free.',
      button: 'Create account',
    },
    labels: { status: 'Running', sent: 'Today', battery: 'Battery', signal: 'Signal', queue: 'Queue', history: 'History', legend: 'Marker legend' },
  },
}

/* --------------------------------------------------------------- helpers */

function Marker({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span
      className={`absolute z-20 flex size-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-brand-ink shadow-pop ring-2 ring-surface ${className}`}
    >
      {n}
    </span>
  )
}

/** Static recreation of the app's home screen, with numbered annotation markers. */
function AnnotatedPhone({ labels }: { labels: Record<string, string> }) {
  const logs = [
    { to: '+998 90 123 45 67', text: 'Buyurtmangiz #4213 qabul qilindi ✅', tone: 'ok', badge: '✓✓' },
    { to: '+998 93 555 77 13', text: 'Tasdiqlash kodingiz: 48213', tone: 'brand', badge: 'SMS' },
    { to: '+998 91 782 24 40', text: 'Kuryer Sardor yo‘lga chiqdi 🛵', tone: 'gold', badge: labels.queue },
  ]

  return (
    <div className="relative mx-auto w-[300px]">
      {/* titanium frame */}
      <div className="relative rounded-[3rem] bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-300 p-[3px] shadow-pop dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-600">
        <span aria-hidden className="absolute -left-[2px] top-[5.5rem] h-6 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
        <span aria-hidden className="absolute -left-[2px] top-[8.5rem] h-11 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
        <span aria-hidden className="absolute -right-[2px] top-[9.5rem] h-16 w-[3px] rounded-r-md bg-zinc-400 dark:bg-zinc-600" />
        <div className="rounded-[2.85rem] bg-zinc-950 p-[7px]">
          <div className="relative overflow-hidden rounded-[2.45rem] bg-sunken dark:bg-bg">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-2.5 z-30 flex h-[26px] w-[92px] -translate-x-1/2 items-center justify-end rounded-full bg-zinc-950 pr-2.5">
              <span className="size-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700/70" />
            </div>
            <div className="px-4 pb-3 pt-2.5">
              {/* status bar */}
              <div className="flex h-[26px] items-center justify-between px-2 text-[11px] font-semibold text-ink-2">
                <span className="tnum">09:41</span>
                <span className="text-[10px] font-medium text-ink-3">Ucell · 5G</span>
              </div>

              {/* top bar (6) */}
              <div className="relative mt-1.5 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-[9px] bg-brand shadow-card">
                  <Send className="size-3.5 text-brand-ink" />
                </span>
                <div className="flex-1 leading-tight">
                  <p className="text-[13px] font-bold text-ink">Xabarchi</p>
                  <p className="text-[9px] text-ink-3">Galaxy A54</p>
                </div>
                <Inbox className="size-4 text-ink-3" />
                <Settings className="size-4 text-ink-3" />
                <Marker n={6} className="-right-1 -top-2" />
              </div>

              {/* on/off ring (1) + network chip (2) */}
              <div className="relative mt-3 flex flex-col items-center">
                <div className="absolute left-0 top-0 flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 shadow-card">
                  <Wifi className="size-3 text-ok" />
                  <div className="leading-none">
                    <p className="text-[8.5px] font-semibold text-ink">Wi-Fi</p>
                    <p className="tnum text-[7.5px] text-ink-3">≈ 48 Mbps</p>
                  </div>
                  <Marker n={2} className="-left-2 -top-2" />
                </div>
                <div className="relative flex size-[116px] items-center justify-center">
                  {[0, 1].map((i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className="absolute size-full rounded-full border-2 border-brand"
                      animate={{ scale: [0.85, 1.6], opacity: [0.45, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 1.2, ease: 'easeOut' }}
                    />
                  ))}
                  <div className="relative flex size-[82px] items-center justify-center rounded-full bg-gradient-to-b from-brand to-brand-2 shadow-pop">
                    <Power className="size-7 text-brand-ink" strokeWidth={2.4} />
                  </div>
                  <Marker n={1} className="-right-1 top-1" />
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-brand">
                  <span className="size-1.5 rounded-full bg-brand" />
                  {labels.status}
                </p>
              </div>

              {/* stat cards (3) */}
              <div className="relative mt-3 grid grid-cols-3 gap-2">
                <Marker n={3} className="-right-1 -top-2" />
                <div className="rounded-xl bg-surface p-2 shadow-card">
                  <Zap className="size-3.5 text-brand" />
                  <p className="mt-1 text-[8px] text-ink-3">{labels.sent}</p>
                  <p className="tnum text-[13px] font-bold leading-none text-ink">142<span className="text-[8px] font-medium text-ink-3"> / 800</span></p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sunken"><div className="h-full rounded-full bg-brand" style={{ width: '18%' }} /></div>
                </div>
                <div className="rounded-xl bg-surface p-2 shadow-card">
                  <BatteryFull className="size-3.5 text-ok" />
                  <p className="mt-1 text-[8px] text-ink-3">{labels.battery}</p>
                  <p className="tnum mt-0.5 text-[17px] font-bold leading-none text-ink">84%</p>
                </div>
                <div className="rounded-xl bg-surface p-2 shadow-card">
                  <SignalHigh className="size-3.5 text-gold" />
                  <p className="mt-1 text-[8px] text-ink-3">{labels.signal}</p>
                  <p className="tnum mt-0.5 text-[17px] font-bold leading-none text-ink">4/4</p>
                </div>
              </div>

              {/* tabs (4) */}
              <div className="relative mt-3 flex gap-0.5 rounded-xl bg-sunken p-0.5 text-[10px] font-semibold">
                <Marker n={4} className="-left-2 -top-2" />
                <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-surface py-1 text-ink shadow-card">
                  {labels.queue}
                  <span className="tnum rounded-full bg-brand/15 px-1.5 text-[8.5px] text-brand">2</span>
                </span>
                <span className="flex-1 py-1 text-center text-ink-3">{labels.history}</span>
              </div>

              {/* log list (5) */}
              <div className="relative mt-2 flex flex-col gap-1.5">
                <Marker n={5} className="-right-1 -top-2" />
                {logs.map((m) => (
                  <div key={m.to} className="rounded-xl border border-line bg-surface p-2.5 shadow-card">
                    <div className="flex items-center justify-between">
                      <p className="tnum font-mono text-[10px] text-ink-3">{m.to}</p>
                      <span
                        className={
                          'rounded-md px-1.5 py-0.5 text-[7.5px] font-semibold ' +
                          (m.tone === 'ok' ? 'bg-ok-soft text-ok' : m.tone === 'brand' ? 'bg-brand-soft text-brand' : 'bg-gold-soft text-gold')
                        }
                      >
                        {m.badge}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-[11.5px] leading-snug text-ink">{m.text}</p>
                  </div>
                ))}
              </div>

              <div aria-hidden className="mx-auto mt-3 h-1 w-24 rounded-full bg-ink/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ page */

export default function MobileAppPage() {
  const t = useT(dict)
  usePageMeta(t.meta)

  return (
    <div className="overflow-hidden">
      {/* hero */}
      <section className="relative mx-auto max-w-6xl px-5 pt-14 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand">
              <Smartphone className="size-3.5" />
              {t.hero.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">{t.hero.title}</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-2">{t.hero.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"><Button size="lg">{t.hero.ctaStart}<ArrowRight className="size-4" /></Button></Link>
              <Link to="/docs"><Button size="lg" variant="secondary">{t.hero.ctaDocs}</Button></Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex justify-center lg:justify-end">
              <AnnotatedPhone labels={t.labels} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* steps */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand">{t.steps.eyebrow}</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.steps.title}</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.steps.items.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-line bg-surface p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft font-display text-lg font-bold text-brand">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
                {i === 1 && <QrCode className="absolute right-5 top-5 size-6 text-ink-3/40" />}
                {i === 2 && <Power className="absolute right-5 top-5 size-6 text-ink-3/40" />}
                {i === 0 && <Smartphone className="absolute right-5 top-5 size-6 text-ink-3/40" />}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* annotated screen + legend */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand">{t.screen.eyebrow}</p>
            <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.screen.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-ink-2">{t.screen.body}</p>
          </Reveal>
          <div className="mt-14 grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <div className="flex justify-center">
                <AnnotatedPhone labels={t.labels} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className="space-y-4">
                {t.screen.marks.map((mark, i) => (
                  <li key={mark.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-brand-ink">{i + 1}</span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink">{mark.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{mark.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* detail cards */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand">{t.detail.eyebrow}</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.detail.title}</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.detail.items.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={(i % 4) * 0.06}>
                <div className="h-full rounded-2xl border border-line bg-surface p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{item.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-brand-soft to-surface p-10 text-center sm:p-14">
            <Bell className="mx-auto size-8 text-brand" />
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-2">{t.cta.body}</p>
            <div className="mt-8">
              <Link to="/register"><Button size="lg">{t.cta.button}<ArrowRight className="size-4" /></Button></Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
