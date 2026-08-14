import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Play, TerminalSquare } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { cn } from '@/shared/lib/cn'
import { API_BASE } from '@/shared/api/client'
import { Badge, Button, CodeBlock, Input, Reveal, SegmentedControl, Textarea } from '@/shared/ui'

/* ------------------------------------------------------------------ i18n */

const dict = {
  uz: {
    meta: { title: 'API hujjatlari — Xabarchi', desc: 'Xabarchi REST API: autentifikatsiya, SMS yuborish va shu yerda sinab ko‘rish.' },
    title: 'API hujjatlari',
    subtitle: 'Xabarchi REST API bilan istalgan tizimdan SMS yuboring. Bazaviy manzil: ',
    nav: { intro: 'Kirish', auth: 'Autentifikatsiya', send: 'SMS yuborish', playground: 'Sinab ko‘rish', message: 'Xabar obyekti', errors: 'Xatoliklar', limits: 'Limitlar' },
    intro: 'Barcha so‘rovlar JSON qabul qiladi va JSON qaytaradi. Maydonlar camelCase’da. API kalitini boshqaruv panelining «API» bo‘limida yaratasiz — kalit faqat bir marta ko‘rsatiladi, uni xavfsiz saqlang.',
    getKey: 'API kalit olish',
    auth: 'Har bir so‘rovga X-API-Key sarlavhasida kalitni qo‘shing. Kalit xab_live_ bilan boshlanadi va sms.send ruxsatiga ega bo‘lishi kerak.',
    send: 'Bitta so‘rovda bir yoki bir nechta raqamga SMS yuboring. to — raqamlar massivi. Matn 160 belgidan (kirillcha 70) oshsa, avtomatik segmentlarga bo‘linadi va har biri alohida hisoblanadi.',
    reqTitle: 'So‘rov tanasi',
    fields: [
      ['to', 'string[]', 'Qabul qiluvchi raqam(lar), xalqaro formatda. 1–500 ta.'],
      ['text', 'string', 'Xabar matni. 1–1000 belgi.'],
      ['priority', 'string', 'urgent · transactional · bulk (ixtiyoriy, default: transactional).'],
      ['deviceId', 'uuid?', 'Muayyan qurilmadan yuborish (ixtiyoriy).'],
    ],
    play: {
      title: 'Shu yerda sinab ko‘ring',
      body: 'API kalitingizni kiriting va haqiqiy so‘rov yuboring — javobni shu yerda ko‘rasiz. ⚠️ Bu HAQIQIY SMS yuboradi (limit va faol qurilma talab qilinadi).',
      key: 'API kaliti (X-API-Key)',
      to: 'Qabul qiluvchi(lar) — vergul bilan',
      text: 'Xabar matni',
      priority: 'Muhimlik',
      prio: { urgent: 'Shoshilinch', transactional: 'Tranzaksion', bulk: 'Ommaviy' },
      send: 'So‘rov yuborish',
      sending: 'Yuborilmoqda…',
      result: 'Javob',
      needKey: 'Avval API kalitini kiriting',
    },
    message: 'Muvaffaqiyatli so‘rov 201 va yaratilgan xabarlar massivini qaytaradi. Har bir xabar obyekti quyidagi maydonlarga ega:',
    msgFields: [
      ['id', 'number', 'Xabar identifikatori.'],
      ['to', 'string', 'Qabul qiluvchi raqam.'],
      ['text', 'string', 'Yuborilgan matn.'],
      ['status', 'string', 'queued → sending → sent → delivered yoki failed.'],
      ['priority', 'string', 'urgent · transactional · bulk.'],
      ['segments', 'number', 'SMS segmentlari soni.'],
      ['createdAt', 'datetime', 'Yaratilgan vaqti (ISO 8601).'],
      ['deliveredAt', 'datetime?', 'Yetkazilgan vaqti (agar delivered bo‘lsa).'],
      ['failReason', 'string?', 'Xatolik sababi (agar failed bo‘lsa): no_sim, no_balance, ...'],
    ],
    errors: 'API standart HTTP kodlarini ishlatadi. Xato tanasida code va message maydonlari bo‘ladi.',
    errorRows: [
      ['401', 'auth_error — API kalit noto‘g‘ri, yo‘q yoki bekor qilingan'],
      ['403', 'forbidden — kalitda sms.send ruxsati yo‘q'],
      ['402', 'quota_exceeded — oylik SMS limiti tugagan'],
      ['422', 'invalid_phone — raqam noto‘g‘ri formatda'],
      ['429', 'rate_limited — daqiqada 30 dan ortiq so‘rov'],
    ],
    limits: 'Yuborish tezligi: har bir hisob uchun daqiqada 30 ta so‘rov. Oylik SMS limiti tarifingizga bog‘liq (bepul: 500/oy). Segmentlarга bo‘lingan uzun xabarlar har biri alohida hisoblanadi.',
  },
  ru: {
    meta: { title: 'API документация — Xabarchi', desc: 'Xabarchi REST API: аутентификация, отправка SMS и проверка прямо здесь.' },
    title: 'API документация',
    subtitle: 'Отправляйте SMS из любой системы через Xabarchi REST API. Базовый адрес: ',
    nav: { intro: 'Введение', auth: 'Аутентификация', send: 'Отправка SMS', playground: 'Проверить', message: 'Объект сообщения', errors: 'Ошибки', limits: 'Лимиты' },
    intro: 'Все запросы принимают и возвращают JSON. Поля — в camelCase. API-ключ создаётся в разделе «API» панели управления — он показывается один раз, храните его надёжно.',
    getKey: 'Получить API-ключ',
    auth: 'Добавляйте ключ в заголовок X-API-Key каждого запроса. Ключ начинается с xab_live_ и должен иметь право sms.send.',
    send: 'Отправьте SMS на один или несколько номеров за один запрос. to — массив номеров. Текст длиннее 160 символов (70 для кириллицы) автоматически делится на сегменты, каждый считается отдельно.',
    reqTitle: 'Тело запроса',
    fields: [
      ['to', 'string[]', 'Номер(а) получателей в международном формате. 1–500 шт.'],
      ['text', 'string', 'Текст сообщения. 1–1000 символов.'],
      ['priority', 'string', 'urgent · transactional · bulk (необязательно, по умолчанию: transactional).'],
      ['deviceId', 'uuid?', 'Отправка с конкретного устройства (необязательно).'],
    ],
    play: {
      title: 'Проверьте прямо здесь',
      body: 'Введите свой API-ключ и отправьте реальный запрос — ответ появится ниже. ⚠️ Отправляется НАСТОЯЩЕЕ SMS (нужны лимит и активное устройство).',
      key: 'API-ключ (X-API-Key)',
      to: 'Получатель(и) — через запятую',
      text: 'Текст сообщения',
      priority: 'Приоритет',
      prio: { urgent: 'Срочное', transactional: 'Транзакционное', bulk: 'Массовое' },
      send: 'Отправить запрос',
      sending: 'Отправка…',
      result: 'Ответ',
      needKey: 'Сначала введите API-ключ',
    },
    message: 'Успешный запрос возвращает 201 и массив созданных сообщений. Каждый объект сообщения содержит поля:',
    msgFields: [
      ['id', 'number', 'Идентификатор сообщения.'],
      ['to', 'string', 'Номер получателя.'],
      ['text', 'string', 'Отправленный текст.'],
      ['status', 'string', 'queued → sending → sent → delivered или failed.'],
      ['priority', 'string', 'urgent · transactional · bulk.'],
      ['segments', 'number', 'Количество SMS-сегментов.'],
      ['createdAt', 'datetime', 'Время создания (ISO 8601).'],
      ['deliveredAt', 'datetime?', 'Время доставки (если delivered).'],
      ['failReason', 'string?', 'Причина ошибки (если failed): no_sim, no_balance, ...'],
    ],
    errors: 'API использует стандартные HTTP-коды. В теле ошибки — поля code и message.',
    errorRows: [
      ['401', 'auth_error — ключ неверен, отсутствует или отозван'],
      ['403', 'forbidden — у ключа нет права sms.send'],
      ['402', 'quota_exceeded — месячный лимит SMS исчерпан'],
      ['422', 'invalid_phone — неверный формат номера'],
      ['429', 'rate_limited — более 30 запросов в минуту'],
    ],
    limits: 'Скорость отправки: 30 запросов в минуту на аккаунт. Месячный лимит SMS зависит от тарифа (бесплатно: 500/мес). Длинные сообщения, разбитые на сегменты, считаются по каждому сегменту.',
  },
  en: {
    meta: { title: 'API docs — Xabarchi', desc: 'Xabarchi REST API: authentication, sending SMS, and try it right here.' },
    title: 'API documentation',
    subtitle: 'Send SMS from any system with the Xabarchi REST API. Base URL: ',
    nav: { intro: 'Introduction', auth: 'Authentication', send: 'Send an SMS', playground: 'Try it', message: 'Message object', errors: 'Errors', limits: 'Limits' },
    intro: 'All endpoints accept and return JSON. Fields are camelCase. Create an API key in the dashboard’s “API” section — it is shown only once, so store it safely.',
    getKey: 'Get an API key',
    auth: 'Pass your key in the X-API-Key header of every request. Keys start with xab_live_ and must carry the sms.send scope.',
    send: 'Send an SMS to one or more numbers in a single request. to is an array of numbers. Text longer than 160 characters (70 for Cyrillic) is split into segments automatically, each billed separately.',
    reqTitle: 'Request body',
    fields: [
      ['to', 'string[]', 'Recipient number(s) in international format. 1–500.'],
      ['text', 'string', 'Message text. 1–1000 characters.'],
      ['priority', 'string', 'urgent · transactional · bulk (optional, default: transactional).'],
      ['deviceId', 'uuid?', 'Send from a specific device (optional).'],
    ],
    play: {
      title: 'Try it right here',
      body: 'Enter your API key and fire a real request — the response shows below. ⚠️ This sends a REAL SMS (needs quota and an active device).',
      key: 'API key (X-API-Key)',
      to: 'Recipient(s) — comma separated',
      text: 'Message text',
      priority: 'Priority',
      prio: { urgent: 'Urgent', transactional: 'Transactional', bulk: 'Bulk' },
      send: 'Send request',
      sending: 'Sending…',
      result: 'Response',
      needKey: 'Enter your API key first',
    },
    message: 'A successful request returns 201 and an array of created messages. Each message object has these fields:',
    msgFields: [
      ['id', 'number', 'Message id.'],
      ['to', 'string', 'Recipient number.'],
      ['text', 'string', 'The text that was sent.'],
      ['status', 'string', 'queued → sending → sent → delivered or failed.'],
      ['priority', 'string', 'urgent · transactional · bulk.'],
      ['segments', 'number', 'Number of SMS segments.'],
      ['createdAt', 'datetime', 'Creation time (ISO 8601).'],
      ['deliveredAt', 'datetime?', 'Delivery time (if delivered).'],
      ['failReason', 'string?', 'Failure reason (if failed): no_sim, no_balance, ...'],
    ],
    errors: 'The API uses standard HTTP codes. Error bodies carry code and message fields.',
    errorRows: [
      ['401', 'auth_error — the key is wrong, missing or revoked'],
      ['403', 'forbidden — the key lacks the sms.send scope'],
      ['402', 'quota_exceeded — the monthly SMS quota is used up'],
      ['422', 'invalid_phone — malformed number'],
      ['429', 'rate_limited — more than 30 requests per minute'],
    ],
    limits: 'Send rate: 30 requests per minute per account. The monthly SMS quota depends on your plan (free: 500/mo). Long messages split into segments are billed per segment.',
  },
}

type CodeLang = 'curl' | 'js' | 'python' | 'dart' | 'kotlin' | 'java' | 'php' | 'go' | 'csharp' | 'onec'

const LANGS: { id: CodeLang; label: string }[] = [
  { id: 'curl', label: 'curl' },
  { id: 'js', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'dart', label: 'Flutter' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'java', label: 'Java' },
  { id: 'php', label: 'PHP' },
  { id: 'go', label: 'Go' },
  { id: 'csharp', label: 'C#' },
  { id: 'onec', label: '1C' },
]

function sendSnippets(base: string): Record<CodeLang, { title: string; code: string }> {
  let host = base
  let path = '/api/v1/public/messages'
  try {
    const u = new URL(base)
    host = u.host
    path = `${u.pathname}/public/messages`
  } catch {
    /* keep fallbacks */
  }
  return {
    curl: {
      title: 'curl',
      code: `curl ${base}/public/messages \\
  -H "X-API-Key: xab_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": ["+998901234567"],
    "text": "Tasdiqlash kodingiz: 48213",
    "priority": "urgent"
  }'`,
    },
    js: {
      title: 'JavaScript',
      code: `const res = await fetch('${base}/public/messages', {
  method: 'POST',
  headers: {
    'X-API-Key': 'xab_live_...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: ['+998901234567'],
    text: 'Tasdiqlash kodingiz: 48213',
    priority: 'urgent',
  }),
})
const messages = await res.json()
// [{ id: 421, status: 'queued', segments: 1, ... }]`,
    },
    python: {
      title: 'Python',
      code: `import requests

res = requests.post(
    "${base}/public/messages",
    headers={"X-API-Key": "xab_live_..."},
    json={
        "to": ["+998901234567"],
        "text": "Tasdiqlash kodingiz: 48213",
        "priority": "urgent",
    },
)
print(res.json())`,
    },
    dart: {
      title: 'Flutter (Dart)',
      code: `import 'dart:convert';
import 'package:http/http.dart' as http;

final res = await http.post(
  Uri.parse('${base}/public/messages'),
  headers: {
    'X-API-Key': 'xab_live_...',
    'Content-Type': 'application/json',
  },
  body: jsonEncode({
    'to': ['+998901234567'],
    'text': 'Tasdiqlash kodingiz: 48213',
    'priority': 'urgent',
  }),
);
print(res.body);`,
    },
    kotlin: {
      title: 'Kotlin (OkHttp)',
      code: `val client = OkHttpClient()
val json = """{"to":["+998901234567"],"text":"Tasdiqlash kodingiz: 48213","priority":"urgent"}"""
val body = json.toRequestBody("application/json".toMediaType())

val request = Request.Builder()
    .url("${base}/public/messages")
    .addHeader("X-API-Key", "xab_live_...")
    .post(body)
    .build()

client.newCall(request).execute().use { println(it.body?.string()) }`,
    },
    java: {
      title: 'Java (11+)',
      code: `var json = "{\\"to\\":[\\"+998901234567\\"],\\"text\\":\\"Tasdiqlash kodingiz: 48213\\",\\"priority\\":\\"urgent\\"}";
var request = HttpRequest.newBuilder()
    .uri(URI.create("${base}/public/messages"))
    .header("X-API-Key", "xab_live_...")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(json))
    .build();
var res = HttpClient.newHttpClient()
    .send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(res.body());`,
    },
    php: {
      title: 'PHP',
      code: `$ch = curl_init('${base}/public/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'X-API-Key: xab_live_...',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'to' => ['+998901234567'],
        'text' => 'Tasdiqlash kodingiz: 48213',
        'priority' => 'urgent',
    ]),
]);
echo curl_exec($ch);`,
    },
    go: {
      title: 'Go',
      code: `body := []byte("{\\"to\\":[\\"+998901234567\\"],\\"text\\":\\"Tasdiqlash kodingiz: 48213\\",\\"priority\\":\\"urgent\\"}")
req, _ := http.NewRequest("POST", "${base}/public/messages", bytes.NewBuffer(body))
req.Header.Set("X-API-Key", "xab_live_...")
req.Header.Set("Content-Type", "application/json")
res, _ := http.DefaultClient.Do(req)
defer res.Body.Close()`,
    },
    csharp: {
      title: 'C#',
      code: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "xab_live_...");
var json = "{\\"to\\":[\\"+998901234567\\"],\\"text\\":\\"Tasdiqlash kodingiz: 48213\\",\\"priority\\":\\"urgent\\"}";
var content = new StringContent(json, Encoding.UTF8, "application/json");
var res = await client.PostAsync("${base}/public/messages", content);
Console.WriteLine(await res.Content.ReadAsStringAsync());`,
    },
    onec: {
      title: '1C:Enterprise',
      code: `Соединение = Новый HTTPСоединение("${host}", 443, , , , , Новый ЗащищенноеСоединениеOpenSSL);
Запрос = Новый HTTPЗапрос("${path}");
Запрос.Заголовки.Вставить("X-API-Key", "xab_live_...");
Запрос.Заголовки.Вставить("Content-Type", "application/json");
Запрос.УстановитьТелоИзСтроки("{""to"":[""+998901234567""],""text"":""Kod: 48213"",""priority"":""urgent""}");
Ответ = Соединение.ОтправитьДляОбработки(Запрос);
Сообщить(Ответ.ПолучитьТелоКакСтроку());`,
    },
  }
}

/* --------------------------------------------------------------- helpers */

function Endpoint({ method, path }: { method: 'GET' | 'POST'; path: string }) {
  return (
    <p className="flex flex-wrap items-center gap-2.5">
      <Badge tone={method === 'GET' ? 'info' : 'brand'} className="font-mono">{method}</Badge>
      <code className="font-mono text-[13px] text-ink">{path}</code>
    </p>
  )
}

function FieldTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      {rows.map(([name, type, desc], index) => (
        <div key={name} className={cn('flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4', index % 2 === 1 && 'bg-sunken/50')}>
          <code className="w-40 shrink-0 font-mono text-[13px] font-semibold text-brand-2 dark:text-brand">{name}</code>
          <span className="w-20 shrink-0 font-mono text-[12px] text-ink-3">{type}</span>
          <span className="text-[13px] leading-relaxed text-ink-2">{desc}</span>
        </div>
      ))}
    </div>
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

/* ------------------------------------------------------- try-it playground */

type Priority = 'urgent' | 'transactional' | 'bulk'

function Playground() {
  const t = useT(dict)
  const [apiKey, setApiKey] = useState('')
  const [to, setTo] = useState('+998901234567')
  const [text, setText] = useState('Xabarchi API test ✅')
  const [priority, setPriority] = useState<Priority>('transactional')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ status: number; ok: boolean; body: string } | null>(null)
  const [error, setError] = useState<string>()

  const run = async () => {
    if (!apiKey.trim()) {
      setError(t.play.needKey)
      return
    }
    setError(undefined)
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/public/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey.trim() },
        body: JSON.stringify({
          to: to.split(',').map((s) => s.trim()).filter(Boolean),
          text,
          priority,
        }),
      })
      const raw = await res.text()
      let pretty = raw
      try {
        pretty = JSON.stringify(JSON.parse(raw), null, 2)
      } catch {
        /* keep raw */
      }
      setResult({ status: res.status, ok: res.ok, body: pretty })
    } catch (err) {
      setResult({ status: 0, ok: false, body: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="grid gap-4">
        <Input
          type="password"
          label={t.play.key}
          placeholder="xab_live_..."
          value={apiKey}
          onChange={(e) => { setApiKey(e.target.value); setError(undefined) }}
          error={error}
          leading={<TerminalSquare className="size-4" />}
          className="font-mono text-[13px]"
        />
        <Input
          label={t.play.to}
          placeholder="+998901234567, +998935557713"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="font-mono text-[13px]"
        />
        <Textarea label={t.play.text} value={text} onChange={(e) => setText(e.target.value)} rows={3} />
        <div>
          <p className="mb-1.5 text-[13px] font-medium text-ink-2">{t.play.priority}</p>
          <SegmentedControl
            size="sm"
            value={priority}
            onChange={setPriority}
            segments={[
              { value: 'urgent', label: t.play.prio.urgent },
              { value: 'transactional', label: t.play.prio.transactional },
              { value: 'bulk', label: t.play.prio.bulk },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button loading={loading} onClick={run}>
            <Play className="size-4" />
            {loading ? t.play.sending : t.play.send}
          </Button>
          <code className="tnum truncate font-mono text-[11px] text-ink-3">POST {API_BASE}/public/messages</code>
        </div>
      </div>

      {result && (
        <div className="mt-5">
          <p className="mb-2 flex items-center gap-2 text-[13px] font-medium text-ink-2">
            {t.play.result}
            <Badge tone={result.ok ? 'ok' : 'danger'} className="tnum font-mono">{result.status || 'ERR'}</Badge>
          </p>
          <CodeBlock title="JSON" code={result.body} />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function DocsPage() {
  const t = useT(dict)
  usePageMeta(t.meta.title, t.meta.desc)
  const [codeLang, setCodeLang] = useState<CodeLang>('curl')
  const [active, setActive] = useState('intro')

  const navItems = Object.entries(t.nav) as [string, string][]
  const snippets = sendSnippets(API_BASE)

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
            <code className="break-all rounded-md bg-sunken px-1.5 py-0.5 font-mono text-[13px] text-brand-2 dark:text-brand">{API_BASE}</code>
          </p>
        </Reveal>

        <div className="mt-8">
          <Section id="intro" title={t.nav.intro}>
            <p className="text-sm leading-relaxed text-ink-2">{t.intro}</p>
            <Link to="/app/api" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-2">
              {t.getKey} →
            </Link>
          </Section>

          <Section id="auth" title={t.nav.auth}>
            <p className="text-sm leading-relaxed text-ink-2">{t.auth}</p>
            <CodeBlock title="Header" code={`X-API-Key: xab_live_7Kd2mQ9xRf4w...`} />
          </Section>

          <Section id="send" title={t.nav.send}>
            <Endpoint method="POST" path="/public/messages" />
            <p className="text-sm leading-relaxed text-ink-2">{t.send}</p>
            <p className="pt-1 text-[13px] font-semibold text-ink">{t.reqTitle}</p>
            <FieldTable rows={t.fields} />
            <div className="flex flex-wrap gap-1.5">
              {LANGS.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setCodeLang(lang.id)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                    codeLang === lang.id ? 'bg-brand text-brand-ink' : 'bg-sunken text-ink-2 hover:text-ink',
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <CodeBlock title={snippets[codeLang].title} code={snippets[codeLang].code} />
          </Section>

          <Section id="playground" title={t.nav.playground}>
            <p className="text-sm leading-relaxed text-ink-2">{t.play.body}</p>
            <Playground />
          </Section>

          <Section id="message" title={t.nav.message}>
            <p className="text-sm leading-relaxed text-ink-2">{t.message}</p>
            <FieldTable rows={t.msgFields} />
            <CodeBlock
              title="201 Created"
              code={`[
  {
    "id": 421,
    "to": "+998901234567",
    "text": "Tasdiqlash kodingiz: 48213",
    "status": "queued",
    "priority": "urgent",
    "segments": 1,
    "createdAt": "2026-08-16T09:41:03Z",
    "deliveredAt": null,
    "failReason": null
  }
]`}
            />
          </Section>

          <Section id="errors" title={t.nav.errors}>
            <p className="text-sm leading-relaxed text-ink-2">{t.errors}</p>
            <div className="overflow-hidden rounded-xl border border-line">
              {t.errorRows.map(([code, description], index) => (
                <div key={code} className={cn('flex items-start gap-4 px-4 py-3 text-sm', index % 2 === 1 && 'bg-sunken/50')}>
                  <code className="tnum shrink-0 font-mono font-semibold text-danger">{code}</code>
                  <span className="font-mono text-[13px] text-ink-2">{description}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="limits" title={t.nav.limits}>
            <p className="text-sm leading-relaxed text-ink-2">{t.limits}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
