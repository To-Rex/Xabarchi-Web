/**
 * Single source of truth for build-time SEO.
 *
 * Consumed by the `seoPrerender` Vite plugin (see vite.config.ts) to bake a
 * per-route static <head> — correct title/description/canonical/OG plus
 * JSON-LD structured data — into each marketing route's HTML, and to emit
 * robots.txt + sitemap.xml. This is what non-JS crawlers (Yandex, social
 * scrapers) and rich-result parsers read; the SPA still hydrates on top
 * unchanged.
 *
 * Kept plain (no browser APIs) so it imports cleanly into the Node build.
 */

export const SITE_URL = (process.env.VITE_SITE_URL || 'https://xabarchi.uz').replace(/\/$/, '')

const LANGS = ['uz', 'ru', 'en'] as const
const OG_IMAGE = `${SITE_URL}/og.svg`

/* ---------------------------------------------------------------- schema */

const organization = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Xabarchi',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  description: "O'z Android telefoningiz orqali SMS yuboradigan biznes platformasi.",
}

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Xabarchi',
  url: `${SITE_URL}/`,
  inLanguage: 'uz',
  publisher: { '@id': `${SITE_URL}/#organization` },
}

const softwareApp = {
  '@type': 'SoftwareApplication',
  name: 'Xabarchi',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android, Web',
  url: `${SITE_URL}/`,
  description:
    "O'z Android telefoningiz va SIM-kartangiz orqali SMS yuboring. Aggregatorlarsiz, arzon va ishonchli SMS platformasi.",
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'UZS' },
}

const pricingProduct = {
  '@type': 'Product',
  name: 'Xabarchi SMS platformasi',
  description: 'Xabarchi tariflari: Start bepul, Biznes va Korxona — biznesingiz o‘sishiga mos.',
  brand: { '@type': 'Brand', name: 'Xabarchi' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'UZS',
    lowPrice: '0',
    highPrice: '490000',
    offerCount: '3',
    offers: [
      { '@type': 'Offer', name: 'Start', price: '0', priceCurrency: 'UZS' },
      { '@type': 'Offer', name: 'Biznes', price: '149000', priceCurrency: 'UZS' },
      { '@type': 'Offer', name: 'Korxona', price: '490000', priceCurrency: 'UZS' },
    ],
  },
}

const faqEntries: [string, string][] = [
  ['Xabarchi qanday ishlaydi?', "Android telefoningizga Xabarchi ilovasini o'rnatasiz va QR kod orqali hisobingizga ulaysiz. Shundan so'ng boshqaruv paneli yoki API orqali yuborilgan har bir xabar ana shu telefon orqali, o'z SIM-kartangizdan jo'natiladi."],
  ['SMS uchun kimga to‘layman?', "SMS narxi mobil operatoringizning tarifiga bog'liq — to'lovni operatorga qilasiz. Ko'p biznes SMS-paketli korporativ tariflardan foydalanadi, shunda bitta SMS narxi juda arzon bo'ladi. Xabarchi faqat platforma obunasini oladi."],
  ['Qaysi telefonlar mos keladi?', "Android 8 va undan yuqori versiyali istalgan telefon. Eski, ishlatilmay yotgan telefon ham bo'laveradi — asosiysi u internetga ulangan va SIM-kartasi bo'lsa."],
  ['Bir kunda nechta SMS yuborsam bo‘ladi?', "Texnik jihatdan har bir qurilma uchun kunlik limit o'zingiz belgilaysiz. Amalda operatorlar bir SIM-kartadan kuniga 500–1000 SMS gacha ruxsat beradi. Katta hajmlar uchun bir nechta qurilma ulang — Xabarchi yuklamani avtomatik taqsimlaydi."],
  ['Telefon o‘chib qolsa nima bo‘ladi?', "Navbatdagi xabarlar yo'qolmaydi. Agar hisobingizda boshqa faol qurilma bo'lsa, navbat avtomatik unga o'tadi. Bo'lmasa, xabarlar telefon qayta ulanguncha navbatda kutadi va sizga darhol bildirishnoma yuboriladi."],
  ['API orqali qanday ulanaman?', "Boshqaruv panelida API kalit yaratasiz va REST API ga so'rov yuborasiz — oddiy POST /v1/messages. Webhooklar orqali yetkazilganlik statusini real vaqtda olasiz. Hujjatlarda curl, JavaScript va Python misollari bor."],
  ['Xabarlarim xavfsizmi?', "Panel va telefon orasidagi barcha trafik TLS bilan shifrlanadi. Xabar matnlari serverlarimizda saqlanmaydi — ular faqat sizning qurilmangiz orqali o'tadi. API kalitlarini istalgan payt bekor qilishingiz mumkin."],
  ['Bepul tarifda nima bor?', "Start tarifi doim bepul: oyiga 500 SMS, 1 ta qurilma, shablonlar va kontaktlar. Kredit karta talab qilinmaydi. O'sganingizda istalgan payt Biznes tarifiga o'tasiz."],
]

const faqPage = {
  '@type': 'FAQPage',
  mainEntity: faqEntries.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

function breadcrumb(name: string, path: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bosh sahifa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  }
}

/* ---------------------------------------------------------------- routes */

export interface SeoRoute {
  path: string
  title: string
  description: string
  /** JSON-LD nodes injected into this route's <head> (besides the global graph). */
  schema: object[]
  priority: number
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export const ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'Xabarchi — SMS platformasi',
    description:
      "O'z Android telefoningiz orqali SMS yuboring. Aggregatorlarsiz, o'z SIM-kartangiz bilan — biznes uchun qulay, arzon va ishonchli SMS platformasi.",
    schema: [organization, website, softwareApp],
    priority: 1.0,
    changefreq: 'daily',
  },
  {
    path: '/mobile',
    title: 'Mobil ilova qo‘llanmasi — Xabarchi',
    description:
      "Xabarchi Android ilovasini o'rnatish, QR kod orqali ulash va SMS yuborishni boshlash bo'yicha visual qo'llanma.",
    schema: [breadcrumb('Mobil ilova', '/mobile')],
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/pricing',
    title: 'Narxlar — Xabarchi',
    description: "Xabarchi tariflari: Start bepul, Biznes va Korxona — o'sishingizga mos. Yashirin to'lovlarsiz.",
    schema: [pricingProduct, breadcrumb('Narxlar', '/pricing')],
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/faq',
    title: 'Savol-javoblar — Xabarchi',
    description: 'Xabarchi haqida eng ko‘p beriladigan savollar va batafsil javoblar.',
    schema: [faqPage, breadcrumb('Savol-javoblar', '/faq')],
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/docs',
    title: 'API hujjatlari — Xabarchi',
    description: 'Xabarchi REST API: autentifikatsiya, SMS yuborish, rejali yuborish va shu yerda sinab ko‘rish.',
    schema: [
      { '@type': 'TechArticle', headline: 'Xabarchi API hujjatlari', description: 'Xabarchi REST API bo‘yicha to‘liq qo‘llanma.', inLanguage: 'uz' },
      breadcrumb('API hujjatlari', '/docs'),
    ],
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/contact',
    title: 'Aloqa — Xabarchi',
    description: "Xabarchi jamoasi bilan bog'laning: telefon, email, Telegram yoki forma orqali.",
    schema: [breadcrumb('Aloqa', '/contact')],
    priority: 0.5,
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    title: 'Foydalanish shartlari — Xabarchi',
    description: 'Xabarchi platformasidan foydalanish shartlari.',
    schema: [breadcrumb('Foydalanish shartlari', '/terms')],
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/privacy',
    title: 'Maxfiylik siyosati — Xabarchi',
    description: "Xabarchi qanday ma'lumotlarni yig'adi va ularni qanday himoya qiladi.",
    schema: [breadcrumb('Maxfiylik siyosati', '/privacy')],
    priority: 0.3,
    changefreq: 'yearly',
  },
]

/* --------------------------------------------------------- emitted files */

export function buildRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /$',
    'Allow: /',
    'Disallow: /app',
    'Disallow: /admin',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /forgot-password',
    'Disallow: /reset-password',
    'Disallow: /verify-email',
    'Disallow: /auth',
    'Disallow: /demo',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL}`,
    '',
  ].join('\n')
}

export function buildSitemapXml(lastmod: string): string {
  const urls = ROUTES.map((r) => {
    const loc = `${SITE_URL}${r.path === '/' ? '/' : r.path}`
    const alternates = LANGS.map((l) => {
      const href = l === 'uz' ? loc : `${loc}${loc.includes('?') ? '&' : '?'}lang=${l}`
      return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
    })
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`)
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${r.changefreq}</changefreq>`,
      `    <priority>${r.priority.toFixed(1)}</priority>`,
      ...alternates,
      '  </url>',
    ].join('\n')
  }).join('\n')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n')
}

/** The alternate hreflang <link> tags baked into each route's <head>. */
export function hreflangLinks(path: string): string {
  const loc = `${SITE_URL}${path === '/' ? '/' : path}`
  const tags = LANGS.map((l) => {
    const href = l === 'uz' ? loc : `${loc}?lang=${l}`
    return `    <link rel="alternate" hreflang="${l}" href="${href}" />`
  })
  tags.push(`    <link rel="alternate" hreflang="x-default" href="${loc}" />`)
  return tags.join('\n')
}

export { OG_IMAGE }
