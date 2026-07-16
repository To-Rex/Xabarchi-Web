import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpen, ChevronDown, LifeBuoy, Mail, MessageCircle, Search, Send, Smartphone, Wallet } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { cn } from '@/shared/lib/cn'
import { CONTACT } from '@/shared/config/contact'
import { Button, Card, CardBody, EmptyState, Input, PageHeader } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Yordam markazi — Xabarchi',
    title: 'Yordam markazi',
    subtitle: 'Javob toping yoki biz bilan bog‘laning.',
    searchPlaceholder: 'Savolingizni yozing…',
    categories: {
      devices: 'Qurilmalar',
      sending: 'Yuborish',
      billing: "To'lovlar",
    },
    articles: [
      { cat: 'devices', q: 'Telefonni qanday ulayman?', a: "Boshqaruv panelida «Qurilmalar» bo'limini oching va «Qurilma qo'shish» tugmasini bosing. Android telefoningizdagi Xabarchi ilovasida QR skannerini ochib, ekrandagi kodni skanerlang. Ulanish bir necha soniya ichida tugaydi." },
      { cat: 'devices', q: 'Telefon tez-tez oflayn bo‘lib qoladi', a: "Ko'pincha bunga batareya tejash rejimi sabab bo'ladi. Android sozlamalarida Xabarchi ilovasi uchun batareya cheklovlarini o'chiring va ilovani «himoyalangan» ro'yxatiga qo'shing. Wi-Fi barqaror bo'lmasa, mobil internetga o'tkazing." },
      { cat: 'devices', q: 'Nechta qurilma ulash mumkin?', a: "Start tarifida 1 ta, Biznes tarifida 5 tagacha, Korxona tarifida 20 tagacha qurilma ulash mumkin. Yuklama qurilmalar o'rtasida avtomatik taqsimlanadi." },
      { cat: 'sending', q: 'SMS nima uchun yetkazilmadi?', a: "Eng ko'p sabablar: qabul qiluvchi raqam o'chirilgan, qurilmada signal yo'q yoki operator kunlik limitni cheklagan. Xabar tafsilotlarida aniq sababni ko'rasiz. Xato bo'lgan xabarlar sozlamalarga qarab avtomatik qayta yuboriladi." },
      { cat: 'sending', q: 'Ommaviy yuborish qanday ishlaydi?', a: "«Yangi SMS» sahifasida kontaktlar ro'yxatidan bir nechta qabul qiluvchini yoki butun guruhni tanlang. Har bir qabul qiluvchi uchun alohida SMS yaratiladi va navbat bo'yicha yuboriladi." },
      { cat: 'sending', q: 'Segment nima?', a: "Bitta SMS 160 lotin belgigacha (kirillda 70) sig'adi. Undan uzun matn bir nechta segmentga bo'linadi va operator har bir segmentni alohida SMS sifatida hisoblaydi." },
      { cat: 'billing', q: 'Tarifni qanday almashtiraman?', a: "«To'lovlar» sahifasida kerakli tarifni tanlang va tasdiqlang. O'zgarish darhol kuchga kiradi, farq keyingi hisob-fakturada hisobga olinadi." },
      { cat: 'billing', q: 'SMS uchun alohida to‘lovmi?', a: "Ha, SMS narxini mobil operatoringizga to'laysiz — bu sizning SIM-kartangiz va tarifingiz. Xabarchi faqat platforma obunasi uchun haq oladi." },
    ],
    contact: {
      title: 'Javob topolmadingizmi?',
      body: 'Qo‘llab-quvvatlash jamoasi ish kunlari 9:00–18:00 da javob beradi.',
      email: 'Email yozish',
      telegram: 'Telegram’da yozish',
      docs: 'API hujjatlari',
    },
  },
  ru: {
    meta: 'Центр помощи — Xabarchi',
    title: 'Центр помощи',
    subtitle: 'Найдите ответ или свяжитесь с нами.',
    searchPlaceholder: 'Опишите ваш вопрос…',
    categories: { devices: 'Устройства', sending: 'Отправка', billing: 'Платежи' },
    articles: [
      { cat: 'devices', q: 'Как подключить телефон?', a: 'Откройте раздел «Устройства» в панели и нажмите «Добавить устройство». В приложении Xabarchi на Android откройте QR-сканер и отсканируйте код с экрана. Подключение занимает несколько секунд.' },
      { cat: 'devices', q: 'Телефон часто уходит в офлайн', a: 'Чаще всего виноват режим энергосбережения. Отключите ограничения батареи для Xabarchi в настройках Android и добавьте приложение в «защищённые». Если Wi-Fi нестабилен — переключитесь на мобильный интернет.' },
      { cat: 'devices', q: 'Сколько устройств можно подключить?', a: 'На тарифе Start — 1, на Biznes — до 5, на Korxona — до 20 устройств. Нагрузка распределяется между ними автоматически.' },
      { cat: 'sending', q: 'Почему SMS не доставлено?', a: 'Частые причины: номер получателя отключён, у устройства нет сигнала или оператор ограничил дневной лимит. Точную причину видно в деталях сообщения. Неудачные сообщения повторяются автоматически, если включено в настройках.' },
      { cat: 'sending', q: 'Как работает массовая рассылка?', a: 'На странице «Новое SMS» выберите несколько получателей из контактов или целую группу. Для каждого получателя создаётся отдельное SMS и отправляется по очереди.' },
      { cat: 'sending', q: 'Что такое сегмент?', a: 'Одно SMS вмещает до 160 латинских символов (70 кириллицей). Более длинный текст делится на сегменты, и оператор считает каждый сегмент отдельным SMS.' },
      { cat: 'billing', q: 'Как сменить тариф?', a: 'На странице «Платежи» выберите нужный тариф и подтвердите. Изменение вступает в силу сразу, разница учитывается в следующем счёте.' },
      { cat: 'billing', q: 'За SMS платится отдельно?', a: 'Да, стоимость SMS вы платите своему мобильному оператору — это ваша SIM-карта и ваш тариф. Xabarchi берёт оплату только за подписку на платформу.' },
    ],
    contact: {
      title: 'Не нашли ответ?',
      body: 'Команда поддержки отвечает в рабочие дни с 9:00 до 18:00.',
      email: 'Написать на email',
      telegram: 'Написать в Telegram',
      docs: 'API документация',
    },
  },
  en: {
    meta: 'Help center — Xabarchi',
    title: 'Help center',
    subtitle: 'Find an answer or get in touch.',
    searchPlaceholder: 'Describe your question…',
    categories: { devices: 'Devices', sending: 'Sending', billing: 'Billing' },
    articles: [
      { cat: 'devices', q: 'How do I connect a phone?', a: 'Open “Devices” in the dashboard and press “Add device”. In the Xabarchi app on your Android phone, open the QR scanner and scan the code on screen. Pairing takes a few seconds.' },
      { cat: 'devices', q: 'My phone keeps going offline', a: 'Battery-saving mode is the usual culprit. Disable battery restrictions for Xabarchi in Android settings and add the app to the “protected” list. If Wi-Fi is unstable, switch to mobile data.' },
      { cat: 'devices', q: 'How many devices can I connect?', a: 'Start allows 1 device, Biznes up to 5, Korxona up to 20. Load is balanced between them automatically.' },
      { cat: 'sending', q: 'Why wasn’t my SMS delivered?', a: 'Common causes: the recipient’s number is switched off, the device has no signal, or the carrier throttled the daily limit. The exact reason is shown in the message details. Failed messages retry automatically if enabled in settings.' },
      { cat: 'sending', q: 'How does bulk sending work?', a: 'On the “New SMS” page, pick several recipients from your contacts or a whole group. A separate SMS is created for each recipient and sent through the queue.' },
      { cat: 'sending', q: 'What is a segment?', a: 'One SMS holds up to 160 Latin characters (70 Cyrillic). Longer text splits into segments, and the carrier bills each segment as a separate SMS.' },
      { cat: 'billing', q: 'How do I change my plan?', a: 'On the “Billing” page, pick the plan you need and confirm. The change takes effect immediately; the difference is settled on the next invoice.' },
      { cat: 'billing', q: 'Do I pay for SMS separately?', a: 'Yes — you pay your mobile carrier for the SMS themselves; it’s your SIM card and your plan. Xabarchi only charges the platform subscription.' },
    ],
    contact: {
      title: 'Didn’t find an answer?',
      body: 'The support team replies on business days, 9:00–18:00.',
      email: 'Write an email',
      telegram: 'Message on Telegram',
      docs: 'API docs',
    },
  },
}

const catIcon: Record<string, typeof Smartphone> = { devices: Smartphone, sending: Send, billing: Wallet }

export default function HelpPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  usePageMeta(t.meta)

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return t.articles.filter((article) => !term || article.q.toLowerCase().includes(term) || article.a.toLowerCase().includes(term))
  }, [search, t.articles])

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const article of filtered) {
      const list = map.get(article.cat) ?? []
      list.push(article)
      map.set(article.cat, list)
    }
    return map
  }, [filtered])

  return (
    <div className="max-w-3xl">
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <Input
        placeholder={t.searchPlaceholder}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        leading={<Search className="size-4" />}
        aria-label={c.search}
        containerClassName="mb-6 max-w-md"
      />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<LifeBuoy />} title={c.noResults} body={c.noResultsBody} />
        </Card>
      ) : (
        <div className="space-y-6">
          {[...byCategory.entries()].map(([category, articles]) => {
            const Icon = catIcon[category] ?? BookOpen
            return (
              <section key={category}>
                <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-ink-3">
                  <Icon className="size-4 text-brand" />
                  {t.categories[category as keyof typeof t.categories]}
                </h2>
                <div className="space-y-2.5">
                  {articles.map((article) => {
                    const isOpen = open === article.q
                    return (
                      <div key={article.q} className={cn('rounded-xl border bg-surface transition-colors', isOpen ? 'border-brand/40 shadow-card' : 'border-line')}>
                        <button onClick={() => setOpen(isOpen ? null : article.q)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
                          <span className="text-sm font-semibold text-ink">{article.q}</span>
                          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }} className={cn(isOpen ? 'text-brand' : 'text-ink-3')}>
                            <ChevronDown className="size-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="px-4 pb-4 text-[13px] leading-relaxed text-ink-2">{article.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {/* Contact */}
      <Card className="mt-8">
        <CardBody className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <MessageCircle className="size-5" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-ink">{t.contact.title}</p>
              <p className="mt-0.5 text-[13px] text-ink-2">{t.contact.body}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href={`mailto:${CONTACT.email}`}>
              <Button variant="secondary" size="sm">
                <Mail className="size-4" />
                {t.contact.email}
              </Button>
            </a>
            <Button size="sm" onClick={() => window.open(CONTACT.telegram, '_blank')}>
              <Send className="size-4" />
              {t.contact.telegram}
            </Button>
            <Link to="/docs">
              <Button variant="ghost" size="sm">
                <BookOpen className="size-4" />
                {t.contact.docs}
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
