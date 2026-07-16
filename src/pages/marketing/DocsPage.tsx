import { useState, type ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { cn } from '@/shared/lib/cn'
import { Badge, CodeBlock, Reveal, SegmentedControl } from '@/shared/ui'

const dict = {
  uz: {
    meta: { title: 'API hujjatlari — Xabarchi', desc: 'Xabarchi REST API: autentifikatsiya, SMS yuborish, statuslar, webhooklar.' },
    title: 'API hujjatlari',
    subtitle: "Xabarchi REST API bilan istalgan tizimdan SMS yuboring. Bazaviy manzil: ",
    nav: { intro: 'Kirish', auth: 'Autentifikatsiya', send: 'SMS yuborish', list: 'Xabarlar ro‘yxati', status: 'Xabar holati', devices: 'Qurilmalar', webhooks: 'Webhooklar', errors: 'Xatoliklar' },
    intro: {
      body: "Barcha so'rovlar JSON qabul qiladi va JSON qaytaradi. API kalitini boshqaruv panelining «API» bo'limida yaratasiz. Sinov uchun xab_test_ prefiksli kalitdan foydalaning — xabarlar yuborilmaydi, lekin barcha javoblar haqiqiydek qaytadi.",
    },
    auth: {
      body: "Har bir so'rovga Authorization sarlavhasida Bearer token qo'shing. Kalitlar ikki xil: xab_live_ (haqiqiy yuborish) va xab_test_ (sinov rejimi).",
    },
    send: { body: 'Bitta SMS yuborish. Matn 160 belgidan (kirillcha 70) oshsa, avtomatik segmentlarga bo‘linadi.' },
    list: { body: "Xabarlar ro'yxati — sahifalash va status bo'yicha filtr bilan." },
    status: { body: 'Bitta xabarning joriy holatini olish. Holatlar: queued → sending → sent → delivered yoki failed.' },
    devices: { body: "Ulangan qurilmalar ro'yxati: holat, batareya, signal va kunlik limit." },
    webhooks: { body: "Xabar holati o'zgarganda sizning URL manzilingizga POST so'rov yuboramiz. Har bir so'rov X-Xabarchi-Signature sarlavhasi bilan imzolanadi." },
    errors: { body: 'API standart HTTP kodlarini ishlatadi. Xato tanasida code va message maydonlari bo‘ladi.' },
    errorRows: [
      ['400', 'invalid_request — parametr yetishmayapti yoki noto‘g‘ri'],
      ['401', 'unauthorized — API kalit noto‘g‘ri yoki bekor qilingan'],
      ['402', 'quota_exceeded — oylik SMS limiti tugagan'],
      ['429', 'rate_limited — so‘rovlar tezligi oshib ketdi'],
      ['503', 'no_device — faol qurilma topilmadi'],
    ],
  },
  ru: {
    meta: { title: 'API документация — Xabarchi', desc: 'Xabarchi REST API: аутентификация, отправка SMS, статусы, вебхуки.' },
    title: 'API документация',
    subtitle: 'Отправляйте SMS из любой системы через Xabarchi REST API. Базовый адрес: ',
    nav: { intro: 'Введение', auth: 'Аутентификация', send: 'Отправка SMS', list: 'Список сообщений', status: 'Статус сообщения', devices: 'Устройства', webhooks: 'Вебхуки', errors: 'Ошибки' },
    intro: {
      body: 'Все запросы принимают и возвращают JSON. API-ключ создаётся в разделе «API» панели управления. Для тестов используйте ключ с префиксом xab_test_ — сообщения не отправляются, но ответы выглядят как настоящие.',
    },
    auth: { body: 'Добавляйте Bearer-токен в заголовок Authorization каждого запроса. Ключи бывают двух видов: xab_live_ (реальная отправка) и xab_test_ (тестовый режим).' },
    send: { body: 'Отправка одного SMS. Если текст длиннее 160 символов (70 для кириллицы), он автоматически делится на сегменты.' },
    list: { body: 'Список сообщений — с пагинацией и фильтром по статусу.' },
    status: { body: 'Текущий статус одного сообщения. Статусы: queued → sending → sent → delivered или failed.' },
    devices: { body: 'Список подключённых устройств: статус, батарея, сигнал и дневной лимит.' },
    webhooks: { body: 'При смене статуса сообщения мы отправляем POST на ваш URL. Каждый запрос подписан заголовком X-Xabarchi-Signature.' },
    errors: { body: 'API использует стандартные HTTP-коды. В теле ошибки — поля code и message.' },
    errorRows: [
      ['400', 'invalid_request — параметр отсутствует или неверен'],
      ['401', 'unauthorized — ключ неверен или отозван'],
      ['402', 'quota_exceeded — месячный лимит SMS исчерпан'],
      ['429', 'rate_limited — превышена частота запросов'],
      ['503', 'no_device — нет активного устройства'],
    ],
  },
  en: {
    meta: { title: 'API docs — Xabarchi', desc: 'Xabarchi REST API: authentication, sending SMS, statuses, webhooks.' },
    title: 'API documentation',
    subtitle: 'Send SMS from any system with the Xabarchi REST API. Base URL: ',
    nav: { intro: 'Introduction', auth: 'Authentication', send: 'Send an SMS', list: 'List messages', status: 'Message status', devices: 'Devices', webhooks: 'Webhooks', errors: 'Errors' },
    intro: {
      body: 'All endpoints accept and return JSON. Create an API key in the dashboard’s “API” section. For testing use a key with the xab_test_ prefix — nothing is sent, but responses look real.',
    },
    auth: { body: 'Pass a Bearer token in the Authorization header of every request. Keys come in two flavors: xab_live_ (real sending) and xab_test_ (test mode).' },
    send: { body: 'Send a single SMS. Texts longer than 160 characters (70 for Cyrillic) are split into segments automatically.' },
    list: { body: 'List messages — with pagination and a status filter.' },
    status: { body: 'Get the current state of one message. States: queued → sending → sent → delivered or failed.' },
    devices: { body: 'List connected devices: status, battery, signal and daily limit.' },
    webhooks: { body: 'When a message changes state we POST to your URL. Every request is signed with the X-Xabarchi-Signature header.' },
    errors: { body: 'The API uses standard HTTP codes. Error bodies carry code and message fields.' },
    errorRows: [
      ['400', 'invalid_request — a parameter is missing or malformed'],
      ['401', 'unauthorized — the key is wrong or revoked'],
      ['402', 'quota_exceeded — the monthly SMS quota is used up'],
      ['429', 'rate_limited — too many requests'],
      ['503', 'no_device — no active device available'],
    ],
  },
}

type CodeLang = 'curl' | 'js' | 'python'

const SEND_SNIPPETS: Record<CodeLang, { title: string; code: string }> = {
  curl: {
    title: 'curl',
    code: `curl https://api.xabarchi.uz/v1/messages \\
  -H "Authorization: Bearer xab_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+998901234567",
    "text": "Tasdiqlash kodingiz: 48213",
    "device_id": "dev_01"
  }'`,
  },
  js: {
    title: 'JavaScript',
    code: `const res = await fetch('https://api.xabarchi.uz/v1/messages', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer xab_live_...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+998901234567',
    text: 'Tasdiqlash kodingiz: 48213',
  }),
})
const message = await res.json()
// { id: 'sms_0421', status: 'queued', segments: 1 }`,
  },
  python: {
    title: 'Python',
    code: `import requests

res = requests.post(
    "https://api.xabarchi.uz/v1/messages",
    headers={"Authorization": "Bearer xab_live_..."},
    json={
        "to": "+998901234567",
        "text": "Tasdiqlash kodingiz: 48213",
    },
)
print(res.json())
# {'id': 'sms_0421', 'status': 'queued', 'segments': 1}`,
  },
}

function Endpoint({ method, path }: { method: 'GET' | 'POST'; path: string }) {
  return (
    <p className="flex flex-wrap items-center gap-2.5">
      <Badge tone={method === 'GET' ? 'info' : 'brand'} className="font-mono">{method}</Badge>
      <code className="font-mono text-[13px] text-ink">{path}</code>
    </p>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section id={id} className="scroll-mt-24 border-b border-line py-10 first:pt-0 last:border-none">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h2>
        <div className="mt-4 space-y-4">{children}</div>
      </section>
    </Reveal>
  )
}

export default function DocsPage() {
  const t = useT(dict)
  usePageMeta(t.meta.title, t.meta.desc)
  const [codeLang, setCodeLang] = useState<CodeLang>('curl')
  const [active, setActive] = useState('intro')

  const navItems = Object.entries(t.nav) as [string, string][]

  return (
    <div className="mx-auto flex max-w-6xl gap-12 px-5 py-14">
      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 lg:block">
        <nav className="space-y-1" aria-label="API">
          {navItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
              className={cn(
                'block rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                active === id ? 'bg-brand-soft text-brand-2 dark:text-brand' : 'text-ink-2 hover:bg-sunken hover:text-ink',
              )}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <Reveal>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{t.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            {t.subtitle}
            <code className="rounded-md bg-sunken px-1.5 py-0.5 font-mono text-[13px] text-brand-2 dark:text-brand">https://api.xabarchi.uz/v1</code>
          </p>
        </Reveal>

        <div className="mt-8">
          <Section id="intro" title={t.nav.intro}>
            <p className="text-sm leading-relaxed text-ink-2">{t.intro.body}</p>
          </Section>

          <Section id="auth" title={t.nav.auth}>
            <p className="text-sm leading-relaxed text-ink-2">{t.auth.body}</p>
            <CodeBlock title="Authorization" code={`Authorization: Bearer xab_live_7Kd2mQ9xRf4w...`} />
          </Section>

          <Section id="send" title={t.nav.send}>
            <Endpoint method="POST" path="/v1/messages" />
            <p className="text-sm leading-relaxed text-ink-2">{t.send.body}</p>
            <SegmentedControl
              size="sm"
              value={codeLang}
              onChange={(value) => setCodeLang(value)}
              segments={[
                { value: 'curl', label: 'curl' },
                { value: 'js', label: 'JavaScript' },
                { value: 'python', label: 'Python' },
              ]}
            />
            <CodeBlock title={SEND_SNIPPETS[codeLang].title} code={SEND_SNIPPETS[codeLang].code} />
          </Section>

          <Section id="list" title={t.nav.list}>
            <Endpoint method="GET" path="/v1/messages?status=delivered&limit=20" />
            <p className="text-sm leading-relaxed text-ink-2">{t.list.body}</p>
            <CodeBlock
              title="200 OK"
              code={`{
  "data": [
    {
      "id": "sms_0421",
      "to": "+998901234567",
      "status": "delivered",
      "device_id": "dev_01",
      "segments": 1,
      "created_at": "2026-07-16T09:41:03Z",
      "delivered_at": "2026-07-16T09:41:09Z"
    }
  ],
  "has_more": true,
  "next_cursor": "c_9f2k"
}`}
            />
          </Section>

          <Section id="status" title={t.nav.status}>
            <Endpoint method="GET" path="/v1/messages/{id}" />
            <p className="text-sm leading-relaxed text-ink-2">{t.status.body}</p>
          </Section>

          <Section id="devices" title={t.nav.devices}>
            <Endpoint method="GET" path="/v1/devices" />
            <p className="text-sm leading-relaxed text-ink-2">{t.devices.body}</p>
            <CodeBlock
              title="200 OK"
              code={`{
  "data": [
    {
      "id": "dev_01",
      "name": "Asosiy ofis",
      "status": "online",
      "battery": 84,
      "signal": 4,
      "sent_today": 412,
      "daily_limit": 800
    }
  ]
}`}
            />
          </Section>

          <Section id="webhooks" title={t.nav.webhooks}>
            <p className="text-sm leading-relaxed text-ink-2">{t.webhooks.body}</p>
            <CodeBlock
              title="POST https://example.uz/webhooks/xabarchi"
              code={`{
  "event": "message.delivered",
  "data": {
    "id": "sms_0421",
    "to": "+998901234567",
    "delivered_at": "2026-07-16T09:41:09Z"
  }
}`}
            />
          </Section>

          <Section id="errors" title={t.nav.errors}>
            <p className="text-sm leading-relaxed text-ink-2">{t.errors.body}</p>
            <div className="overflow-hidden rounded-xl border border-line">
              {t.errorRows.map(([code, description], index) => (
                <div key={code} className={cn('flex items-start gap-4 px-4 py-3 text-sm', index % 2 === 1 && 'bg-sunken/50')}>
                  <code className="tnum shrink-0 font-mono font-semibold text-danger">{code}</code>
                  <span className="font-mono text-[13px] text-ink-2">{description}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
