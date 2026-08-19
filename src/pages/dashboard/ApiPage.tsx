import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpen, Check, Copy, KeyRound, Plus, ShieldAlert, Trash2, Webhook } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatRelative } from '@/shared/lib/format'
import { storageGet, storageSet } from '@/shared/lib/storage'
import type { ApiKey } from '@/shared/api/types'
import { ApiError } from '@/shared/api/client'
import { createApiKey, fetchApiKeys, revokeApiKey } from '@/features/apikeys/api/repository'
import { cn } from '@/shared/lib/cn'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, CodeBlock, EmptyState, Input, Modal, PageHeader, Skeleton, useToast } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'API — Xabarchi',
    title: 'API',
    subtitle: 'Kalitlar, webhooklar va tez boshlash.',
    docs: 'To‘liq hujjatlar',
    keys: { title: 'API kalitlar', add: 'Kalit yaratish', name: 'Nomi', created: 'Yaratilgan', lastUsed: "So'nggi ishlatilgan", never: 'Ishlatilmagan', scopes: 'Ruxsatlar' },
    empty: 'Hali API kalit yo‘q',
    emptyBody: 'Birinchi kalitni yarating va 5 daqiqada birinchi SMSni API orqali yuboring.',
    createModal: {
      title: 'Yangi API kalit',
      namePlaceholder: 'Masalan: Production server',
      nameError: 'Kalit nomini kiriting',
      scopesLabel: 'Ruxsatlar',
      create: 'Yaratish',
    },
    secretModal: {
      title: 'Kalit yaratildi',
      warn: 'Bu kalit faqat hozir ko‘rsatiladi. Uni xavfsiz joyga saqlang — qayta ko‘rib bo‘lmaydi.',
      done: 'Sakladim',
    },
    revoke: 'Bekor qilish',
    confirmRevoke: (name: string) => `«${name}» kalitini bekor qilmoqchimisiz? Undan foydalanayotgan integratsiyalar ishlamay qoladi.`,
    revokedToast: 'Kalit bekor qilindi',
    createdToast: 'Kalit yaratildi',
    webhook: { title: 'Webhook', hint: 'Xabar holati o‘zgarganda shu manzilga POST yuboramiz.', save: 'Saqlash', savedToast: 'Webhook saqlandi' },
    quickstart: 'Tez boshlash',
  },
  ru: {
    meta: 'API — Xabarchi',
    title: 'API',
    subtitle: 'Ключи, вебхуки и быстрый старт.',
    docs: 'Полная документация',
    keys: { title: 'API-ключи', add: 'Создать ключ', name: 'Название', created: 'Создан', lastUsed: 'Последнее использование', never: 'Не использовался', scopes: 'Права' },
    empty: 'API-ключей пока нет',
    emptyBody: 'Создайте первый ключ и отправьте первое SMS через API за 5 минут.',
    createModal: {
      title: 'Новый API-ключ',
      namePlaceholder: 'Например: Production server',
      nameError: 'Введите название ключа',
      scopesLabel: 'Права',
      create: 'Создать',
    },
    secretModal: {
      title: 'Ключ создан',
      warn: 'Этот ключ показывается только сейчас. Сохраните его в надёжном месте — увидеть снова нельзя.',
      done: 'Сохранил',
    },
    revoke: 'Отозвать',
    confirmRevoke: (name: string) => `Отозвать ключ «${name}»? Интеграции, использующие его, перестанут работать.`,
    revokedToast: 'Ключ отозван',
    createdToast: 'Ключ создан',
    webhook: { title: 'Вебхук', hint: 'При смене статуса сообщения мы отправим POST на этот адрес.', save: 'Сохранить', savedToast: 'Вебхук сохранён' },
    quickstart: 'Быстрый старт',
  },
  en: {
    meta: 'API — Xabarchi',
    title: 'API',
    subtitle: 'Keys, webhooks and a quick start.',
    docs: 'Full documentation',
    keys: { title: 'API keys', add: 'Create key', name: 'Name', created: 'Created', lastUsed: 'Last used', never: 'Never used', scopes: 'Scopes' },
    empty: 'No API keys yet',
    emptyBody: 'Create your first key and send your first SMS via the API in 5 minutes.',
    createModal: {
      title: 'New API key',
      namePlaceholder: 'e.g. Production server',
      nameError: 'Enter a key name',
      scopesLabel: 'Scopes',
      create: 'Create',
    },
    secretModal: {
      title: 'Key created',
      warn: 'This key is shown only once. Store it somewhere safe — you can’t view it again.',
      done: 'Saved it',
    },
    revoke: 'Revoke',
    confirmRevoke: (name: string) => `Revoke “${name}”? Integrations using it will stop working.`,
    revokedToast: 'Key revoked',
    createdToast: 'Key created',
    webhook: { title: 'Webhook', hint: 'We POST to this URL whenever a message changes state.', save: 'Save', savedToast: 'Webhook saved' },
    quickstart: 'Quick start',
  },
}

const ALL_SCOPES: ApiKey['scopes'][number][] = ['sms.send', 'sms.read', 'devices.read', 'contacts.read', 'telegram.send', 'telegram.read']

const WEBHOOK_KEY = 'xabarchi:webhook-url'

export default function ApiPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()

  const [version, setVersion] = useState(0)
  const { data, loading, error, refetch } = useAsync(fetchApiKeys, [version])

  const [createOpen, setCreateOpen] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [keyNameError, setKeyNameError] = useState<string>()
  const [scopes, setScopes] = useState<Set<string>>(new Set(['sms.send']))
  const [busy, setBusy] = useState(false)
  const [secret, setSecret] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [revoking, setRevoking] = useState<ApiKey | null>(null)
  const [webhookUrl, setWebhookUrl] = useState(() => storageGet(WEBHOOK_KEY) ?? '')
  const [webhookBusy, setWebhookBusy] = useState(false)

  const createKey = async () => {
    if (!keyName.trim()) {
      setKeyNameError(t.createModal.nameError)
      return
    }
    setBusy(true)
    try {
      const created = await createApiKey(keyName.trim(), [...scopes] as ApiKey['scopes'])
      setCreateOpen(false)
      setSecret(created.key)
      setKeyName('')
      setScopes(new Set(['sms.send']))
      setVersion((v) => v + 1)
      toast('success', t.createdToast)
    } catch (err) {
      toast('error', err instanceof ApiError ? err.message : c.errorTitle)
    } finally {
      setBusy(false)
    }
  }

  const confirmRevoke = async () => {
    if (!revoking) return
    setBusy(true)
    try {
      await revokeApiKey(revoking.id)
      setRevoking(null)
      setVersion((v) => v + 1)
      toast('info', t.revokedToast)
    } catch (err) {
      toast('error', err instanceof ApiError ? err.message : c.errorTitle)
    } finally {
      setBusy(false)
    }
  }

  const copySecret = async () => {
    if (!secret) return
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* ignore */ }
  }

  const saveWebhook = () => {
    setWebhookBusy(true)
    storageSet(WEBHOOK_KEY, webhookUrl.trim())
    setWebhookBusy(false)
    toast('success', t.webhook.savedToast)
  }

  return (
    <div>
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Link to="/app/api/docs">
            <Button variant="secondary">
              <BookOpen className="size-4" />
              {t.docs}
            </Button>
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          {/* Keys */}
          <Card>
            <CardHeader>
              <CardTitle>{t.keys.title}</CardTitle>
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="size-4" />
                {t.keys.add}
              </Button>
            </CardHeader>
            <CardBody className="pt-3">
              {error ? (
                <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
              ) : loading || !data ? (
                <div className="space-y-2.5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : data.length === 0 ? (
                <EmptyState icon={<KeyRound />} title={t.empty} body={t.emptyBody} action={<Button onClick={() => setCreateOpen(true)}>{t.keys.add}</Button>} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {data.map((key) => (
                      <motion.div
                        key={key.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-4"
                      >
                        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                          <KeyRound className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink">{key.name}</p>
                          <p className="tnum mt-0.5 font-mono text-xs text-ink-3">{key.prefix}••••••••••••</p>
                          <p className="mt-1.5 flex flex-wrap gap-1.5">
                            {key.scopes.map((scope) => (
                              <Badge key={scope} tone="neutral" className="font-mono text-[10.5px]">{scope}</Badge>
                            ))}
                          </p>
                        </div>
                        <div className="text-right text-xs text-ink-3">
                          <p className="tnum">{t.keys.created}: {formatDate(key.createdAt, lang)}</p>
                          <p className="tnum mt-0.5">
                            {key.lastUsedAt ? `${t.keys.lastUsed}: ${formatRelative(key.lastUsedAt, lang)}` : t.keys.never}
                          </p>
                        </div>
                        <button
                          onClick={() => setRevoking(key)}
                          aria-label={t.revoke}
                          title={t.revoke}
                          className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Webhook */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="size-4 text-brand" />
                  {t.webhook.title}
                </CardTitle>
                <p className="mt-1 text-[13px] text-ink-3">{t.webhook.hint}</p>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-3 pt-3 sm:flex-row">
              <Input
                value={webhookUrl}
                onChange={(event) => setWebhookUrl(event.target.value)}
                containerClassName="flex-1"
                className="font-mono text-[13px]"
                inputMode="url"
                aria-label={t.webhook.title}
              />
              <Button loading={webhookBusy} onClick={saveWebhook}>{t.webhook.save}</Button>
            </CardBody>
          </Card>
        </div>

        {/* Quickstart */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-3">{t.quickstart}</p>
          <CodeBlock
            title="POST /v1/messages"
            code={`curl https://api.xabarchi.uz/v1/messages \\
  -H "Authorization: Bearer ${data?.[0]?.prefix ?? 'xab_live_...'}..." \\
  -d to="+998901234567" \\
  -d text="Salom!"`}
          />
        </div>
      </div>

      {/* Create key */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t.createModal.title}
        closeLabel={c.close}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>{c.cancel}</Button>
            <Button loading={busy} onClick={createKey}>{t.createModal.create}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={t.keys.name}
            placeholder={t.createModal.namePlaceholder}
            value={keyName}
            onChange={(event) => { setKeyName(event.target.value); setKeyNameError(undefined) }}
            error={keyNameError}
          />
          <div>
            <p className="text-[13px] font-medium text-ink-2">{t.createModal.scopesLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_SCOPES.map((scope) => {
                const active = scopes.has(scope)
                return (
                  <button
                    key={scope}
                    type="button"
                    onClick={() =>
                      setScopes((prev) => {
                        const next = new Set(prev)
                        if (next.has(scope)) next.delete(scope)
                        else next.add(scope)
                        return next
                      })
                    }
                    className={cn(
                      'rounded-full border px-3 py-1 font-mono text-xs font-medium transition-all',
                      active ? 'border-brand bg-brand-soft text-brand-2 dark:text-brand' : 'border-line text-ink-2 hover:border-line-2',
                    )}
                  >
                    {scope}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Show secret once */}
      <Modal open={!!secret} onClose={() => setSecret(null)} title={t.secretModal.title} closeLabel={c.close} size="md">
        <div className="space-y-4">
          <p className="flex items-start gap-2.5 rounded-xl bg-gold-soft p-3.5 text-[13px] leading-relaxed text-gold">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" />
            {t.secretModal.warn}
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-sunken p-3.5">
            <code className="tnum min-w-0 flex-1 break-all font-mono text-[13px] text-ink">{secret}</code>
            <Button size="sm" variant="secondary" onClick={copySecret}>
              {copied ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
              {copied ? c.copied : 'Copy'}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setSecret(null)}>{t.secretModal.done}</Button>
          </div>
        </div>
      </Modal>

      {/* Revoke confirm */}
      <Modal
        open={!!revoking}
        onClose={() => setRevoking(null)}
        title={c.confirmDeleteTitle}
        closeLabel={c.close}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRevoking(null)}>{c.cancel}</Button>
            <Button variant="danger" loading={busy} onClick={confirmRevoke}>
              <Trash2 className="size-4" />
              {t.revoke}
            </Button>
          </>
        }
      >
        {revoking && <p className="text-sm leading-relaxed text-ink-2">{t.confirmRevoke(revoking.name)}</p>}
      </Modal>
    </div>
  )
}
