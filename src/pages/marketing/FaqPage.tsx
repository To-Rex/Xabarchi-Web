import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, MessageCircleQuestion } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { cn } from '@/shared/lib/cn'
import { Button, Reveal } from '@/shared/ui'

const dict = {
  uz: {
    meta: { title: 'Savol-javoblar — Xabarchi', desc: 'Xabarchi haqida eng ko‘p beriladigan savollar va javoblar.' },
    title: 'Savollaringizga javoblar',
    subtitle: 'Topolmadingizmi? Bizga yozing — bir ish kunida javob beramiz.',
    contact: 'Savol berish',
    items: [
      { q: 'Xabarchi qanday ishlaydi?', a: "Android telefoningizga Xabarchi ilovasini o'rnatasiz va QR kod orqali hisobingizga ulaysiz. Shundan so'ng boshqaruv paneli yoki API orqali yuborilgan har bir xabar ana shu telefon orqali, o'z SIM-kartangizdan jo'natiladi." },
      { q: 'SMS uchun kimga to‘layman?', a: "SMS narxi mobil operatoringizning tarifiga bog'liq — to'lovni operatorga qilasiz. Ko'p biznes SMS-paketli korporativ tariflardan foydalanadi, shunda bitta SMS narxi juda arzon bo'ladi. Xabarchi faqat platforma obunasini oladi." },
      { q: 'Qaysi telefonlar mos keladi?', a: "Android 8 va undan yuqori versiyali istalgan telefon. Eski, ishlatilmay yotgan telefon ham bo'laveradi — asosiysi u internetga ulangan va SIM-kartasi bo'lsa." },
      { q: 'Bir kunda nechta SMS yuborsam bo‘ladi?', a: "Texnik jihatdan har bir qurilma uchun kunlik limit o'zingiz belgilaysiz. Amalda operatorlar bir SIM-kartadan kuniga 500–1000 SMS gacha ruxsat beradi. Katta hajmlar uchun bir nechta qurilma ulang — Xabarchi yuklamani avtomatik taqsimlaydi." },
      { q: 'Telefon o‘chib qolsa nima bo‘ladi?', a: "Navbatdagi xabarlar yo'qolmaydi. Agar hisobingizda boshqa faol qurilma bo'lsa, navbat avtomatik unga o'tadi. Bo'lmasa, xabarlar telefon qayta ulanguncha navbatda kutadi va sizga darhol bildirishnoma yuboriladi." },
      { q: 'API orqali qanday ulanaman?', a: "Boshqaruv panelida API kalit yaratasiz va REST API ga so'rov yuborasiz — oddiy POST /v1/messages. Webhooklar orqali yetkazilganlik statusini real vaqtda olasiz. Hujjatlarda curl, JavaScript va Python misollari bor." },
      { q: 'Xabarlarim xavfsizmi?', a: "Panel va telefon orasidagi barcha trafik TLS bilan shifrlanadi. Xabar matnlari serverlarimizda saqlanmaydi — ular faqat sizning qurilmangiz orqali o'tadi. API kalitlarini istalgan payt bekor qilishingiz mumkin." },
      { q: 'Bepul tarifda nima bor?', a: "Start tarifi doim bepul: oyiga 500 SMS, 1 ta qurilma, shablonlar va kontaktlar. Kredit karta talab qilinmaydi. O'sganingizda istalgan payt Biznes tarifiga o'tasiz." },
    ],
  },
  ru: {
    meta: { title: 'Вопросы и ответы — Xabarchi', desc: 'Часто задаваемые вопросы о Xabarchi.' },
    title: 'Ответы на ваши вопросы',
    subtitle: 'Не нашли ответ? Напишите нам — ответим в течение рабочего дня.',
    contact: 'Задать вопрос',
    items: [
      { q: 'Как работает Xabarchi?', a: 'Вы устанавливаете приложение Xabarchi на Android-телефон и привязываете его к аккаунту по QR-коду. После этого каждое сообщение, отправленное из панели или через API, уходит через этот телефон с вашей SIM-карты.' },
      { q: 'Кому я плачу за SMS?', a: 'Стоимость SMS зависит от тарифа вашего мобильного оператора — платите вы ему. Многие бизнесы используют корпоративные тарифы с пакетами SMS, где цена одного сообщения минимальна. Xabarchi берёт только подписку за платформу.' },
      { q: 'Какие телефоны подходят?', a: 'Любой телефон с Android 8 и выше. Подойдёт и старый, лежащий без дела — главное, чтобы был интернет и SIM-карта.' },
      { q: 'Сколько SMS можно отправить в день?', a: 'Дневной лимит на устройство вы задаёте сами. На практике операторы допускают 500–1000 SMS с одной SIM-карты в день. Для больших объёмов подключите несколько устройств — Xabarchi распределит нагрузку автоматически.' },
      { q: 'Что будет, если телефон отключится?', a: 'Сообщения в очереди не теряются. Если в аккаунте есть другое активное устройство, очередь автоматически перейдёт на него. Если нет — сообщения подождут переподключения, а вы сразу получите уведомление.' },
      { q: 'Как подключиться через API?', a: 'Создайте API-ключ в панели и отправляйте запросы в REST API — простой POST /v1/messages. Статусы доставки приходят в реальном времени через вебхуки. В документации есть примеры на curl, JavaScript и Python.' },
      { q: 'Мои сообщения в безопасности?', a: 'Весь трафик между панелью и телефоном шифруется TLS. Тексты сообщений не хранятся на наших серверах — они проходят только через ваше устройство. API-ключи можно отозвать в любой момент.' },
      { q: 'Что входит в бесплатный тариф?', a: 'Тариф Start бесплатен навсегда: 500 SMS в месяц, 1 устройство, шаблоны и контакты. Кредитная карта не нужна. Вырастете — в любой момент перейдёте на Biznes.' },
    ],
  },
  en: {
    meta: { title: 'FAQ — Xabarchi', desc: 'Frequently asked questions about Xabarchi.' },
    title: 'Answers to your questions',
    subtitle: 'Can’t find it? Write to us — we reply within one business day.',
    contact: 'Ask a question',
    items: [
      { q: 'How does Xabarchi work?', a: 'You install the Xabarchi app on an Android phone and pair it to your account with a QR code. From then on, every message sent from the dashboard or the API goes out through that phone, from your own SIM card.' },
      { q: 'Who do I pay for the SMS?', a: 'SMS cost depends on your mobile carrier’s plan — you pay them directly. Many businesses use corporate plans with SMS bundles where a single message costs next to nothing. Xabarchi only charges the platform subscription.' },
      { q: 'Which phones are supported?', a: 'Any phone running Android 8 or newer. An old spare phone works fine — it just needs internet and a SIM card.' },
      { q: 'How many SMS can I send per day?', a: 'You set the daily limit per device yourself. In practice carriers allow 500–1,000 SMS per SIM per day. For bigger volumes, connect several devices — Xabarchi balances the load automatically.' },
      { q: 'What happens if the phone goes offline?', a: 'Queued messages are never lost. If another device is active on your account, the queue reroutes to it automatically. If not, messages wait until the phone reconnects — and you get notified immediately.' },
      { q: 'How do I integrate via the API?', a: 'Create an API key in the dashboard and call the REST API — a simple POST /v1/messages. Delivery statuses arrive in real time via webhooks. The docs include curl, JavaScript and Python examples.' },
      { q: 'Are my messages secure?', a: 'All traffic between the dashboard and the phone is TLS-encrypted. Message texts are never stored on our servers — they only pass through your device. API keys can be revoked at any time.' },
      { q: 'What’s in the free plan?', a: 'The Start plan is free forever: 500 SMS a month, 1 device, templates and contacts. No credit card required. When you grow, upgrade to Biznes any time.' },
    ],
  },
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={cn('rounded-2xl border transition-colors duration-300', open ? 'border-brand/40 bg-surface shadow-card' : 'border-line bg-surface')}>
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-[15px] font-semibold text-ink">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className={cn('shrink-0', open ? 'text-brand' : 'text-ink-3')}>
          <ChevronDown className="size-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-ink-2">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPage() {
  const t = useT(dict)
  usePageMeta(t.meta.title, t.meta.desc)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <Reveal className="text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <MessageCircleQuestion className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
      </Reveal>
      <div className="mt-12 space-y-3">
        {t.items.map((item, index) => (
          <Reveal key={item.q} delay={Math.min(index * 0.05, 0.3)}>
            <FaqItem q={item.q} a={item.a} open={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 text-center">
        <p className="text-sm text-ink-2">{t.subtitle}</p>
        <a href="mailto:salom@xabarchi.uz" className="mt-4 inline-block">
          <Button variant="secondary">{t.contact}</Button>
        </a>
      </Reveal>
    </div>
  )
}
