import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, CheckCircle2, Plus, Search, Send, Users, X } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { useAsync } from '@/shared/lib/useAsync'
import { formatNumber, formatPhone, smsSegments } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { ApiError } from '@/shared/api/client'
import type { SmsPriority } from '@/shared/api/types'
import { Badge, Button, Input, Modal, SegmentedControl, Select, Textarea, useToast } from '@/shared/ui'
import { sendSms } from '@/features/sms/api/repository'
import { fetchDevices } from '@/features/devices/api/repository'
import { fetchTemplates } from '@/features/templates/api/repository'
import { fetchContacts } from '@/features/contacts/api/repository'

/** Reference data the composer needs: devices, templates, contacts, groups. */
async function fetchComposeRefs() {
  const [devices, templates, contactsData] = await Promise.all([fetchDevices(), fetchTemplates(), fetchContacts()])
  return { devices, templates, contacts: contactsData.items, groups: contactsData.groups }
}

const dict = {
  uz: {
    meta: 'Yangi SMS — Xabarchi',
    back: 'SMS tarixiga qaytish',
    title: 'Yangi SMS',
    recipients: 'Qabul qiluvchilar',
    recipientsPlaceholder: '+998 90 123 45 67 kiriting va Enter bosing',
    fromContacts: 'Kontaktlardan',
    template: 'Shablon',
    templateNone: 'Shablonsiz',
    message: 'Xabar matni',
    messagePlaceholder: 'Xabaringizni yozing…',
    device: 'Qurilma',
    priority: 'Yuborish turi',
    priorities: { urgent: 'Tezkor', transactional: 'Tranzaksion', bulk: 'Ommaviy' },
    priorityHints: {
      urgent: 'OTP va shoshilinch xabarlar — navbat boshiga o‘tadi, intervalsiz yuboriladi.',
      transactional: 'Buyurtma, eslatma kabi xabarlar — qisqa interval bilan.',
      bulk: 'Aksiya va ommaviy yuborish — sekin qator, kunlik limitga bo‘ysunadi.',
    },
    submit: 'Yuborish',
    preview: 'Ko‘rinish',
    chars: 'belgi',
    segments: 'segment',
    totalSms: 'Jami SMS',
    unicodeHint: 'Kirill yoki maxsus belgilar — segment 70 belgigacha qisqaradi.',
    contactsModal: 'Kontaktlarni tanlash',
    addSelected: (n: number) => `Tanlanganlarni qo'shish (${n})`,
    sentToast: 'SMS navbatga qo‘shildi',
    sentToastBody: (n: number) => `${n} ta xabar yuborilmoqda. Holatini tarixda kuzating.`,
    successTitle: 'Yuborildi!',
    successBody: (n: number) => `${n} ta xabar navbatga qo'shildi va yuborilmoqda.`,
    goHistory: 'Tarixni ochish',
    errors: { recipients: 'Kamida bitta raqam kiriting', invalidPhone: 'Raqam +998 bilan, 12 raqamdan iborat bo‘lsin', text: 'Xabar matnini kiriting' },
  },
  ru: {
    meta: 'Новое SMS — Xabarchi',
    back: 'Назад к истории SMS',
    title: 'Новое SMS',
    recipients: 'Получатели',
    recipientsPlaceholder: 'Введите +998 90 123 45 67 и нажмите Enter',
    fromContacts: 'Из контактов',
    template: 'Шаблон',
    templateNone: 'Без шаблона',
    message: 'Текст сообщения',
    messagePlaceholder: 'Напишите сообщение…',
    device: 'Устройство',
    priority: 'Тип отправки',
    priorities: { urgent: 'Срочное', transactional: 'Транзакционное', bulk: 'Массовое' },
    priorityHints: {
      urgent: 'OTP и срочные сообщения — идут в начало очереди, без интервала.',
      transactional: 'Заказы, напоминания — с коротким интервалом.',
      bulk: 'Акции и массовые рассылки — медленная полоса, в рамках дневного лимита.',
    },
    submit: 'Отправить',
    preview: 'Превью',
    chars: 'символов',
    segments: 'сегм.',
    totalSms: 'Всего SMS',
    unicodeHint: 'Кириллица или спецсимволы — сегмент сокращается до 70 символов.',
    contactsModal: 'Выбор контактов',
    addSelected: (n: number) => `Добавить выбранные (${n})`,
    sentToast: 'SMS добавлены в очередь',
    sentToastBody: (n: number) => `${n} сообщений отправляются. Следите за статусом в истории.`,
    successTitle: 'Отправлено!',
    successBody: (n: number) => `${n} сообщений добавлены в очередь и отправляются.`,
    goHistory: 'Открыть историю',
    errors: { recipients: 'Добавьте хотя бы один номер', invalidPhone: 'Номер должен начинаться с +998 и содержать 12 цифр', text: 'Введите текст сообщения' },
  },
  en: {
    meta: 'New SMS — Xabarchi',
    back: 'Back to SMS history',
    title: 'New SMS',
    recipients: 'Recipients',
    recipientsPlaceholder: 'Type +998 90 123 45 67 and press Enter',
    fromContacts: 'From contacts',
    template: 'Template',
    templateNone: 'No template',
    message: 'Message text',
    messagePlaceholder: 'Write your message…',
    device: 'Device',
    priority: 'Send type',
    priorities: { urgent: 'Urgent', transactional: 'Transactional', bulk: 'Bulk' },
    priorityHints: {
      urgent: 'OTP and time-critical messages — jump the queue, no send interval.',
      transactional: 'Orders, reminders — a short interval between sends.',
      bulk: 'Campaigns and mass sends — the slow lane, within the daily limit.',
    },
    submit: 'Send',
    preview: 'Preview',
    chars: 'chars',
    segments: 'segments',
    totalSms: 'Total SMS',
    unicodeHint: 'Cyrillic or special characters shrink a segment to 70 characters.',
    contactsModal: 'Choose contacts',
    addSelected: (n: number) => `Add selected (${n})`,
    sentToast: 'SMS queued',
    sentToastBody: (n: number) => `${n} messages are on their way. Track their status in history.`,
    successTitle: 'Sent!',
    successBody: (n: number) => `${n} messages were queued and are being sent.`,
    goHistory: 'Open history',
    errors: { recipients: 'Add at least one number', invalidPhone: 'Numbers start with +998 and contain 12 digits', text: 'Enter the message text' },
  },
}

function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '')
  if (digits.length === 9) digits = `998${digits}`
  if (digits.length === 12 && digits.startsWith('998')) return digits
  return null
}

export default function ComposePage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const { data: refs } = useAsync(fetchComposeRefs)
  const devices = refs?.devices ?? []
  const templates = refs?.templates ?? []
  const contacts = refs?.contacts ?? []
  const groups = refs?.groups ?? []

  const [recipients, setRecipients] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneError, setPhoneError] = useState<string>()
  const [templateId, setTemplateId] = useState('')
  const [text, setText] = useState('')
  const [textError, setTextError] = useState<string>()
  const [deviceId, setDeviceId] = useState('')
  const [priority, setPriority] = useState<SmsPriority>('transactional')

  // Once reference data lands: pick the default device and apply the
  // template that a "Use" click on the templates page carried over.
  useEffect(() => {
    if (!refs) return
    if (!deviceId && refs.devices.length > 0) {
      const online = refs.devices.find((device) => device.status === 'online')
      setDeviceId((online ?? refs.devices[0]).id)
    }
    const wantedTemplate = (location.state as { templateId?: string } | null)?.templateId
    if (wantedTemplate && !templateId) {
      const template = refs.templates.find((entry) => entry.id === wantedTemplate)
      if (template) {
        setTemplateId(template.id)
        setText((prev) => prev || template.text)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs])
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [contactsOpen, setContactsOpen] = useState(false)
  const [contactSearch, setContactSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const seg = useMemo(() => smsSegments(text), [text])
  const totalSms = seg.segments * recipients.length

  const addPhone = () => {
    if (!phoneInput.trim()) return
    const normalized = normalizePhone(phoneInput)
    if (!normalized) {
      setPhoneError(t.errors.invalidPhone)
      return
    }
    setPhoneError(undefined)
    setRecipients((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]))
    setPhoneInput('')
  }

  const onPhoneKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addPhone()
    }
    if (event.key === 'Backspace' && !phoneInput && recipients.length) {
      setRecipients((prev) => prev.slice(0, -1))
    }
  }

  const applyTemplate = (id: string) => {
    setTemplateId(id)
    const template = templates.find((entry) => entry.id === id)
    if (template) {
      setText(template.text)
      setTextError(undefined)
    }
  }

  const filteredContacts = useMemo(() => {
    const term = contactSearch.trim().toLowerCase()
    return contacts.filter((contact) => {
      const inGroup = groupFilter === 'all' || contact.groupIds.includes(groupFilter)
      const matches = !term || `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(term) || contact.phone.includes(term.replace(/\D/g, '') || ' ')
      return inGroup && matches
    })
  }, [contacts, contactSearch, groupFilter])

  const addChecked = () => {
    const phones = contacts.filter((contact) => checked.has(contact.id)).map((contact) => contact.phone)
    setRecipients((prev) => [...prev, ...phones.filter((phone) => !prev.includes(phone))])
    setChecked(new Set())
    setContactsOpen(false)
  }

  const submit = async () => {
    let hasError = false
    if (recipients.length === 0) {
      setPhoneError(t.errors.recipients)
      hasError = true
    }
    if (!text.trim()) {
      setTextError(t.errors.text)
      hasError = true
    }
    if (hasError) return

    setSending(true)
    try {
      const created = await sendSms({ to: recipients, text, deviceId: deviceId || undefined, priority })
      setDone(true)
      toast('success', t.sentToast, t.sentToastBody(created.length))
    } catch (error) {
      toast('error', error instanceof ApiError ? error.message : c.errorTitle)
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        className="mx-auto flex max-w-md flex-col items-center py-24 text-center"
      >
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
          className="flex size-20 items-center justify-center rounded-full bg-ok-soft"
        >
          <CheckCircle2 className="size-10 text-ok" />
        </motion.span>
        <h1 className="mt-7 font-display text-2xl font-semibold text-ink">{t.successTitle}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{t.successBody(recipients.length)}</p>
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={() => { setDone(false); setRecipients([]); setText(''); setTemplateId('') }}>
            {t.title}
          </Button>
          <Button onClick={() => navigate('/app/sms')}>{t.goHistory}</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/app/sms')} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="size-4" />
        {t.back}
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink">{t.title}</h1>

          {/* Recipients */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label htmlFor="phone-input" className="text-[13px] font-medium text-ink-2">{t.recipients}</label>
              <button onClick={() => setContactsOpen(true)} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand transition-colors hover:text-brand-2">
                <Users className="size-3.5" />
                {t.fromContacts}
              </button>
            </div>
            <div
              className={cn(
                'mt-1.5 flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border bg-surface px-2.5 py-2 transition-all',
                phoneError ? 'border-danger' : 'border-line-2 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15',
              )}
            >
              <AnimatePresence initial={false}>
                {recipients.map((phone) => (
                  <motion.span
                    key={phone}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="tnum inline-flex items-center gap-1.5 rounded-lg bg-brand-soft px-2.5 py-1 font-mono text-xs font-medium text-brand-2 dark:text-brand"
                  >
                    {formatPhone(phone)}
                    <button onClick={() => setRecipients((prev) => prev.filter((entry) => entry !== phone))} aria-label={c.delete} className="transition-colors hover:text-danger">
                      <X className="size-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <input
                id="phone-input"
                value={phoneInput}
                onChange={(event) => { setPhoneInput(event.target.value); setPhoneError(undefined) }}
                onKeyDown={onPhoneKey}
                onBlur={addPhone}
                placeholder={recipients.length === 0 ? t.recipientsPlaceholder : undefined}
                className="min-w-40 flex-1 bg-transparent px-1 py-0.5 font-mono text-[13px] text-ink placeholder:font-sans placeholder:text-ink-3 focus:outline-none"
                inputMode="tel"
              />
            </div>
            {phoneError && <p role="alert" className="mt-1.5 text-[13px] text-danger">{phoneError}</p>}
          </div>

          {/* Template */}
          <Select label={t.template} value={templateId} onChange={(event) => applyTemplate(event.target.value)} containerClassName="mt-5">
            <option value="">{t.templateNone}</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>

          {/* Message */}
          <div className="mt-5">
            <Textarea
              label={t.message}
              placeholder={t.messagePlaceholder}
              value={text}
              onChange={(event) => { setText(event.target.value); setTextError(undefined) }}
              error={textError}
              rows={5}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-3">
              <span className="tnum">{seg.chars} {t.chars}</span>
              <span aria-hidden>·</span>
              <span className="tnum">{seg.segments} {t.segments}</span>
              {seg.unicode && <Badge tone="gold">{t.unicodeHint}</Badge>}
            </div>
          </div>

          {/* Priority lane */}
          <div className="mt-5">
            <p className="text-[13px] font-medium text-ink-2">{t.priority}</p>
            <SegmentedControl
              size="sm"
              className="mt-1.5"
              value={priority}
              onChange={setPriority}
              segments={(['urgent', 'transactional', 'bulk'] as SmsPriority[]).map((value) => ({
                value,
                label: t.priorities[value],
              }))}
            />
            <p className="mt-1.5 text-[13px] text-ink-3">{t.priorityHints[priority]}</p>
          </div>

          {/* Device */}
          <Select label={t.device} value={deviceId} onChange={(event) => setDeviceId(event.target.value)} containerClassName="mt-5">
            {devices.map((device) => (
              <option key={device.id} value={device.id} disabled={device.status === 'offline'}>
                {device.name} · {device.operator} {device.status === 'offline' ? `· ${c.offline}` : ''}
              </option>
            ))}
          </Select>

          <Button size="lg" className="mt-7 w-full sm:w-auto" loading={sending} onClick={submit}>
            <Send className="size-4" />
            {t.submit}
            {totalSms > 0 && <span className="tnum rounded-md bg-black/10 px-1.5 py-0.5 text-xs">{formatNumber(totalSms, lang)}</span>}
          </Button>
        </motion.div>

        {/* Live preview */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-3">{t.preview}</p>
          <div className="mx-auto w-full max-w-70 rounded-[2rem] border border-line-2 bg-surface p-2.5 shadow-card">
            <div className="rounded-[1.6rem] bg-sunken p-3.5 dark:bg-bg">
              <div className="flex items-center justify-between px-1 text-[10px] font-medium text-ink-3">
                <span className="tnum">09:41</span>
                <span>{devices.find((device) => device.id === deviceId)?.operator}</span>
              </div>
              <div className="mt-6 min-h-44">
                <AnimatePresence mode="popLayout">
                  {text.trim() ? (
                    <motion.div
                      key="bubble"
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand p-3 text-[12.5px] leading-snug text-brand-ink shadow-card"
                    >
                      {text}
                    </motion.div>
                  ) : (
                    <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-14 text-center text-xs text-ink-3">
                      {t.messagePlaceholder}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <dl className="mx-auto mt-4 grid max-w-70 grid-cols-3 gap-2 text-center">
            {[
              [recipients.length, t.recipients],
              [seg.segments, t.segments],
              [totalSms, t.totalSms],
            ].map(([value, label]) => (
              <div key={String(label)} className="rounded-xl border border-line bg-surface px-2 py-2.5">
                <dt className="sr-only">{label}</dt>
                <dd className="tnum font-display text-lg font-semibold text-ink">{value}</dd>
                <dd className="mt-0.5 truncate text-[10.5px] text-ink-3">{label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* Contacts picker */}
      <Modal
        open={contactsOpen}
        onClose={() => setContactsOpen(false)}
        title={t.contactsModal}
        closeLabel={c.close}
        footer={
          <>
            <Button variant="ghost" onClick={() => setContactsOpen(false)}>{c.cancel}</Button>
            <Button disabled={checked.size === 0} onClick={addChecked}>
              <Plus className="size-4" />
              {t.addSelected(checked.size)}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              placeholder={c.search}
              value={contactSearch}
              onChange={(event) => setContactSearch(event.target.value)}
              leading={<Search className="size-4" />}
              containerClassName="flex-1"
            />
            <Select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)} containerClassName="w-40">
              <option value="all">{c.all}</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {filteredContacts.length === 0 && <p className="py-8 text-center text-sm text-ink-3">{c.noResults}</p>}
            {filteredContacts.map((contact) => {
              const isChecked = checked.has(contact.id)
              return (
                <label
                  key={contact.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors',
                    isChecked ? 'border-brand bg-brand-soft' : 'border-transparent hover:bg-sunken',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      setChecked((prev) => {
                        const next = new Set(prev)
                        if (next.has(contact.id)) next.delete(contact.id)
                        else next.add(contact.id)
                        return next
                      })
                    }
                    className="size-4 accent-(--x-brand)"
                  />
                  <span className="flex-1">
                    <span className="block text-[13px] font-medium text-ink">{contact.firstName} {contact.lastName}</span>
                    <span className="tnum block font-mono text-xs text-ink-3">{formatPhone(contact.phone)}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </Modal>
    </div>
  )
}
