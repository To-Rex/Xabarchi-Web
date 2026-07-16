import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Globe, Palette, Send, Trash2 } from 'lucide-react'
import { LANGS, useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { simulate } from '@/shared/api/mockClient'
import { devices } from '@/shared/mock/db'
import { cn } from '@/shared/lib/cn'
import { Button, Card, CardBody, CardHeader, CardTitle, Input, Modal, PageHeader, Select, Switch, ThemeSegmented, useToast } from '@/shared/ui'
import { signOut } from '@/features/auth/model/authStore'

const dict = {
  uz: {
    meta: 'Sozlamalar — Xabarchi',
    title: 'Sozlamalar',
    subtitle: 'Ko‘rinish, tilni va yuborish qoidalarini boshqaring.',
    appearance: { title: 'Ko‘rinish', theme: 'Mavzu', themeLabels: { light: 'Yorug‘', dark: 'Tungi', system: 'Tizim' }, lang: 'Interfeys tili' },
    sending: {
      title: 'Yuborish',
      defaultDevice: 'Asosiy qurilma',
      dailyLimit: 'Kunlik limit (har bir qurilma)',
      dailyLimitHint: 'Operator cheklovlaridan oshmaslik uchun',
      retry: 'Xato bo‘lsa qayta urinish',
      retryHint: "Yuborilmagan SMS 5 daqiqadan so'ng qayta yuboriladi",
      quietHours: 'Tungi soatlarda yubormaslik',
      quietHoursHint: '22:00 – 08:00 orasida xabarlar navbatda kutadi',
    },
    notifications: {
      title: 'Bildirishnomalar',
      deviceOffline: 'Qurilma uzilganda',
      lowBattery: 'Batareya kam qolganda',
      quota: 'Limit 80% ga yetganda',
      email: 'Email orqali ham yuborish',
    },
    danger: {
      title: 'Xavfli hudud',
      deleteAccount: "Hisobni o'chirish",
      deleteBody: "Barcha ma'lumotlar — xabarlar tarixi, kontaktlar, shablonlar — qaytarib bo'lmas tarzda o'chiriladi.",
      confirmBody: "Hisobingizni o'chirishni tasdiqlang. Bu amalni bekor qilib bo'lmaydi.",
      confirmWord: 'Tasdiqlash uchun «OCHIRISH» deb yozing',
      deletedToast: "Hisob o'chirildi (demo)",
    },
    savedToast: 'Sozlamalar saqlandi',
  },
  ru: {
    meta: 'Настройки — Xabarchi',
    title: 'Настройки',
    subtitle: 'Управляйте видом, языком и правилами отправки.',
    appearance: { title: 'Внешний вид', theme: 'Тема', themeLabels: { light: 'Светлая', dark: 'Тёмная', system: 'Системная' }, lang: 'Язык интерфейса' },
    sending: {
      title: 'Отправка',
      defaultDevice: 'Основное устройство',
      dailyLimit: 'Дневной лимит (на устройство)',
      dailyLimitHint: 'Чтобы не превышать ограничения оператора',
      retry: 'Повторять при ошибке',
      retryHint: 'Неотправленное SMS будет повторено через 5 минут',
      quietHours: 'Не отправлять ночью',
      quietHoursHint: 'С 22:00 до 08:00 сообщения ждут в очереди',
    },
    notifications: {
      title: 'Уведомления',
      deviceOffline: 'Устройство отключилось',
      lowBattery: 'Низкий заряд батареи',
      quota: 'Лимит достиг 80%',
      email: 'Дублировать на email',
    },
    danger: {
      title: 'Опасная зона',
      deleteAccount: 'Удалить аккаунт',
      deleteBody: 'Все данные — история сообщений, контакты, шаблоны — будут удалены безвозвратно.',
      confirmBody: 'Подтвердите удаление аккаунта. Это действие нельзя отменить.',
      confirmWord: 'Введите «УДАЛИТЬ» для подтверждения',
      deletedToast: 'Аккаунт удалён (демо)',
    },
    savedToast: 'Настройки сохранены',
  },
  en: {
    meta: 'Settings — Xabarchi',
    title: 'Settings',
    subtitle: 'Manage appearance, language and sending rules.',
    appearance: { title: 'Appearance', theme: 'Theme', themeLabels: { light: 'Light', dark: 'Dark', system: 'System' }, lang: 'Interface language' },
    sending: {
      title: 'Sending',
      defaultDevice: 'Default device',
      dailyLimit: 'Daily limit (per device)',
      dailyLimitHint: 'To stay under carrier restrictions',
      retry: 'Retry on failure',
      retryHint: 'An unsent SMS is retried after 5 minutes',
      quietHours: 'Don’t send at night',
      quietHoursHint: 'Between 22:00 and 08:00 messages wait in the queue',
    },
    notifications: {
      title: 'Notifications',
      deviceOffline: 'Device goes offline',
      lowBattery: 'Battery running low',
      quota: 'Quota reaches 80%',
      email: 'Also send by email',
    },
    danger: {
      title: 'Danger zone',
      deleteAccount: 'Delete account',
      deleteBody: 'All data — message history, contacts, templates — is deleted irreversibly.',
      confirmBody: 'Confirm deleting your account. This cannot be undone.',
      confirmWord: 'Type “DELETE” to confirm',
      deletedToast: 'Account deleted (demo)',
    },
    savedToast: 'Settings saved',
  },
}

const CONFIRM_WORDS = { uz: 'OCHIRISH', ru: 'УДАЛИТЬ', en: 'DELETE' }

function SettingRow({ label, hint, control }: { label: string; hint?: string; control: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint && <p className="mt-0.5 text-[13px] text-ink-3">{hint}</p>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

export default function SettingsPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang, setLang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()
  const navigate = useNavigate()

  const [defaultDevice, setDefaultDevice] = useState(devices.find((device) => device.isDefault)?.id ?? devices[0].id)
  const [dailyLimit, setDailyLimit] = useState('800')
  const [retry, setRetry] = useState(true)
  const [quietHours, setQuietHours] = useState(false)
  const [notifyOffline, setNotifyOffline] = useState(true)
  const [notifyBattery, setNotifyBattery] = useState(true)
  const [notifyQuota, setNotifyQuota] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const save = async () => {
    setSaving(true)
    await simulate(() => undefined, { minDelay: 400, maxDelay: 800 })
    setSaving(false)
    toast('success', t.savedToast)
  }

  const deleteAccount = async () => {
    setDeleting(true)
    await simulate(() => undefined, { minDelay: 700, maxDelay: 1200 })
    setDeleting(false)
    setDeleteOpen(false)
    toast('info', t.danger.deletedToast)
    signOut()
    navigate('/')
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <div className="space-y-5">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-4 text-brand" />
              {t.appearance.title}
            </CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-line pt-2">
            <SettingRow label={t.appearance.theme} control={<ThemeSegmented labels={t.appearance.themeLabels} />} />
            <SettingRow
              label={t.appearance.lang}
              control={
                <div className="flex gap-1.5" role="radiogroup" aria-label={t.appearance.lang}>
                  {LANGS.map((entry) => (
                    <button
                      key={entry.code}
                      role="radio"
                      aria-checked={lang === entry.code}
                      onClick={() => setLang(entry.code)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all',
                        lang === entry.code ? 'border-brand bg-brand-soft text-brand-2 dark:text-brand' : 'border-line text-ink-2 hover:border-line-2',
                      )}
                    >
                      {entry.flag} {entry.label}
                    </button>
                  ))}
                </div>
              }
            />
          </CardBody>
        </Card>

        {/* Sending */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="size-4 text-brand" />
              {t.sending.title}
            </CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-line pt-2">
            <SettingRow
              label={t.sending.defaultDevice}
              control={
                <Select value={defaultDevice} onChange={(event) => setDefaultDevice(event.target.value)} containerClassName="w-56" aria-label={t.sending.defaultDevice}>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </Select>
              }
            />
            <SettingRow
              label={t.sending.dailyLimit}
              hint={t.sending.dailyLimitHint}
              control={
                <Input
                  type="number"
                  value={dailyLimit}
                  onChange={(event) => setDailyLimit(event.target.value)}
                  containerClassName="w-28"
                  className="tnum text-right"
                  aria-label={t.sending.dailyLimit}
                />
              }
            />
            <SettingRow label={t.sending.retry} hint={t.sending.retryHint} control={<Switch checked={retry} onChange={setRetry} label={t.sending.retry} />} />
            <SettingRow
              label={t.sending.quietHours}
              hint={t.sending.quietHoursHint}
              control={<Switch checked={quietHours} onChange={setQuietHours} label={t.sending.quietHours} />}
            />
          </CardBody>
        </Card>

        {/* Notification prefs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-4 text-brand" />
              {t.notifications.title}
            </CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-line pt-2">
            <SettingRow label={t.notifications.deviceOffline} control={<Switch checked={notifyOffline} onChange={setNotifyOffline} label={t.notifications.deviceOffline} />} />
            <SettingRow label={t.notifications.lowBattery} control={<Switch checked={notifyBattery} onChange={setNotifyBattery} label={t.notifications.lowBattery} />} />
            <SettingRow label={t.notifications.quota} control={<Switch checked={notifyQuota} onChange={setNotifyQuota} label={t.notifications.quota} />} />
            <SettingRow label={t.notifications.email} control={<Switch checked={notifyEmail} onChange={setNotifyEmail} label={t.notifications.email} />} />
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button loading={saving} onClick={save}>
            {c.save}
          </Button>
        </div>

        {/* Danger zone */}
        <Card className="border-danger/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="size-4" />
              {t.danger.title}
            </CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap items-center justify-between gap-4 pt-3">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-2">{t.danger.deleteBody}</p>
            <Button variant="danger" onClick={() => { setConfirmText(''); setDeleteOpen(true) }}>
              <Trash2 className="size-4" />
              {t.danger.deleteAccount}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Delete confirm */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t.danger.deleteAccount}
        closeLabel={c.close}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>{c.cancel}</Button>
            <Button variant="danger" loading={deleting} disabled={confirmText.trim().toUpperCase() !== CONFIRM_WORDS[lang]} onClick={deleteAccount}>
              <Trash2 className="size-4" />
              {t.danger.deleteAccount}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-2">{t.danger.confirmBody}</p>
          <Input label={t.danger.confirmWord} value={confirmText} onChange={(event) => setConfirmText(event.target.value)} />
        </div>
      </Modal>
    </div>
  )
}
