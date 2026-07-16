import type {
  ApiKey,
  AppNotification,
  Contact,
  ContactGroup,
  DailyStat,
  Device,
  Invoice,
  Plan,
  SmsMessage,
  Template,
  UserProfile,
} from './types'

/* Seeded PRNG so the mock world is stable across reloads */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(998)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

const NOW = Date.now()
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const agoIso = (ms: number) => new Date(NOW - ms).toISOString()

/* ------------------------------------------------------------------ user */

export const user: UserProfile = {
  id: 'usr_01',
  firstName: 'Jasur',
  lastName: 'Karimov',
  email: 'jasur@samarqand.express',
  phone: '998901234567',
  company: 'Samarqand Express',
  role: 'owner',
  avatarHue: 172,
  planId: 'biznes',
  createdAt: agoIso(190 * DAY),
  timezone: 'Asia/Tashkent',
}

/* --------------------------------------------------------------- devices */

export const devices: Device[] = [
  {
    id: 'dev_01',
    name: 'Asosiy ofis',
    model: 'Samsung Galaxy A54',
    phone: '998901234567',
    operator: 'Ucell',
    status: 'online',
    battery: 84,
    signal: 4,
    androidVersion: '14',
    appVersion: '2.4.1',
    sentToday: 412,
    dailyLimit: 800,
    lastSeenAt: agoIso(2 * MINUTE),
    isDefault: true,
  },
  {
    id: 'dev_02',
    name: 'Omborxona',
    model: 'Redmi Note 13 Pro',
    phone: '998935557713',
    operator: 'Mobiuz',
    status: 'online',
    battery: 21,
    signal: 3,
    androidVersion: '13',
    appVersion: '2.4.1',
    sentToday: 268,
    dailyLimit: 500,
    lastSeenAt: agoIso(6 * MINUTE),
    isDefault: false,
  },
  {
    id: 'dev_03',
    name: 'Kuryer navbatchi',
    model: 'Google Pixel 6a',
    phone: '998911782240',
    operator: 'Beeline',
    status: 'offline',
    battery: 0,
    signal: 0,
    androidVersion: '15',
    appVersion: '2.3.9',
    sentToday: 96,
    dailyLimit: 500,
    lastSeenAt: agoIso(3 * HOUR + 40 * MINUTE),
    isDefault: false,
  },
]

/* -------------------------------------------------------------- contacts */

export const groups: ContactGroup[] = [
  { id: 'grp_clients', name: 'Mijozlar', color: '#0E9488' },
  { id: 'grp_couriers', name: 'Kuryerlar', color: '#2E6FB7' },
  { id: 'grp_vip', name: 'VIP', color: '#B97D1E' },
  { id: 'grp_partners', name: 'Hamkorlar', color: '#8E5BB8' },
]

const FIRST_NAMES = [
  'Aziz', 'Bobur', 'Dilnoza', 'Eldor', 'Feruza', 'Gulnora', 'Islom', 'Jahongir',
  'Kamola', 'Laylo', 'Malika', 'Nodir', 'Otabek', 'Rustam', 'Sardor', 'Sevara',
  'Shahzod', 'Timur', 'Umida', 'Zafar', 'Zilola', 'Madina', 'Farrux', 'Nilufar',
]
const LAST_NAMES = [
  'Karimov', 'Rahimova', 'Tashkentov', 'Yusupova', 'Abdullayev', 'Ismoilova',
  'Saidov', 'Mirzayeva', 'Toshpulatov', 'Ergasheva', 'Nazarov', 'Xolmatova',
  'Berdiyev', 'Qodirova', 'Olimov', 'Sultonova',
]
const COMPANIES = ['Havas Market', 'Registon Plaza', 'Chorsu Bozor', 'MediPlus Klinika', 'Anor Cafe', undefined, undefined, undefined]

export const contacts: Contact[] = Array.from({ length: 34 }, (_, i) => {
  const groupRoll = rand()
  const groupIds =
    groupRoll < 0.55 ? ['grp_clients'] : groupRoll < 0.72 ? ['grp_couriers'] : groupRoll < 0.86 ? ['grp_vip', 'grp_clients'] : ['grp_partners']
  return {
    id: `cnt_${String(i + 1).padStart(2, '0')}`,
    firstName: pick(FIRST_NAMES),
    lastName: pick(LAST_NAMES),
    phone: `9989${pick(['0', '1', '3', '4', '7', '8'])}${String(randInt(1000000, 9999999))}`,
    company: pick(COMPANIES),
    groupIds,
    createdAt: agoIso(randInt(1, 180) * DAY),
  }
})

/* ------------------------------------------------------------- templates */

export const templates: Template[] = [
  {
    id: 'tpl_01',
    name: 'Buyurtma tasdiqlandi',
    text: "Hurmatli {ism}, buyurtmangiz #{raqam} qabul qilindi. Yetkazib berish: {sana}. Samarqand Express",
    variables: ['ism', 'raqam', 'sana'],
    usedCount: 1840,
    updatedAt: agoIso(12 * DAY),
  },
  {
    id: 'tpl_02',
    name: 'Tasdiqlash kodi (OTP)',
    text: 'Xabarchi: tasdiqlash kodingiz {kod}. Uni hech kimga bermang.',
    variables: ['kod'],
    usedCount: 5216,
    updatedAt: agoIso(45 * DAY),
  },
  {
    id: 'tpl_03',
    name: 'Kuryer yo‘lda',
    text: "{ism}, kuryerimiz {kuryer} buyurtmangiz bilan yo'lga chiqdi. Tel: {tel}",
    variables: ['ism', 'kuryer', 'tel'],
    usedCount: 987,
    updatedAt: agoIso(5 * DAY),
  },
  {
    id: 'tpl_04',
    name: "To'lov eslatmasi",
    text: "Hurmatli mijoz, {summa} so'm to'lovingiz {sana} gacha kutilmoqda. Savollar: +998 99 534 03 13",
    variables: ['summa', 'sana'],
    usedCount: 412,
    updatedAt: agoIso(20 * DAY),
  },
  {
    id: 'tpl_05',
    name: 'Chegirma aksiyasi',
    text: "{ism}! Faqat shu hafta: barcha mahsulotlarga 20% chegirma. Batafsil: samarqand.express",
    variables: ['ism'],
    usedCount: 156,
    updatedAt: agoIso(2 * DAY),
  },
]

/* -------------------------------------------------------------- messages */

const SMS_BODIES = [
  'Hurmatli Aziz, buyurtmangiz #4213 qabul qilindi. Yetkazib berish: 17-iyul. Samarqand Express',
  'Xabarchi: tasdiqlash kodingiz 48213. Uni hech kimga bermang.',
  "Malika, kuryerimiz Sardor buyurtmangiz bilan yo'lga chiqdi. Tel: +998 90 555 12 34",
  "Hurmatli mijoz, 250 000 so'm to'lovingiz 20-iyul gacha kutilmoqda.",
  'Buyurtmangiz #4198 yetkazib berildi. Xaridingiz uchun rahmat!',
  'Eslatma: ertaga soat 15:00 da qabulga yozilgansiz. MediPlus Klinika',
  "Otabek! Faqat shu hafta: barcha mahsulotlarga 20% chegirma.",
  'Xabarchi: tasdiqlash kodingiz 91307. Uni hech kimga bermang.',
  'Buyurtmangiz #4225 tayyor. Olib ketish: Chorsu filiali, 10:00-20:00',
  "Hurmatli mijoz, balansingiz 12 000 so'mga to'ldirildi. Rahmat!",
]

function statusFor(ageMs: number): SmsMessage['status'] {
  if (ageMs < 2 * MINUTE) return pick(['queued', 'sending', 'sent'])
  if (ageMs < 10 * MINUTE) return pick(['sent', 'delivered', 'delivered'])
  const roll = rand()
  if (roll < 0.94) return 'delivered'
  if (roll < 0.97) return 'sent'
  return 'failed'
}

export const messages: SmsMessage[] = Array.from({ length: 220 }, (_, i) => {
  // Denser recent history, thinning toward 30 days back
  const ageMs = i < 14 ? randInt(1, 110) * MINUTE : randInt(2 * 60, 30 * 24 * 60) * MINUTE
  const status = statusFor(ageMs)
  const contact = rand() < 0.75 ? pick(contacts) : undefined
  const segments = rand() < 0.8 ? 1 : 2
  return {
    id: `sms_${String(i + 1).padStart(4, '0')}`,
    to: contact?.phone ?? `9989${pick(['0', '1', '3', '9'])}${String(randInt(1000000, 9999999))}`,
    contactId: contact?.id,
    text: pick(SMS_BODIES),
    status,
    deviceId: pick(devices).id,
    segments,
    createdAt: agoIso(ageMs),
    deliveredAt: status === 'delivered' ? agoIso(ageMs - randInt(4, 40) * 1000) : undefined,
    failReason: status === 'failed' ? pick(['no_signal', 'invalid_number', 'device_offline'] as const) : undefined,
  }
}).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

/* --------------------------------------------------------- notifications */

export const notifications: AppNotification[] = [
  {
    id: 'ntf_01',
    kind: 'device',
    severity: 'warn',
    title: { uz: 'Batareya kam', ru: 'Низкий заряд', en: 'Low battery' },
    body: {
      uz: '«Omborxona» qurilmasida batareya 21% qoldi. Zaryadga ulang.',
      ru: 'На устройстве «Omborxona» осталось 21% заряда. Подключите зарядку.',
      en: 'Device “Omborxona” is at 21% battery. Plug it in.',
    },
    createdAt: agoIso(18 * MINUTE),
    read: false,
  },
  {
    id: 'ntf_02',
    kind: 'device',
    severity: 'error',
    title: { uz: 'Qurilma aloqadan chiqdi', ru: 'Устройство не в сети', en: 'Device went offline' },
    body: {
      uz: '«Kuryer navbatchi» 3 soatdan beri aloqada emas. Navbatdagi SMSlar boshqa qurilmaga o‘tkazildi.',
      ru: '«Kuryer navbatchi» не в сети уже 3 часа. Очередь SMS переведена на другое устройство.',
      en: '“Kuryer navbatchi” has been offline for 3 hours. Queued SMS were rerouted to another device.',
    },
    createdAt: agoIso(3 * HOUR + 32 * MINUTE),
    read: false,
  },
  {
    id: 'ntf_03',
    kind: 'sms',
    severity: 'success',
    title: { uz: 'Ommaviy yuborish tugadi', ru: 'Рассылка завершена', en: 'Bulk send finished' },
    body: {
      uz: '«Chegirma aksiyasi» kampaniyasi: 156 tadan 152 tasi yetkazildi (97,4%).',
      ru: 'Кампания «Chegirma aksiyasi»: доставлено 152 из 156 (97,4%).',
      en: 'Campaign “Chegirma aksiyasi”: 152 of 156 delivered (97.4%).',
    },
    createdAt: agoIso(26 * HOUR),
    read: false,
  },
  {
    id: 'ntf_04',
    kind: 'billing',
    severity: 'info',
    title: { uz: 'Oylik limit 80%', ru: 'Лимит на 80%', en: 'Monthly limit at 80%' },
    body: {
      uz: 'Biznes tarifidagi 10 000 SMS limitining 80% ishlatildi. Limit 1-avgustda yangilanadi.',
      ru: 'Использовано 80% из 10 000 SMS тарифа «Biznes». Лимит обновится 1 августа.',
      en: 'You have used 80% of the 10,000 SMS on the Biznes plan. Resets on 1 August.',
    },
    createdAt: agoIso(2 * DAY + 4 * HOUR),
    read: true,
  },
  {
    id: 'ntf_05',
    kind: 'billing',
    severity: 'success',
    title: { uz: "To'lov qabul qilindi", ru: 'Платёж получен', en: 'Payment received' },
    body: {
      uz: "Iyul oyi uchun 149 000 so'm to'lov qabul qilindi. Hisob-faktura #INV-0107.",
      ru: 'Платёж 149 000 сум за июль получен. Счёт #INV-0107.',
      en: 'Payment of 149,000 UZS for July received. Invoice #INV-0107.',
    },
    createdAt: agoIso(15 * DAY),
    read: true,
  },
  {
    id: 'ntf_06',
    kind: 'system',
    severity: 'info',
    title: { uz: 'Yangi versiya', ru: 'Новая версия', en: 'New version' },
    body: {
      uz: 'Android ilovasining 2.4.1 versiyasi chiqdi: barqarorlik va tezlik yaxshilandi.',
      ru: 'Вышла версия 2.4.1 Android-приложения: улучшены стабильность и скорость.',
      en: 'Android app 2.4.1 is out: stability and speed improvements.',
    },
    createdAt: agoIso(6 * DAY),
    read: true,
  },
]

/* ----------------------------------------------------------- plans/billing */

export const plans: Plan[] = [
  { id: 'start', monthlyPrice: 0, smsPerMonth: 500, maxDevices: 1, apiAccess: false, prioritySupport: false },
  { id: 'biznes', monthlyPrice: 149_000, smsPerMonth: 10_000, maxDevices: 5, apiAccess: true, prioritySupport: false },
  { id: 'korxona', monthlyPrice: 490_000, smsPerMonth: 60_000, maxDevices: 20, apiAccess: true, prioritySupport: true },
]

export const invoices: Invoice[] = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(NOW - i * 30 * DAY)
  const monthNames = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr']
  return {
    id: `inv_${String(i + 1).padStart(2, '0')}`,
    number: `INV-0${107 - i}`,
    date: d.toISOString(),
    amount: 149_000,
    status: i === 0 ? 'due' : 'paid',
    planId: 'biznes' as const,
    period: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
  }
})

export const apiKeys: ApiKey[] = [
  {
    id: 'key_01',
    name: 'Production server',
    prefix: 'xab_live_7Kd2',
    createdAt: agoIso(120 * DAY),
    lastUsedAt: agoIso(4 * MINUTE),
    scopes: ['sms.send', 'sms.read', 'devices.read'],
  },
  {
    id: 'key_02',
    name: 'CRM integratsiya',
    prefix: 'xab_live_mQ9x',
    createdAt: agoIso(30 * DAY),
    lastUsedAt: agoIso(2 * HOUR),
    scopes: ['sms.send', 'contacts.read'],
  },
  {
    id: 'key_03',
    name: 'Test muhiti',
    prefix: 'xab_test_Rf4w',
    createdAt: agoIso(8 * DAY),
    scopes: ['sms.send', 'sms.read'],
  },
]

/* -------------------------------------------------------------- analytics */

export const dailyStats: DailyStat[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(NOW - (29 - i) * DAY)
  const weekday = d.getDay()
  const base = weekday === 0 ? 190 : weekday === 6 ? 260 : 420
  const sent = base + randInt(-60, 140)
  const failed = Math.round(sent * (0.015 + rand() * 0.03))
  const delivered = sent - failed - randInt(0, 8)
  return { date: d.toISOString().slice(0, 10), sent, delivered, failed }
})

/** Sends per hour of day (0-23), aggregated — powers the hour heat strip */
export const hourlyLoad: number[] = Array.from({ length: 24 }, (_, h) => {
  if (h < 7) return randInt(0, 12)
  if (h < 10) return randInt(40, 90)
  if (h < 13) return randInt(90, 160)
  if (h < 18) return randInt(70, 140)
  if (h < 21) return randInt(30, 80)
  return randInt(5, 25)
})
