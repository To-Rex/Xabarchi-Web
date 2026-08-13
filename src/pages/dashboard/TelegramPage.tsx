import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  BookOpen,
  Bot,
  CheckCircle2,
  ExternalLink,
  FileText,
  Image,
  Megaphone,
  Paperclip,
  Send,
  Sparkles,
  Type,
  Unlink,
  Users,
  Video,
} from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatRelative } from '@/shared/lib/format'
import { connectBot, disconnectBot, fetchBot, fetchBroadcasts, fetchSubscribers, sendBroadcast } from '@/features/telegram/api/repository'
import type { BotMessageKind, TelegramBot } from '@/shared/api/types'
import {
  AnimatedNumber,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  SegmentedControl,
  Skeleton,
  Textarea,
  useToast,
} from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Telegram bot — Xabarchi',
    title: 'Telegram bot',
    subtitle: "Kompaniyangiz botini ulang va obunachilarga istalgan turdagi kontent yuboring.",
    docs: 'API hujjatlari',
    connect: {
      title: 'Botingizni ulang',
      body: "Har bir kompaniya o'z botini ulaydi. @BotFather orqali bot yarating va tokenni shu yerga joylashtiring — 1 daqiqada tayyor.",
      steps: ["@BotFather ga /newbot buyrug'ini yuboring", 'Bot nomi va username tanlang', 'Tokenni nusxalab shu yerga joylashtiring'],
      tokenLabel: 'Bot token',
      tokenError: "Token noto'g'ri — @BotFather bergan tokenni kiriting",
      button: 'Botni ulash',
      connectedToast: 'Bot muvaffaqiyatli ulandi',
    },
    bot: {
      connected: 'Faol',
      webhook: 'Webhook faol',
      since: 'Ulangan',
      disconnect: 'Uzish',
      disconnectTitle: 'Botni uzish',
      confirmDisconnect: (username: string) =>
        `@${username} botini uzmoqchimisiz? Yuborish to'xtaydi, obunachilar ro'yxati saqlanib qoladi.`,
      disconnectedToast: 'Bot uzildi',
    },
    stats: { subscribers: 'Obunachilar', sent: 'Yuborilgan xabarlar', delivery: 'Yetkazish darajasi' },
    composer: {
      title: 'Xabar yuborish',
      kinds: { text: 'Matn', photo: 'Rasm', video: 'Video', document: 'Fayl', post: 'Post' },
      textLabel: 'Xabar matni',
      captionLabel: 'Izoh (caption)',
      textPlaceholder: 'Obunachilarga yuboriladigan xabar…',
      textError: 'Matn kiriting',
      fileLabel: 'Fayl',
      chooseFile: 'Fayl tanlash',
      fileError: 'Fayl tanlang',
      buttonLabel: 'Tugma matni',
      buttonPlaceholder: 'Masalan: Buyurtma berish',
      buttonUrl: 'Tugma havolasi',
      urlError: 'Havola https:// bilan boshlanishi kerak',
      audience: 'Qabul qiluvchilar: barcha obunachilar',
      send: 'Yuborish',
      sentToast: 'Xabar obunachilarga yuborildi',
    },
    history: {
      title: 'Yuborilganlar',
      empty: 'Hali xabar yuborilmagan',
      emptyBody: 'Birinchi xabarni yuqoridagi forma orqali yuboring.',
      delivered: 'yetkazildi',
    },
    subscribers: { title: 'Obunachilar', total: 'jami', source: { link: 'havola', qr: 'QR kod', search: 'qidiruv' } },
    future: "Tez orada: bot orqali mijozlar oqimini boshqarish — avto-javoblar, voronkalar va segmentlar.",
  },
  ru: {
    meta: 'Telegram-бот — Xabarchi',
    title: 'Telegram-бот',
    subtitle: 'Подключите бота компании и отправляйте подписчикам контент любого типа.',
    docs: 'API документация',
    connect: {
      title: 'Подключите бота',
      body: 'У каждой компании — свой бот. Создайте бота через @BotFather и вставьте токен сюда — готово за минуту.',
      steps: ['Отправьте /newbot боту @BotFather', 'Выберите имя и username бота', 'Скопируйте токен и вставьте сюда'],
      tokenLabel: 'Токен бота',
      tokenError: 'Неверный токен — вставьте токен от @BotFather',
      button: 'Подключить бота',
      connectedToast: 'Бот успешно подключён',
    },
    bot: {
      connected: 'Активен',
      webhook: 'Вебхук активен',
      since: 'Подключён',
      disconnect: 'Отключить',
      disconnectTitle: 'Отключение бота',
      confirmDisconnect: (username: string) =>
        `Отключить бота @${username}? Отправка остановится, список подписчиков сохранится.`,
      disconnectedToast: 'Бот отключён',
    },
    stats: { subscribers: 'Подписчики', sent: 'Отправлено сообщений', delivery: 'Доставляемость' },
    composer: {
      title: 'Отправить сообщение',
      kinds: { text: 'Текст', photo: 'Фото', video: 'Видео', document: 'Файл', post: 'Пост' },
      textLabel: 'Текст сообщения',
      captionLabel: 'Подпись (caption)',
      textPlaceholder: 'Сообщение для подписчиков…',
      textError: 'Введите текст',
      fileLabel: 'Файл',
      chooseFile: 'Выбрать файл',
      fileError: 'Выберите файл',
      buttonLabel: 'Текст кнопки',
      buttonPlaceholder: 'Например: Сделать заказ',
      buttonUrl: 'Ссылка кнопки',
      urlError: 'Ссылка должна начинаться с https://',
      audience: 'Получатели: все подписчики',
      send: 'Отправить',
      sentToast: 'Сообщение отправлено подписчикам',
    },
    history: {
      title: 'Отправленные',
      empty: 'Сообщений пока нет',
      emptyBody: 'Отправьте первое сообщение через форму выше.',
      delivered: 'доставлено',
    },
    subscribers: { title: 'Подписчики', total: 'всего', source: { link: 'ссылка', qr: 'QR-код', search: 'поиск' } },
    future: 'Скоро: управление потоком клиентов через бота — автоответы, воронки и сегменты.',
  },
  en: {
    meta: 'Telegram bot — Xabarchi',
    title: 'Telegram bot',
    subtitle: 'Connect your company bot and push any kind of content to its subscribers.',
    docs: 'API docs',
    connect: {
      title: 'Connect your bot',
      body: 'Every company connects its own bot. Create one via @BotFather and paste the token here — ready in a minute.',
      steps: ['Send /newbot to @BotFather', 'Pick a bot name and username', 'Copy the token and paste it here'],
      tokenLabel: 'Bot token',
      tokenError: 'Invalid token — paste the token from @BotFather',
      button: 'Connect bot',
      connectedToast: 'Bot connected successfully',
    },
    bot: {
      connected: 'Active',
      webhook: 'Webhook healthy',
      since: 'Connected',
      disconnect: 'Disconnect',
      disconnectTitle: 'Disconnect bot',
      confirmDisconnect: (username: string) =>
        `Disconnect @${username}? Sending stops; the subscriber list is kept.`,
      disconnectedToast: 'Bot disconnected',
    },
    stats: { subscribers: 'Subscribers', sent: 'Messages sent', delivery: 'Delivery rate' },
    composer: {
      title: 'Send a message',
      kinds: { text: 'Text', photo: 'Photo', video: 'Video', document: 'File', post: 'Post' },
      textLabel: 'Message text',
      captionLabel: 'Caption',
      textPlaceholder: 'Message for your subscribers…',
      textError: 'Enter a message',
      fileLabel: 'File',
      chooseFile: 'Choose file',
      fileError: 'Choose a file',
      buttonLabel: 'Button label',
      buttonPlaceholder: 'e.g. Place an order',
      buttonUrl: 'Button URL',
      urlError: 'The URL must start with https://',
      audience: 'Recipients: all subscribers',
      send: 'Send',
      sentToast: 'Message sent to subscribers',
    },
    history: {
      title: 'Sent broadcasts',
      empty: 'No messages yet',
      emptyBody: 'Send your first message with the form above.',
      delivered: 'delivered',
    },
    subscribers: { title: 'Subscribers', total: 'total', source: { link: 'link', qr: 'QR code', search: 'search' } },
    future: 'Coming soon: manage your customer flow through the bot — auto-replies, funnels and segments.',
  },
}

const kindIcons: Record<BotMessageKind, typeof Type> = {
  text: Type,
  photo: Image,
  video: Video,
  document: FileText,
  post: Megaphone,
}

const MEDIA_KINDS: BotMessageKind[] = ['photo', 'video', 'document']

const fileAccept: Record<string, string> = { photo: 'image/*', video: 'video/*', document: '*/*' }

/* ------------------------------------------------------------ connect card */

function ConnectCard({ onConnected }: { onConnected: (bot: TelegramBot) => void }) {
  const t = useT(dict)
  const toast = useToast()
  const [token, setToken] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  const connect = async () => {
    setBusy(true)
    setError(undefined)
    try {
      const bot = await connectBot(token)
      toast('success', t.connect.connectedToast)
      onConnected(bot)
    } catch {
      setError(t.connect.tokenError)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardBody className="p-8 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Bot className="size-7" />
          </span>
          <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">{t.connect.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{t.connect.body}</p>

          <ol className="mt-6 space-y-2 text-left">
            {t.connect.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm text-ink-2">
                <span className="tnum flex size-6 shrink-0 items-center justify-center rounded-full bg-sunken font-mono text-xs font-semibold text-ink-2">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Input
              value={token}
              onChange={(event) => { setToken(event.target.value); setError(undefined) }}
              placeholder="123456789:AAExample_bot_token"
              aria-label={t.connect.tokenLabel}
              error={error}
              containerClassName="flex-1"
              className="font-mono text-[13px]"
            />
            <Button loading={busy} onClick={connect} className="shrink-0">
              <Bot className="size-4" />
              {t.connect.button}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

/* --------------------------------------------------------------- composer */

function Composer({ onSent }: { onSent: () => void }) {
  const t = useT(dict)
  const toast = useToast()
  const [kind, setKind] = useState<BotMessageKind>('text')
  const [text, setText] = useState('')
  const [textError, setTextError] = useState<string>()
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>()
  const [buttonLabel, setButtonLabel] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')
  const [urlError, setUrlError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isMedia = MEDIA_KINDS.includes(kind)

  const changeKind = (next: BotMessageKind) => {
    setKind(next)
    setFile(null)
    setFileError(undefined)
    setUrlError(undefined)
    if (fileRef.current) fileRef.current.value = ''
  }

  const send = async () => {
    let invalid = false
    if (!text.trim()) {
      setTextError(t.composer.textError)
      invalid = true
    }
    if (isMedia && !file) {
      setFileError(t.composer.fileError)
      invalid = true
    }
    if (kind === 'post' && buttonUrl && !buttonUrl.startsWith('https://')) {
      setUrlError(t.composer.urlError)
      invalid = true
    }
    if (invalid) return

    setBusy(true)
    try {
      await sendBroadcast({
        kind,
        text: text.trim(),
        mediaName: file?.name,
        buttonLabel: kind === 'post' && buttonLabel.trim() ? buttonLabel.trim() : undefined,
        buttonUrl: kind === 'post' && buttonUrl.trim() ? buttonUrl.trim() : undefined,
      })
      toast('success', t.composer.sentToast)
      setText('')
      setFile(null)
      setButtonLabel('')
      setButtonUrl('')
      if (fileRef.current) fileRef.current.value = ''
      onSent()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="size-4 text-brand" />
          {t.composer.title}
        </CardTitle>
      </CardHeader>
      <CardBody className="space-y-4 pt-3">
        <SegmentedControl
          size="sm"
          value={kind}
          onChange={changeKind}
          segments={(Object.keys(t.composer.kinds) as BotMessageKind[]).map((value) => ({
            value,
            label: t.composer.kinds[value],
          }))}
        />

        <Textarea
          label={isMedia ? t.composer.captionLabel : t.composer.textLabel}
          placeholder={t.composer.textPlaceholder}
          value={text}
          onChange={(event) => { setText(event.target.value); setTextError(undefined) }}
          error={textError}
        />

        <AnimatePresence initial={false} mode="popLayout">
          {isMedia && (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[13px] font-medium text-ink-2">{t.composer.fileLabel}</p>
              <input
                ref={fileRef}
                type="file"
                accept={fileAccept[kind]}
                className="hidden"
                onChange={(event) => { setFile(event.target.files?.[0] ?? null); setFileError(undefined) }}
              />
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  <Paperclip className="size-4" />
                  {t.composer.chooseFile}
                </Button>
                {file && <span className="tnum max-w-60 truncate font-mono text-[13px] text-ink-2">{file.name}</span>}
              </div>
              {fileError && <p className="mt-1.5 text-[13px] text-danger" role="alert">{fileError}</p>}
            </motion.div>
          )}

          {kind === 'post' && (
            <motion.div
              key="post"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid gap-3 sm:grid-cols-2"
            >
              <Input
                label={t.composer.buttonLabel}
                placeholder={t.composer.buttonPlaceholder}
                value={buttonLabel}
                onChange={(event) => setButtonLabel(event.target.value)}
              />
              <Input
                label={t.composer.buttonUrl}
                placeholder="https://…"
                inputMode="url"
                value={buttonUrl}
                onChange={(event) => { setButtonUrl(event.target.value); setUrlError(undefined) }}
                error={urlError}
                className="font-mono text-[13px]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="flex items-center gap-2 text-[13px] text-ink-3">
            <Users className="size-4" />
            {t.composer.audience}
          </p>
          <Button loading={busy} onClick={send}>
            <Send className="size-4" />
            {t.composer.send}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

/* ---------------------------------------------------------- connected view */

function ConnectedView({ bot, onDisconnected }: { bot: TelegramBot; onDisconnected: () => void }) {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  const toast = useToast()

  const [historyVersion, setHistoryVersion] = useState(0)
  const broadcastsState = useAsync(fetchBroadcasts, [historyVersion])
  const subscribersState = useAsync(fetchSubscribers, [])

  const [disconnecting, setDisconnecting] = useState(false)
  const [busy, setBusy] = useState(false)

  const confirmDisconnect = async () => {
    setBusy(true)
    await disconnectBot()
    setBusy(false)
    setDisconnecting(false)
    toast('info', t.bot.disconnectedToast)
    onDisconnected()
  }

  const broadcasts = broadcastsState.data ?? []
  const totalDelivered = broadcasts.reduce((sum, item) => sum + item.delivered, 0)
  const totalAudience = broadcasts.reduce((sum, item) => sum + item.audience, 0)
  const deliveryRate = totalAudience ? (totalDelivered / totalAudience) * 100 : 0

  return (
    <>
      {/* bot info + stats */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody className="flex flex-wrap items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Bot className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-semibold text-ink">{bot.title}</span>
                <Badge tone="ok">{t.bot.connected}</Badge>
              </p>
              <a
                href={`https://t.me/${bot.username}`}
                target="_blank"
                rel="noreferrer"
                className="tnum mt-0.5 inline-flex items-center gap-1 font-mono text-[13px] text-brand transition-colors hover:text-brand-2"
              >
                @{bot.username}
                <ExternalLink className="size-3" />
              </a>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-3">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-ok" />
                  {t.bot.webhook}
                </span>
                <span className="tnum">{t.bot.since}: {formatDate(bot.connectedAt, lang)}</span>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setDisconnecting(true)} className="text-ink-3 hover:text-danger">
              <Unlink className="size-4" />
              {t.bot.disconnect}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-4">
            <div>
              <p className="text-xs text-ink-3">{t.stats.subscribers}</p>
              <p className="tnum mt-0.5 font-display text-xl font-semibold text-ink">
                <AnimatedNumber value={bot.subscriberCount} format={(v) => new Intl.NumberFormat().format(Math.round(v))} />
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-3">{t.stats.sent}</p>
              <p className="tnum mt-0.5 font-display text-xl font-semibold text-ink">
                <AnimatedNumber value={broadcasts.length} format={(v) => String(Math.round(v))} />
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-3">{t.stats.delivery}</p>
              <p className="tnum mt-0.5 font-display text-xl font-semibold text-brand">
                <AnimatedNumber value={deliveryRate} format={(v) => `${v.toFixed(1)}%`} />
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <Composer onSent={() => setHistoryVersion((v) => v + 1)} />

          {/* history */}
          <Card>
            <CardHeader>
              <CardTitle>{t.history.title}</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              {broadcastsState.error ? (
                <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={broadcastsState.refetch}>{c.retry}</Button>} />
              ) : broadcastsState.loading || !broadcastsState.data ? (
                <div className="space-y-2.5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : broadcasts.length === 0 ? (
                <EmptyState icon={<Megaphone />} title={t.history.empty} body={t.history.emptyBody} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {broadcasts.map((item) => {
                      const Icon = kindIcons[item.kind]
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          className="flex items-start gap-3 rounded-xl border border-line p-4"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-2">
                              <Badge tone="neutral" className="font-mono text-[10.5px]">{t.composer.kinds[item.kind]}</Badge>
                              {item.mediaName && (
                                <span className="tnum truncate font-mono text-xs text-ink-3">{item.mediaName}</span>
                              )}
                            </p>
                            <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-ink">{item.text}</p>
                            {item.buttonLabel && (
                              <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-brand/35 px-2.5 py-1 text-xs font-medium text-brand">
                                {item.buttonLabel}
                                <ExternalLink className="size-3" />
                              </span>
                            )}
                          </div>
                          <div className="shrink-0 text-right text-xs text-ink-3">
                            <p className="tnum">{formatRelative(item.createdAt, lang)}</p>
                            <p className="tnum mt-1">
                              <span className="font-semibold text-ok">{new Intl.NumberFormat().format(item.delivered)}</span>
                              {' / '}
                              {new Intl.NumberFormat().format(item.audience)} {t.history.delivered}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* subscribers */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4 text-brand" />
                {t.subscribers.title}
              </CardTitle>
              <Badge tone="brand" className="tnum">
                {new Intl.NumberFormat().format(bot.subscriberCount)} {t.subscribers.total}
              </Badge>
            </CardHeader>
            <CardBody className="pt-3">
              {subscribersState.loading || !subscribersState.data ? (
                <div className="space-y-2.5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-11 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {subscribersState.data.slice(0, 8).map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sunken">
                      <Avatar name={subscriber.name} hue={subscriber.avatarHue} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{subscriber.name}</p>
                        <p className="tnum truncate font-mono text-xs text-ink-3">
                          {subscriber.username ? `@${subscriber.username}` : t.subscribers.source[subscriber.source]}
                        </p>
                      </div>
                      <span className="tnum shrink-0 text-xs text-ink-3">{formatRelative(subscriber.joinedAt, lang)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-info-soft p-3.5 text-[13px] leading-relaxed text-info">
            <Sparkles className="mt-0.5 size-4 shrink-0" />
            {t.future}
          </p>
        </div>
      </div>

      {/* disconnect confirm */}
      <Modal
        open={disconnecting}
        onClose={() => setDisconnecting(false)}
        title={t.bot.disconnectTitle}
        closeLabel={c.close}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDisconnecting(false)}>{c.cancel}</Button>
            <Button variant="danger" loading={busy} onClick={confirmDisconnect}>
              <Unlink className="size-4" />
              {t.bot.disconnect}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-ink-2">{t.bot.confirmDisconnect(bot.username)}</p>
      </Modal>
    </>
  )
}

/* ------------------------------------------------------------------- page */

export default function TelegramPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  usePageMeta(t.meta)

  const [version, setVersion] = useState(0)
  const { data: bot, loading, error, refetch } = useAsync(fetchBot, [version])

  return (
    <div>
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Link to="/docs">
            <Button variant="secondary">
              <BookOpen className="size-4" />
              {t.docs}
            </Button>
          </Link>
        }
      />

      {error ? (
        <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
      ) : loading ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <Skeleton className="h-28 w-full lg:col-span-2" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-80 w-full lg:col-span-2" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : !bot ? (
        <ConnectCard onConnected={() => setVersion((v) => v + 1)} />
      ) : (
        <ConnectedView bot={bot} onDisconnected={() => setVersion((v) => v + 1)} />
      )}
    </div>
  )
}
