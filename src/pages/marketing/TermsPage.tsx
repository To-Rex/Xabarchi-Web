import { ScrollText } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { CONTACT } from '@/shared/config/contact'
import { LegalDoc, type LegalSection } from './LegalDoc'

const dict = {
  uz: {
    meta: { title: 'Foydalanish shartlari — Xabarchi', desc: 'Xabarchi platformasidan foydalanish shartlari.' },
    title: 'Foydalanish shartlari',
    updated: 'Oxirgi yangilanish: 2026-yil 1-avgust',
    intro:
      "Ushbu shartlar Xabarchi platformasidan (veb-panel, Android ilova va API) foydalanishni tartibga soladi. Ro'yxatdan o'tish orqali siz quyidagi shartlarga rozilik bildirasiz.",
    sections: [
      {
        h: 'Xizmat tavsifi',
        p: [
          "Xabarchi — o'z Android qurilmangiz va SIM-kartangiz orqali SMS yuborish imkonini beruvchi platforma. Biz SMS operatori emasmiz: xabarlar sizning qurilmangizdan, sizning operatoringiz tarifi bo'yicha jo'natiladi.",
        ],
      },
      {
        h: 'Hisob va xavfsizlik',
        p: [
          "Hisobingiz va API kalitlaringiz maxfiyligi uchun siz javobgarsiz. Kalit oshkor bo'lgan taqdirda uni darhol bekor qiling — panel orqali istalgan payt yangisini yaratish mumkin.",
        ],
      },
      {
        h: 'Ruxsat etilmagan foydalanish',
        p: [
          "Spam, firibgarlik, qonunga zid yoki qabul qiluvchi roziligisiz ommaviy xabar yuborish taqiqlanadi. O'zbekiston Respublikasi reklama va aloqa qonunchiligiga rioya qilish foydalanuvchi zimmasida.",
          "Qoidabuzarlik aniqlansa, hisob ogohlantirishsiz cheklanishi yoki o'chirilishi mumkin.",
        ],
      },
      {
        h: "To'lovlar va tariflar",
        p: [
          "Platforma obunasi tanlangan tarifga ko'ra to'lanadi. SMS narxi mobil operatoringizga bog'liq va Xabarchi tomonidan undirilmaydi. Tariflar o'zgarishi haqida kamida 30 kun oldin xabar beramiz.",
        ],
      },
      {
        h: 'Javobgarlik cheklovi',
        p: [
          "Xizmat «boricha» taqdim etiladi. Operator tarmog'idagi uzilishlar, qurilmaning o'chib qolishi yoki uchinchi tomon xizmatlari sabab yetkazilmagan xabarlar uchun Xabarchi javobgar emas.",
        ],
      },
      {
        h: "Shartlarning o'zgarishi",
        p: [
          "Shartlar vaqti-vaqti bilan yangilanishi mumkin. Muhim o'zgarishlar haqida email yoki panel orqali xabar beramiz; xizmatdan foydalanishni davom ettirish yangi shartlarga rozilik hisoblanadi.",
        ],
      },
      {
        h: 'Aloqa',
        p: [`Savollar uchun: ${CONTACT.email} yoki ${CONTACT.phoneDisplay}.`],
      },
    ] satisfies LegalSection[],
  },
  ru: {
    meta: { title: 'Условия использования — Xabarchi', desc: 'Условия использования платформы Xabarchi.' },
    title: 'Условия использования',
    updated: 'Последнее обновление: 1 августа 2026 г.',
    intro:
      'Настоящие условия регулируют использование платформы Xabarchi (веб-панель, Android-приложение и API). Регистрируясь, вы соглашаетесь с приведёнными ниже условиями.',
    sections: [
      {
        h: 'Описание сервиса',
        p: [
          'Xabarchi — платформа для отправки SMS через ваше собственное Android-устройство и SIM-карту. Мы не являемся SMS-оператором: сообщения отправляются с вашего устройства по тарифу вашего оператора.',
        ],
      },
      {
        h: 'Аккаунт и безопасность',
        p: [
          'Вы несёте ответственность за конфиденциальность аккаунта и API-ключей. Если ключ скомпрометирован, немедленно отзовите его — новый можно создать в панели в любой момент.',
        ],
      },
      {
        h: 'Запрещённое использование',
        p: [
          'Запрещены спам, мошенничество, незаконные рассылки и массовые сообщения без согласия получателя. Соблюдение законодательства Республики Узбекистан о рекламе и связи — обязанность пользователя.',
          'При выявлении нарушений аккаунт может быть ограничен или удалён без предупреждения.',
        ],
      },
      {
        h: 'Платежи и тарифы',
        p: [
          'Подписка на платформу оплачивается согласно выбранному тарифу. Стоимость SMS зависит от вашего мобильного оператора и не взимается Xabarchi. Об изменении тарифов мы уведомляем минимум за 30 дней.',
        ],
      },
      {
        h: 'Ограничение ответственности',
        p: [
          'Сервис предоставляется «как есть». Xabarchi не несёт ответственности за сообщения, не доставленные из-за сбоев сети оператора, отключения устройства или сторонних сервисов.',
        ],
      },
      {
        h: 'Изменение условий',
        p: [
          'Условия могут периодически обновляться. О существенных изменениях мы сообщаем по email или через панель; продолжение использования сервиса означает согласие с новыми условиями.',
        ],
      },
      {
        h: 'Контакты',
        p: [`По вопросам: ${CONTACT.email} или ${CONTACT.phoneDisplay}.`],
      },
    ] satisfies LegalSection[],
  },
  en: {
    meta: { title: 'Terms of Service — Xabarchi', desc: 'Terms of service for the Xabarchi platform.' },
    title: 'Terms of Service',
    updated: 'Last updated: 1 August 2026',
    intro:
      'These terms govern your use of the Xabarchi platform (web dashboard, Android app and API). By signing up you agree to the terms below.',
    sections: [
      {
        h: 'Service description',
        p: [
          'Xabarchi is a platform for sending SMS through your own Android device and SIM card. We are not an SMS carrier: messages are sent from your device, billed by your carrier’s plan.',
        ],
      },
      {
        h: 'Account and security',
        p: [
          'You are responsible for keeping your account and API keys confidential. If a key is compromised, revoke it immediately — a new one can be created in the dashboard at any time.',
        ],
      },
      {
        h: 'Prohibited use',
        p: [
          'Spam, fraud, unlawful messaging and bulk messages without recipient consent are prohibited. Complying with the advertising and communications laws of the Republic of Uzbekistan is the user’s responsibility.',
          'Accounts found in violation may be restricted or removed without notice.',
        ],
      },
      {
        h: 'Payments and plans',
        p: [
          'The platform subscription is billed per your chosen plan. SMS cost depends on your mobile carrier and is not charged by Xabarchi. We announce plan changes at least 30 days in advance.',
        ],
      },
      {
        h: 'Limitation of liability',
        p: [
          'The service is provided “as is”. Xabarchi is not liable for messages left undelivered due to carrier network failures, a device going offline, or third-party services.',
        ],
      },
      {
        h: 'Changes to the terms',
        p: [
          'These terms may be updated from time to time. We announce material changes by email or in the dashboard; continued use of the service constitutes acceptance of the new terms.',
        ],
      },
      {
        h: 'Contact',
        p: [`Questions: ${CONTACT.email} or ${CONTACT.phoneDisplay}.`],
      },
    ] satisfies LegalSection[],
  },
}

export default function TermsPage() {
  const t = useT(dict)
  usePageMeta(t.meta.title, t.meta.desc)
  return <LegalDoc icon={<ScrollText className="size-6" />} title={t.title} updated={t.updated} intro={t.intro} sections={t.sections} />
}
