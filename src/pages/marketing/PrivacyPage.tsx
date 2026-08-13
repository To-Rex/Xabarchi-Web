import { ShieldCheck } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { CONTACT } from '@/shared/config/contact'
import { LegalDoc, type LegalSection } from './LegalDoc'

const dict = {
  uz: {
    meta: { title: 'Maxfiylik siyosati — Xabarchi', desc: "Xabarchi qanday ma'lumotlarni yig'adi va ularni qanday himoya qiladi." },
    title: 'Maxfiylik siyosati',
    updated: 'Oxirgi yangilanish: 2026-yil 1-avgust',
    intro:
      "Ushbu siyosat Xabarchi qanday ma'lumotlarni yig'ishi, ulardan qanday foydalanishi va ularni qanday himoya qilishini tushuntiradi. Qisqasi: xabar matnlaringiz serverlarimizda saqlanmaydi.",
    sections: [
      {
        h: "Yig'iladigan ma'lumotlar",
        p: [
          "Hisob ma'lumotlari (ism, email, telefon), ulangan qurilmalar haqidagi texnik ma'lumotlar (model, batareya, tarmoq holati) va yetkazish statistikasi (yuborilgan/yetkazilgan soni, vaqt belgilari).",
        ],
      },
      {
        h: 'Xabar matnlari',
        p: [
          "SMS matnlari va qabul qiluvchi raqamlar faqat yetkazish uchun qurilmangizga uzatiladi va serverlarimizda doimiy saqlanmaydi. Panel tarixida ko'rsatiladigan ma'lumotlar sizning hisobingizga tegishli bo'lib, istalgan payt o'chirilishi mumkin.",
        ],
      },
      {
        h: "Ma'lumotlardan foydalanish",
        p: [
          "Ma'lumotlar faqat xizmatni ko'rsatish, statistika hisoblash, texnik yordam va xavfsizlikni ta'minlash uchun ishlatiladi. Biz ma'lumotlaringizni uchinchi shaxslarga sotmaymiz.",
        ],
      },
      {
        h: 'Himoya',
        p: [
          "Barcha trafik TLS bilan shifrlanadi. API kalitlar xeshlangan holda saqlanadi va faqat yaratilganda bir marta ko'rsatiladi. Kirish urinishlari kuzatib boriladi.",
        ],
      },
      {
        h: 'Saqlash muddati va cookie',
        p: [
          "Hisob ma'lumotlari hisob faol bo'lgan davrda saqlanadi; hisob o'chirilganda 30 kun ichida to'liq o'chiriladi. Brauzerda faqat sessiya, til va mavzu sozlamalari uchun localStorage ishlatiladi — kuzatuv cookie'lari yo'q.",
        ],
      },
      {
        h: 'Huquqlaringiz',
        p: [
          "Istalgan payt ma'lumotlaringiz nusxasini so'rashingiz, ularni tuzatishingiz yoki hisobni butunlay o'chirishingiz mumkin — sozlamalar bo'limida yoki biz bilan bog'lanish orqali.",
        ],
      },
      {
        h: 'Aloqa',
        p: [`Maxfiylik bo'yicha savollar: ${CONTACT.email}.`],
      },
    ] satisfies LegalSection[],
  },
  ru: {
    meta: { title: 'Политика конфиденциальности — Xabarchi', desc: 'Какие данные собирает Xabarchi и как их защищает.' },
    title: 'Политика конфиденциальности',
    updated: 'Последнее обновление: 1 августа 2026 г.',
    intro:
      'Эта политика объясняет, какие данные собирает Xabarchi, как они используются и как защищаются. Коротко: тексты ваших сообщений не хранятся на наших серверах.',
    sections: [
      {
        h: 'Какие данные мы собираем',
        p: [
          'Данные аккаунта (имя, email, телефон), технические сведения о подключённых устройствах (модель, батарея, состояние сети) и статистику доставки (количество отправленных/доставленных, отметки времени).',
        ],
      },
      {
        h: 'Тексты сообщений',
        p: [
          'Тексты SMS и номера получателей передаются на ваше устройство только для доставки и не хранятся постоянно на наших серверах. Данные в истории панели принадлежат вашему аккаунту и могут быть удалены в любой момент.',
        ],
      },
      {
        h: 'Как используются данные',
        p: [
          'Данные используются только для предоставления сервиса, подсчёта статистики, поддержки и обеспечения безопасности. Мы не продаём ваши данные третьим лицам.',
        ],
      },
      {
        h: 'Защита',
        p: [
          'Весь трафик шифруется TLS. API-ключи хранятся в хешированном виде и показываются только один раз при создании. Попытки входа отслеживаются.',
        ],
      },
      {
        h: 'Сроки хранения и cookie',
        p: [
          'Данные аккаунта хранятся, пока аккаунт активен; после удаления аккаунта они полностью стираются в течение 30 дней. В браузере используется только localStorage для сессии, языка и темы — трекинговых cookie нет.',
        ],
      },
      {
        h: 'Ваши права',
        p: [
          'Вы можете в любой момент запросить копию своих данных, исправить их или полностью удалить аккаунт — в настройках или связавшись с нами.',
        ],
      },
      {
        h: 'Контакты',
        p: [`Вопросы о конфиденциальности: ${CONTACT.email}.`],
      },
    ] satisfies LegalSection[],
  },
  en: {
    meta: { title: 'Privacy Policy — Xabarchi', desc: 'What data Xabarchi collects and how it protects it.' },
    title: 'Privacy Policy',
    updated: 'Last updated: 1 August 2026',
    intro:
      'This policy explains what data Xabarchi collects, how it is used and how it is protected. In short: your message texts are not stored on our servers.',
    sections: [
      {
        h: 'Data we collect',
        p: [
          'Account details (name, email, phone), technical information about connected devices (model, battery, network state) and delivery statistics (sent/delivered counts, timestamps).',
        ],
      },
      {
        h: 'Message contents',
        p: [
          'SMS texts and recipient numbers are relayed to your device for delivery only and are not stored permanently on our servers. Data shown in the dashboard history belongs to your account and can be deleted at any time.',
        ],
      },
      {
        h: 'How data is used',
        p: [
          'Data is used solely to provide the service, compute statistics, offer support and keep the platform secure. We never sell your data to third parties.',
        ],
      },
      {
        h: 'Protection',
        p: [
          'All traffic is TLS-encrypted. API keys are stored hashed and shown only once at creation. Sign-in attempts are monitored.',
        ],
      },
      {
        h: 'Retention and cookies',
        p: [
          'Account data is kept while the account is active; after deletion it is fully erased within 30 days. The browser only uses localStorage for session, language and theme preferences — there are no tracking cookies.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          'You may request a copy of your data, correct it, or delete your account entirely at any time — from settings or by contacting us.',
        ],
      },
      {
        h: 'Contact',
        p: [`Privacy questions: ${CONTACT.email}.`],
      },
    ] satisfies LegalSection[],
  },
}

export default function PrivacyPage() {
  const t = useT(dict)
  usePageMeta(t.meta.title, t.meta.desc)
  return <LegalDoc icon={<ShieldCheck className="size-6" />} title={t.title} updated={t.updated} intro={t.intro} sections={t.sections} />
}
