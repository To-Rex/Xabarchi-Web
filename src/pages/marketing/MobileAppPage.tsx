import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  BatteryFull,
  Bell,
  ChevronDown,
  Flashlight,
  Globe,
  Inbox,
  Languages,
  Monitor,
  Moon,
  Phone,
  Plus,
  Power,
  QrCode,
  RefreshCw,
  ScanLine,
  Send,
  Settings,
  SignalHigh,
  Smartphone,
  Sun,
  Timer,
  Unlink,
  Volume2,
  Wifi,
  X,
  Zap,
} from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { Button, Reveal } from '@/shared/ui'
import { StatusRing } from '@/shared/ui/StatusRing'

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
    pair: {
      eyebrow: 'QR orqali ulash',
      title: 'Qurilmani QR kod bilan ulang',
      body: 'Saytdagi panelda QR kod chiqadi, ilovada telefon raqami va operatorni kiritib uni skaner qilasiz — qurilma bir zumda hisobingizga bog‘lanadi.',
      steps: [
        { title: 'Panelda “Qurilma qo‘shish”', body: 'Saytda /app/devices sahifasida “Qurilma qo‘shish” tugmasini bosing — ekranda QR kod paydo bo‘ladi.' },
        { title: 'Ilovada ma’lumot kiriting', body: 'Ilovada telefon raqami va operatoringizni kiriting, so‘ng “QR kodni skanerlash”ni bosing.' },
        { title: 'Kodni skaner qiling', body: 'Kamerani paneldagi QR kodga to‘g‘rilang. Ulangач qurilma shlyuzga aylanadi.' },
      ],
      browserUrl: 'xabarchi.uz/app/devices',
      devicesTitle: 'Qurilmalar',
      devicesSubtitle: 'SMS shlyuz sifatida ishlayotgan telefonlaringiz.',
      addBtn: 'Qurilma qo‘shish',
      waiting: 'Telefonni kutmoqda…',
      pairTitle: 'Qurilmani ulash',
      pairSubtitle: 'Bir soniyada telefoningizni SMS shlyuziga aylantiring',
      scanCard: 'QR kodni skanerlash',
      scanCardHint: 'Paneldagi QR kodni ko‘rsating',
      deviceInfo: 'Qurilma ma’lumotlari',
      deviceName: 'Qurilma nomi',
      phone: 'Telefon raqami',
      operator: 'Operator',
      connect: 'Qurilmani ulash',
      scanTitle: 'QR kodni skaner qiling',
      scanHint: 'Kodni ramka ichiga joylang',
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
    settings: {
      eyebrow: 'Sozlamalar ekrani',
      title: 'Sozlamalarda nimalar bor',
      body: 'Sozlamalar sahifasidagi har bir bo‘lim ilovani o‘zingizga moslashtirish imkonini beradi.',
      marks: [
        { title: 'Til', body: 'O‘zbek, rus va ingliz — bir bosishda butun ilova tili almashadi.' },
        { title: 'Ko‘rinish (mavzu)', body: 'Tizim, yorug‘ yoki tungi mavzu — ko‘zga qulay ko‘rinishni tanlang.' },
        { title: 'Ovoz va vibratsiya', body: 'SMS yuborilganda yoki xatolik bo‘lganda ovoz va tebranish bilan xabardor bo‘ling.' },
        { title: 'SMS oralig‘i', body: 'Xabarlar orasidagi intervalni sozlang (masalan 5 soniya) — operator cheklovlariga moslashadi.' },
        { title: 'Kunlik limit', body: 'Bir kunda yuboriladigan maksimal SMS sonini belgilang — SIM-karta xavfsizligi uchun.' },
        { title: 'Qurilmani uzish', body: 'Qurilmani hisobdan uzasiz — istalgan payt QR orqali qayta ulanadi.' },
      ],
    },
    history: {
      eyebrow: 'Xabarlar va Tarix',
      title: 'Tarix qismi nimani ko‘rsatadi',
      body: 'Yuqoridagi “Xabarlar” tugmasi Navbat va Tarixning to‘liq sahifasini ochadi. Tarixda har bir SMS holati aniq ko‘rinadi — nima yuborildi, nima xato bo‘ldi va nega.',
      statuses: [
        { label: 'Navbatda', tone: 'gold', desc: 'SMS yuborilishni kutmoqda (interval yoki internet).' },
        { label: 'Yuborildi', tone: 'brand', desc: 'Telefon SMSni operatorga jo‘natdi.' },
        { label: 'Yetkazildi', tone: 'ok', desc: 'SMS qabul qiluvchiga yetib bordi (yetkazish hisoboti).' },
        { label: 'Xato', tone: 'danger', desc: 'Masalan: SIM karta yo‘q, balans yetarli emas yoki raqam noto‘g‘ri.' },
      ],
    },
    detail: {
      eyebrow: 'Batafsil',
      title: 'Yana nimalarni biladi',
      items: [
        { icon: RefreshCw, title: 'Offline sinxronizatsiya', body: 'Internet yo‘qolsa SMSlar navbatda saqlanadi, tiklanganda avtomatik yuboriladi va server bilan sinxronlanadi — bittasi ham yo‘qolmaydi.' },
        { icon: Globe, title: 'Fon rejimi', body: 'Ilova yopilganda yoki ekran o‘chganda ham ishlayveradi — telefon zaryadini tejagan holda.' },
        { icon: Zap, title: 'Real vaqt', body: 'Paneldan yuborilgan SMS bir zumda telefon navbatida paydo bo‘ladi — kutish yo‘q.' },
        { icon: Smartphone, title: 'Bir nechta qurilma', body: 'Bir hisobga bir nechta telefon ulang — yuklama avtomatik taqsimlanadi.' },
      ],
    },
    cta: {
      title: 'Telefoningizni shlyuzga aylantiring',
      body: 'Ro‘yxatdan o‘ting, QR orqali ulang va bugun birinchi SMSingizni yuboring. Oyiga 500 SMS bepul.',
      button: 'Hisob ochish',
    },
    labels: {
      status: 'Ishlayapti', sent: 'Bugun', battery: 'Batareya', signal: 'Signal', queue: 'Navbat', history: 'Tarix',
      settingsTitle: 'Sozlamalar', messagesTitle: 'Xabarlar', langTitle: 'Til', themeTitle: 'Ko‘rinish',
      themeSystem: 'Tizim', themeLight: 'Yorug‘', themeDark: 'Tungi', notifTitle: 'Bildirishnoma', sound: 'Ovoz',
      vibration: 'Vibratsiya', sendTitle: 'Yuborish', interval: 'SMS oralig‘i', limit: 'Kunlik limit', unpair: 'Qurilmani uzish',
    },
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
    pair: {
      eyebrow: 'Подключение по QR',
      title: 'Подключите устройство по QR-коду',
      body: 'В панели появляется QR-код; в приложении вы вводите номер и оператора и сканируете его — устройство мгновенно привязывается к аккаунту.',
      steps: [
        { title: 'В панели «Добавить устройство»', body: 'На сайте /app/devices нажмите «Добавить устройство» — на экране появится QR-код.' },
        { title: 'Введите данные в приложении', body: 'В приложении укажите номер телефона и оператора, затем нажмите «Сканировать QR-код».' },
        { title: 'Отсканируйте код', body: 'Наведите камеру на QR-код из панели. После подключения телефон станет шлюзом.' },
      ],
      browserUrl: 'xabarchi.uz/app/devices',
      devicesTitle: 'Устройства',
      devicesSubtitle: 'Телефоны, работающие как ваши SMS-шлюзы.',
      addBtn: 'Добавить устройство',
      waiting: 'Ожидание телефона…',
      pairTitle: 'Подключить устройство',
      pairSubtitle: 'За секунду превратите телефон в SMS-шлюз',
      scanCard: 'Сканировать QR-код',
      scanCardHint: 'Покажите QR-код из панели',
      deviceInfo: 'Данные устройства',
      deviceName: 'Название устройства',
      phone: 'Номер телефона',
      operator: 'Оператор',
      connect: 'Подключить устройство',
      scanTitle: 'Отсканируйте QR-код',
      scanHint: 'Наведите рамку на код',
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
    settings: {
      eyebrow: 'Экран настроек',
      title: 'Что есть в настройках',
      body: 'Каждый раздел настроек позволяет подстроить приложение под себя.',
      marks: [
        { title: 'Язык', body: 'Узбекский, русский и английский — язык всего приложения меняется одним нажатием.' },
        { title: 'Тема оформления', body: 'Системная, светлая или тёмная тема — выберите комфортный вид.' },
        { title: 'Звук и вибрация', body: 'Уведомление звуком и вибрацией при отправке SMS или ошибке.' },
        { title: 'Интервал SMS', body: 'Задайте интервал между сообщениями (например 5 секунд) — под ограничения оператора.' },
        { title: 'Дневной лимит', body: 'Установите максимум SMS в день — ради безопасности SIM-карты.' },
        { title: 'Отвязать устройство', body: 'Отвязываете устройство от аккаунта — и подключаете снова по QR в любой момент.' },
      ],
    },
    history: {
      eyebrow: 'Сообщения и История',
      title: 'Что показывает История',
      body: 'Кнопка «Сообщения» открывает полную страницу очереди и истории. В истории виден точный статус каждого SMS — что отправлено, что с ошибкой и почему.',
      statuses: [
        { label: 'В очереди', tone: 'gold', desc: 'SMS ждёт отправки (интервал или интернет).' },
        { label: 'Отправлено', tone: 'brand', desc: 'Телефон отправил SMS оператору.' },
        { label: 'Доставлено', tone: 'ok', desc: 'SMS дошло до получателя (отчёт о доставке).' },
        { label: 'Ошибка', tone: 'danger', desc: 'Например: нет SIM-карты, недостаточно баланса или неверный номер.' },
      ],
    },
    detail: {
      eyebrow: 'Подробнее',
      title: 'Что ещё умеет',
      items: [
        { icon: RefreshCw, title: 'Офлайн-синхронизация', body: 'При потере интернета SMS хранятся в очереди, а при восстановлении отправляются автоматически и синхронизируются с сервером — ни одно не теряется.' },
        { icon: Globe, title: 'Фоновый режим', body: 'Работает даже когда приложение закрыто или экран выключен — экономно к заряду.' },
        { icon: Zap, title: 'Реальное время', body: 'SMS из панели мгновенно появляется в очереди телефона — без ожидания.' },
        { icon: Smartphone, title: 'Несколько устройств', body: 'Подключите к одному аккаунту несколько телефонов — нагрузка распределяется автоматически.' },
      ],
    },
    cta: {
      title: 'Превратите телефон в шлюз',
      body: 'Зарегистрируйтесь, подключите по QR и отправьте первое SMS сегодня. 500 SMS в месяц бесплатно.',
      button: 'Создать аккаунт',
    },
    labels: {
      status: 'Работает', sent: 'Сегодня', battery: 'Батарея', signal: 'Сигнал', queue: 'Очередь', history: 'История',
      settingsTitle: 'Настройки', messagesTitle: 'Сообщения', langTitle: 'Язык', themeTitle: 'Тема',
      themeSystem: 'Система', themeLight: 'Светлая', themeDark: 'Тёмная', notifTitle: 'Уведомления', sound: 'Звук',
      vibration: 'Вибрация', sendTitle: 'Отправка', interval: 'Интервал SMS', limit: 'Дневной лимит', unpair: 'Отвязать устройство',
    },
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
    pair: {
      eyebrow: 'Pairing by QR',
      title: 'Connect a device with a QR code',
      body: 'The dashboard shows a QR code; in the app you enter the phone number and operator, then scan it — the device links to your account instantly.',
      steps: [
        { title: 'Dashboard “Add device”', body: 'On /app/devices press “Add device” — a QR code appears on screen.' },
        { title: 'Enter details in the app', body: 'In the app, type the phone number and pick your operator, then tap “Scan QR code”.' },
        { title: 'Scan the code', body: 'Point the camera at the dashboard’s QR code. Once paired, the phone becomes a gateway.' },
      ],
      browserUrl: 'xabarchi.uz/app/devices',
      devicesTitle: 'Devices',
      devicesSubtitle: 'The phones running as your SMS gateways.',
      addBtn: 'Add device',
      waiting: 'Waiting for the phone…',
      pairTitle: 'Connect device',
      pairSubtitle: 'Turn your phone into an SMS gateway in a second',
      scanCard: 'Scan QR code',
      scanCardHint: 'Show the QR code from the dashboard',
      deviceInfo: 'Device details',
      deviceName: 'Device name',
      phone: 'Phone number',
      operator: 'Operator',
      connect: 'Connect device',
      scanTitle: 'Scan the QR code',
      scanHint: 'Line the frame up with the code',
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
    settings: {
      eyebrow: 'Settings screen',
      title: 'What’s in Settings',
      body: 'Every settings section lets you tailor the app to how you work.',
      marks: [
        { title: 'Language', body: 'Uzbek, Russian and English — the whole app switches language with one tap.' },
        { title: 'Theme', body: 'System, light or dark theme — pick what’s easy on your eyes.' },
        { title: 'Sound & vibration', body: 'Get a sound and vibration when an SMS is sent or fails.' },
        { title: 'SMS interval', body: 'Set the delay between messages (e.g. 5 seconds) to match carrier limits.' },
        { title: 'Daily limit', body: 'Cap how many SMS go out per day — to keep your SIM safe.' },
        { title: 'Unpair device', body: 'Unlink the device from your account — and reconnect by QR any time.' },
      ],
    },
    history: {
      eyebrow: 'Messages & History',
      title: 'What History shows',
      body: 'The “Messages” button opens the full queue & history page. History shows the exact status of every SMS — what was sent, what failed and why.',
      statuses: [
        { label: 'Queued', tone: 'gold', desc: 'The SMS is waiting to send (interval or internet).' },
        { label: 'Sent', tone: 'brand', desc: 'The phone handed the SMS to the carrier.' },
        { label: 'Delivered', tone: 'ok', desc: 'The SMS reached the recipient (delivery report).' },
        { label: 'Failed', tone: 'danger', desc: 'E.g. no SIM card, not enough balance, or a wrong number.' },
      ],
    },
    detail: {
      eyebrow: 'In depth',
      title: 'What else it does',
      items: [
        { icon: RefreshCw, title: 'Offline sync', body: 'If the internet drops, SMS stay queued and send automatically once it’s back, syncing with the server — nothing is lost.' },
        { icon: Globe, title: 'Background mode', body: 'Keeps working even when the app is closed or the screen is off — gently on the battery.' },
        { icon: Zap, title: 'Real time', body: 'An SMS sent from the dashboard appears in the phone’s queue instantly — no waiting.' },
        { icon: Smartphone, title: 'Multiple devices', body: 'Link several phones to one account — the load spreads automatically.' },
      ],
    },
    cta: {
      title: 'Turn your phone into a gateway',
      body: 'Sign up, pair with QR and send your first SMS today. 500 SMS a month, free.',
      button: 'Create account',
    },
    labels: {
      status: 'Running', sent: 'Today', battery: 'Battery', signal: 'Signal', queue: 'Queue', history: 'History',
      settingsTitle: 'Settings', messagesTitle: 'Messages', langTitle: 'Language', themeTitle: 'Theme',
      themeSystem: 'System', themeLight: 'Light', themeDark: 'Dark', notifTitle: 'Notifications', sound: 'Sound',
      vibration: 'Vibration', sendTitle: 'Sending', interval: 'SMS interval', limit: 'Daily limit', unpair: 'Unpair device',
    },
  },
}

const TONE: Record<string, string> = {
  ok: 'bg-ok-soft text-ok',
  brand: 'bg-brand-soft text-brand',
  gold: 'bg-gold-soft text-gold',
  danger: 'bg-danger-soft text-danger',
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

/** Reusable iPhone shell — status bar + island + a tall screen area. */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[300px]">
      <div className="relative rounded-[3rem] bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-300 p-[3px] shadow-pop dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-600">
        <span aria-hidden className="absolute -left-[2px] top-[5.5rem] h-6 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
        <span aria-hidden className="absolute -left-[2px] top-[8.5rem] h-11 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
        <span aria-hidden className="absolute -left-[2px] top-[11.75rem] h-11 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
        <span aria-hidden className="absolute -right-[2px] top-[9.5rem] h-16 w-[3px] rounded-r-md bg-zinc-400 dark:bg-zinc-600" />
        <div className="rounded-[2.85rem] bg-zinc-950 p-[7px]">
          <div className="relative overflow-hidden rounded-[2.45rem] bg-sunken dark:bg-bg">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-2.5 z-30 flex h-[26px] w-[92px] -translate-x-1/2 items-center justify-end rounded-full bg-zinc-950 pr-2.5">
              <span className="size-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700/70" />
            </div>
            <div className="flex min-h-[580px] flex-col px-4 pb-3 pt-2.5">
              {/* status bar */}
              <div className="flex h-[26px] items-center justify-between px-2 text-[11px] font-semibold text-ink-2">
                <span className="tnum">09:41</span>
                <span className="text-[10px] font-medium text-ink-3">Ucell · 5G</span>
              </div>
              {children}
              <div aria-hidden className="mx-auto mt-auto pt-3 h-1 w-24 rounded-full bg-ink/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppTopBar({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="relative mt-1.5 flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-[9px] bg-brand shadow-card">
        <Send className="size-3.5 text-brand-ink" />
      </span>
      <div className="flex-1 leading-tight">
        <p className="text-[13px] font-bold text-ink">{title}</p>
        <p className="text-[9px] text-ink-3">{sub}</p>
      </div>
      <Inbox className="size-4 text-ink-3" />
      <Settings className="size-4 text-ink-3" />
    </div>
  )
}

/* ------------------------------------------------------ dashboard screen */

function DashboardPhone({ labels }: { labels: Record<string, string> }) {
  const reduceMotion = useReducedMotion()
  const logs = [
    { to: '+998 90 123 45 67', text: 'Buyurtmangiz #4213 qabul qilindi ✅', tone: 'ok', badge: '✓✓' },
    { to: '+998 93 555 77 13', text: 'Tasdiqlash kodingiz: 48213', tone: 'brand', badge: 'SMS' },
    { to: '+998 91 782 24 40', text: 'Kuryer Sardor yo‘lga chiqdi 🛵', tone: 'gold', badge: labels.queue },
  ]
  return (
    <PhoneFrame>
      <div className="relative">
        <AppTopBar title="Xabarchi" sub="Galaxy A54" />
        <Marker n={6} className="right-0 top-0" />
      </div>

      {/* on/off ring (1) + network chip (2) */}
      <div className="relative mt-4 flex flex-col items-center">
        <div className="absolute left-0 top-0 flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 shadow-card">
          <Wifi className="size-3 text-ok" />
          <div className="leading-none">
            <p className="text-[8.5px] font-semibold text-ink">Wi-Fi</p>
            <p className="tnum text-[7.5px] text-ink-3">≈ 48 Mbps</p>
          </div>
          <Marker n={2} className="-left-2 -top-2" />
        </div>
        <div className="relative flex size-[132px] items-center justify-center">
          <StatusRing size={132} />
          <motion.div
            className="relative z-10 flex size-[78px] items-center justify-center rounded-full bg-gradient-to-b from-brand to-brand-2 shadow-pop"
            animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Power className="size-7 text-brand-ink" strokeWidth={2.4} />
          </motion.div>
          <Marker n={1} className="-right-1 top-1" />
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[12px] font-semibold text-brand">
          <span className="size-1.5 rounded-full bg-brand" />
          {labels.status}
        </p>
      </div>

      {/* stat cards (3) */}
      <div className="relative mt-4 grid grid-cols-3 gap-2">
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
      <div className="relative mt-4 flex gap-0.5 rounded-xl bg-sunken p-0.5 text-[10px] font-semibold">
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
              <span className={`rounded-md px-1.5 py-0.5 text-[7.5px] font-semibold ${TONE[m.tone]}`}>{m.badge}</span>
            </div>
            <p className="mt-1 line-clamp-1 text-[11.5px] leading-snug text-ink">{m.text}</p>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

/* -------------------------------------------------------- settings screen */

function SettingRow({ n, icon, title, children }: { n: number; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="relative rounded-xl border border-line bg-surface p-2.5 shadow-card">
      <Marker n={n} className="-left-2 -top-2" />
      <div className="flex items-center gap-1.5 text-brand">
        {icon}
        <span className="text-[10px] font-semibold text-ink-2">{title}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function SettingsPhone({ labels }: { labels: Record<string, string> }) {
  const pill = (active: boolean) =>
    `flex-1 rounded-lg py-1 text-center text-[9px] font-semibold ${active ? 'bg-brand text-brand-ink' : 'text-ink-3'}`
  return (
    <PhoneFrame>
      <div className="mt-1.5 flex items-center gap-2">
        <ArrowLeft className="size-4 text-ink-2" />
        <p className="text-[15px] font-bold text-ink">{labels.settingsTitle}</p>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        <SettingRow n={1} icon={<Languages className="size-3.5" />} title={labels.langTitle}>
          <div className="flex gap-0.5 rounded-lg bg-sunken p-0.5">
            <span className={pill(true)}>O‘zbekcha</span>
            <span className={pill(false)}>Русский</span>
            <span className={pill(false)}>English</span>
          </div>
        </SettingRow>

        <SettingRow n={2} icon={<Moon className="size-3.5" />} title={labels.themeTitle}>
          <div className="flex gap-0.5 rounded-lg bg-sunken p-0.5">
            <span className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-[9px] font-semibold text-ink-3"><Monitor className="size-3" />{labels.themeSystem}</span>
            <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-brand py-1 text-[9px] font-semibold text-brand-ink"><Sun className="size-3" />{labels.themeLight}</span>
            <span className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-[9px] font-semibold text-ink-3"><Moon className="size-3" />{labels.themeDark}</span>
          </div>
        </SettingRow>

        <SettingRow n={3} icon={<Volume2 className="size-3.5" />} title={labels.notifTitle}>
          <div className="flex flex-col gap-1.5">
            {[labels.sound, labels.vibration].map((label) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[10px] text-ink">{label}</span>
                <span className="flex h-3.5 w-6 items-center rounded-full bg-brand p-0.5"><span className="ml-auto size-2.5 rounded-full bg-white" /></span>
              </div>
            ))}
          </div>
        </SettingRow>

        <SettingRow n={4} icon={<Timer className="size-3.5" />} title={labels.sendTitle}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-ink">{labels.interval}</span>
            <span className="tnum rounded-md bg-sunken px-2 py-0.5 text-[10px] font-semibold text-ink">5 s</span>
          </div>
          <div className="relative mt-2 flex items-center justify-between">
            <Marker n={5} className="-left-2 -top-1.5" />
            <span className="text-[10px] text-ink">{labels.limit}</span>
            <span className="tnum rounded-md bg-sunken px-2 py-0.5 text-[10px] font-semibold text-ink">800</span>
          </div>
        </SettingRow>

        <div className="relative rounded-xl border border-danger/30 bg-danger-soft p-2.5">
          <Marker n={6} className="-left-2 -top-2" />
          <div className="flex items-center gap-1.5 text-danger">
            <Unlink className="size-3.5" />
            <span className="text-[10.5px] font-semibold">{labels.unpair}</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* --------------------------------------------------------- history screen */

function HistoryPhone({ labels, statuses }: { labels: Record<string, string>; statuses: { label: string; tone: string; desc: string }[] }) {
  const rows = [
    { to: '+998 90 123 45 67', text: 'Buyurtma #4213 yetkazildi', tone: 'ok', badge: statuses[2].label, tick: '✓✓' },
    { to: '+998 93 555 77 13', text: 'Tasdiqlash kodingiz: 48213', tone: 'brand', badge: statuses[1].label, tick: '✓' },
    { to: '+998 97 214 90 05', text: 'Ertaga 15:00 da qabul', tone: 'ok', badge: statuses[2].label, tick: '✓✓' },
    { to: '+998 88 402 11 76', text: 'To‘lov muddati bugun tugaydi', tone: 'danger', badge: statuses[3].label, tick: '!' },
  ]
  return (
    <PhoneFrame>
      <div className="mt-1.5 flex items-center gap-2">
        <ArrowLeft className="size-4 text-ink-2" />
        <p className="text-[15px] font-bold text-ink">{labels.messagesTitle}</p>
      </div>

      <div className="mt-3 flex gap-0.5 rounded-xl bg-sunken p-0.5 text-[10px] font-semibold">
        <span className="flex-1 py-1 text-center text-ink-3">{labels.queue}</span>
        <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-surface py-1 text-ink shadow-card">{labels.history}</span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5">
        {rows.map((m) => (
          <div key={m.to} className="rounded-xl border border-line bg-surface p-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="tnum font-mono text-[10px] text-ink-3">{m.to}</p>
              <span className={`rounded-md px-1.5 py-0.5 text-[7.5px] font-semibold ${TONE[m.tone]}`}>{m.badge}</span>
            </div>
            <p className="mt-1 line-clamp-1 text-[11.5px] leading-snug text-ink">{m.text}</p>
            <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-ink-3">
              <span className="tnum">09:41</span>
              <span className={m.tone === 'danger' ? 'text-danger' : m.tone === 'ok' ? 'text-ok' : 'text-brand'}>{m.tick}</span>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

/* --------------------------------------------------------- QR pairing pair */

/** A decorative (non-scannable) QR glyph: three finder patterns + a
 *  deterministic module fill. Purely illustrative. */
function QrGlyph({ size = 128 }: { size?: number }) {
  const n = 11
  const cell = size / n
  const finder = (x: number, y: number) => (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4)
  const modules: ReactNode[] = []
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (!finder(x, y) && (x * 7 + y * 13 + x * y * 3) % 3 === 0)
        modules.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} />)
  const finders: [number, number][] = [
    [0, 0],
    [n - 3, 0],
    [0, n - 3],
  ]
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      <rect width={size} height={size} fill="#ffffff" />
      <g fill="#0f172a">{modules}</g>
      {finders.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`} fill="#0f172a">
          <rect x={fx * cell} y={fy * cell} width={3 * cell} height={3 * cell} />
          <rect x={(fx + 0.5) * cell} y={(fy + 0.5) * cell} width={2 * cell} height={2 * cell} fill="#ffffff" />
          <rect x={(fx + 1) * cell} y={(fy + 1) * cell} width={cell} height={cell} />
        </g>
      ))}
    </svg>
  )
}

/** The dashboard side: the real /app/devices page with the Add-device QR modal. */
function PairBrowser({
  labels,
}: {
  labels: { browserUrl: string; devicesTitle: string; devicesSubtitle: string; addBtn: string; waiting: string }
}) {
  return (
    <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-sunken px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-gold/70" />
          <span className="size-2.5 rounded-full bg-ok/70" />
        </span>
        <div className="ml-1 flex flex-1 items-center gap-1.5 rounded-md bg-surface px-2.5 py-1">
          <Globe className="size-3 text-ink-3" />
          <span className="tnum truncate font-mono text-[11px] text-ink-3">{labels.browserUrl}</span>
        </div>
      </div>
      {/* the devices page, dimmed under the modal */}
      <div className="relative min-h-[300px] bg-bg p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-base font-bold text-ink">{labels.devicesTitle}</p>
            <p className="mt-0.5 text-[11px] text-ink-3">{labels.devicesSubtitle}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-[11px] font-semibold text-brand-ink">
            <Plus className="size-3" />
            {labels.addBtn}
          </span>
        </div>
        <div className="mt-3 space-y-2 opacity-40">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand"><Smartphone className="size-4" /></span>
              <div className="flex-1">
                <div className="h-2 w-24 rounded bg-line" />
                <div className="mt-1.5 h-1.5 w-16 rounded bg-line/70" />
              </div>
              <span className="size-1.5 rounded-full bg-ok" />
            </div>
          ))}
        </div>
        {/* Add-device modal overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-[230px] rounded-2xl border border-line bg-raised p-4 text-center shadow-pop">
            <p className="text-[13px] font-semibold text-ink">{labels.addBtn}</p>
            <div className="relative mx-auto mt-3 w-fit overflow-hidden rounded-xl border border-line p-1.5">
              <QrGlyph size={120} />
              <motion.span
                aria-hidden
                className="absolute inset-x-2.5 h-0.5 rounded-full bg-brand shadow-[0_0_12px_var(--x-brand)]"
                animate={{ top: ['10%', '86%', '10%'] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-[12px] text-ink-3">
              <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />
              {labels.waiting}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** The app's pairing entry screen: phone number + operator, then scan. */
function PairingPhone({
  labels,
}: {
  labels: {
    pairTitle: string
    pairSubtitle: string
    scanCard: string
    scanCardHint: string
    deviceInfo: string
    deviceName: string
    phone: string
    operator: string
    connect: string
  }
}) {
  const field = (label: string, value: string, icon?: ReactNode, chevron?: boolean) => (
    <div>
      <p className="mb-1 text-[9px] font-medium text-ink-3">{label}</p>
      <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-2">
        {icon}
        <span className="flex-1 truncate text-[11px] text-ink">{value}</span>
        {chevron && <ChevronDown className="size-3 text-ink-3" />}
      </div>
    </div>
  )
  return (
    <PhoneFrame>
      <div className="mt-2">
        <p className="font-display text-[19px] font-bold text-ink">{labels.pairTitle}</p>
        <p className="mt-1 text-[11px] leading-snug text-ink-3">{labels.pairSubtitle}</p>
      </div>

      {/* scan card */}
      <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-gradient-to-br from-brand to-brand-2 p-3 text-white shadow-pop">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
          <QrCode className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold">{labels.scanCard}</p>
          <p className="truncate text-[9.5px] text-white/85">{labels.scanCardHint}</p>
        </div>
        <ScanLine className="ml-auto size-4 text-white/80" />
      </div>

      {/* device details */}
      <div className="mt-3">
        <div className="flex items-center gap-1.5 text-brand">
          <Smartphone className="size-3.5" />
          <span className="text-[10px] font-semibold text-ink-2">{labels.deviceInfo}</span>
        </div>
        <div className="mt-2 space-y-2">
          {field(labels.deviceName, 'Galaxy A54')}
          <div className="flex items-end gap-2">
            <div className="w-[74px] shrink-0">{field(' ', '+998', <span className="text-[11px]">🇺🇿</span>)}</div>
            <div className="flex-1">{field(labels.phone, '90 123 45 67', <Phone className="size-3 text-ink-3" />)}</div>
          </div>
          {field(labels.operator, 'Ucell', undefined, true)}
        </div>
      </div>

      {/* connect button */}
      <div className="mt-3 rounded-xl bg-brand py-2.5 text-center text-[12.5px] font-semibold text-brand-ink shadow-pop">
        {labels.connect}
      </div>
    </PhoneFrame>
  )
}

/** The phone side: the app's QR scanner (dark camera + brackets + scanline). */
function ScannerPhone({ labels }: { labels: { scanTitle: string; scanHint: string } }) {
  const corners = [
    'top-0 left-0 border-l-[3px] border-t-[3px] rounded-tl-xl',
    'top-0 right-0 border-r-[3px] border-t-[3px] rounded-tr-xl',
    'bottom-0 left-0 border-l-[3px] border-b-[3px] rounded-bl-xl',
    'bottom-0 right-0 border-r-[3px] border-b-[3px] rounded-br-xl',
  ]
  return (
    <div className="relative mx-auto w-[300px]">
      <div className="relative rounded-[3rem] bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-300 p-[3px] shadow-pop dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-600">
        <span aria-hidden className="absolute -left-[2px] top-[8.5rem] h-11 w-[3px] rounded-l-md bg-zinc-400 dark:bg-zinc-600" />
        <span aria-hidden className="absolute -right-[2px] top-[9.5rem] h-16 w-[3px] rounded-r-md bg-zinc-400 dark:bg-zinc-600" />
        <div className="rounded-[2.85rem] bg-zinc-950 p-[7px]">
          <div className="relative flex h-[600px] flex-col overflow-hidden rounded-[2.45rem] bg-zinc-900">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            {/* island */}
            <div className="absolute left-1/2 top-2.5 z-30 flex h-[26px] w-[92px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2.5">
              <span className="size-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700/70" />
            </div>
            {/* top bar */}
            <div className="relative z-10 mt-9 flex items-center gap-2 px-4">
              <X className="size-5 text-white/90" />
              <p className="text-[15px] font-semibold text-white">{labels.scanTitle}</p>
            </div>
            {/* scan frame */}
            <div className="relative z-10 flex flex-1 items-center justify-center">
              <div className="relative size-52">
                {corners.map((c) => (
                  <span key={c} className={`absolute size-8 ${c}`} style={{ borderColor: '#2cc7b8' }} />
                ))}
                <motion.span
                  aria-hidden
                  className="absolute inset-x-1 h-0.5 rounded-full bg-[#2cc7b8] shadow-[0_0_16px_#2cc7b8]"
                  animate={{ top: ['4%', '94%', '4%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
            {/* hint + torch */}
            <div className="relative z-10 mb-8 flex flex-col items-center gap-4 px-6">
              <p className="text-center text-[13px] text-white/85">{labels.scanHint}</p>
              <span className="flex size-12 items-center justify-center rounded-full bg-white/15">
                <Flashlight className="size-5 text-white" />
              </span>
            </div>
            <div aria-hidden className="mx-auto mb-2 h-1 w-24 rounded-full bg-white/40" />
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
              <DashboardPhone labels={t.labels} />
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
                {i === 0 && <Smartphone className="absolute right-5 top-5 size-6 text-ink-3/40" />}
                {i === 1 && <QrCode className="absolute right-5 top-5 size-6 text-ink-3/40" />}
                {i === 2 && <Power className="absolute right-5 top-5 size-6 text-ink-3/40" />}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* pair a device with QR — dashboard side + phone scanner side */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand">{t.pair.eyebrow}</p>
            <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.pair.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-ink-2">{t.pair.body}</p>
          </Reveal>
          <div className="mt-14 flex flex-col items-center gap-12 xl:flex-row xl:items-start xl:justify-center xl:gap-6">
            {[
              { n: 1, node: <PairBrowser labels={t.pair} /> },
              { n: 2, node: <PairingPhone labels={t.pair} /> },
              { n: 3, node: <ScannerPhone labels={t.pair} /> },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-ink shadow-pop">{item.n}</span>
                  {item.node}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <ol className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
              {t.pair.steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-line bg-surface p-5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-ink">{i + 1}</span>
                  <h3 className="mt-3 text-[15px] font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* annotated dashboard + legend */}
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
                <DashboardPhone labels={t.labels} />
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

      {/* annotated settings + legend */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand">{t.settings.eyebrow}</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.settings.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-ink-2">{t.settings.body}</p>
        </Reveal>
        <div className="mt-14 grid items-center gap-14 lg:grid-cols-2">
          <Reveal delay={0.1} className="lg:order-2">
            <div className="flex justify-center">
              <SettingsPhone labels={t.labels} />
            </div>
          </Reveal>
          <Reveal className="lg:order-1">
            <ol className="space-y-4">
              {t.settings.marks.map((mark, i) => (
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
      </section>

      {/* history + statuses */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand">{t.history.eyebrow}</p>
            <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.history.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-ink-2">{t.history.body}</p>
          </Reveal>
          <div className="mt-14 grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <div className="flex justify-center">
                <HistoryPhone labels={t.labels} statuses={t.history.statuses} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-ink-3">{t.labels.history}</p>
              <ul className="space-y-3">
                {t.history.statuses.map((s) => (
                  <li key={s.label} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
                    <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${TONE[s.tone]}`}>{s.label}</span>
                    <p className="text-sm leading-relaxed text-ink-2">{s.desc}</p>
                  </li>
                ))}
              </ul>
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
