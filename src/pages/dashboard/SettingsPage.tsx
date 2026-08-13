import { useEffect, useState, type ReactNode } from 'react'
import { Globe, Palette, Send } from 'lucide-react'
import { LANGS, useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { useAsync } from '@/shared/lib/useAsync'
import { storageGet, storageSet } from '@/shared/lib/storage'
import { api } from '@/shared/api/client'
import { cn } from '@/shared/lib/cn'
import { Button, Card, CardBody, CardHeader, CardTitle, Input, PageHeader, Select, Switch, ThemeSegmented, useToast } from '@/shared/ui'
import { fetchDevices, setDefaultDevice as apiSetDefaultDevice } from '@/features/devices/api/repository'

const dict = {
  uz: {
    meta: 'Sozlamalar — Xabarchi',
    title: 'Sozlamalar',
    subtitle: 'Ko‘rinish, tilni va yuborish qoidalarini boshqaring.',
    appearance: { title: 'Ko‘rinish', theme: 'Mavzu', themeLabels: { light: 'Yorug‘', dark: 'Tungi', system: 'Tizim' }, lang: 'Interfeys tili' },
    sending: {
      title: 'Yuborish',
      defaultDevice: 'Asosiy qurilma',
      noDevices: 'Qurilma ulanmagan',
      dailyLimit: 'Kunlik limit (asosiy qurilma)',
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
    savedToast: 'Sozlamalar saqlandi',
    saveFailed: 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.',
  },
  ru: {
    meta: 'Настройки — Xabarchi',
    title: 'Настройки',
    subtitle: 'Управляйте видом, языком и правилами отправки.',
    appearance: { title: 'Внешний вид', theme: 'Тема', themeLabels: { light: 'Светлая', dark: 'Тёмная', system: 'Системная' }, lang: 'Язык интерфейса' },
    sending: {
      title: 'Отправка',
      defaultDevice: 'Основное устройство',
      noDevices: 'Устройство не подключено',
      dailyLimit: 'Дневной лимит (основное устройство)',
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
    savedToast: 'Настройки сохранены',
    saveFailed: 'Не удалось сохранить. Попробуйте ещё раз.',
  },
  en: {
    meta: 'Settings — Xabarchi',
    title: 'Settings',
    subtitle: 'Manage appearance, language and sending rules.',
    appearance: { title: 'Appearance', theme: 'Theme', themeLabels: { light: 'Light', dark: 'Dark', system: 'System' }, lang: 'Interface language' },
    sending: {
      title: 'Sending',
      defaultDevice: 'Default device',
      noDevices: 'No device connected',
      dailyLimit: 'Daily limit (default device)',
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
    savedToast: 'Settings saved',
    saveFailed: 'Could not save. Please try again.',
  },
}

/** Client-side preferences (retry/quiet-hours/notification toggles). */
const PREFS_KEY = 'xabarchi:prefs'

interface Prefs {
  retry: boolean
  quietHours: boolean
  notifyOffline: boolean
  notifyBattery: boolean
  notifyQuota: boolean
  notifyEmail: boolean
}

function loadPrefs(): Prefs {
  try {
    return { retry: true, quietHours: false, notifyOffline: true, notifyBattery: true, notifyQuota: true, notifyEmail: false, ...JSON.parse(storageGet(PREFS_KEY) ?? '{}') }
  } catch {
    return { retry: true, quietHours: false, notifyOffline: true, notifyBattery: true, notifyQuota: true, notifyEmail: false }
  }
}

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

  const { data: devices } = useAsync(fetchDevices)
  const [defaultDevice, setDefaultDevice] = useState('')
  const [dailyLimit, setDailyLimit] = useState('')
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!devices || devices.length === 0) return
    const current = devices.find((device) => device.isDefault) ?? devices[0]
    setDefaultDevice((prev) => prev || current.id)
    setDailyLimit((prev) => prev || String(current.dailyLimit))
  }, [devices])

  const setPref = (key: keyof Prefs) => (value: boolean) => setPrefs((prev) => ({ ...prev, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      storageSet(PREFS_KEY, JSON.stringify(prefs))
      if (defaultDevice) {
        const wasDefault = devices?.find((device) => device.isDefault)?.id
        if (wasDefault !== defaultDevice) await apiSetDefaultDevice(defaultDevice)
        const limit = Number(dailyLimit)
        if (Number.isFinite(limit) && limit >= 1) {
          await api(`/devices/${defaultDevice}`, { method: 'PATCH', body: { dailyLimit: Math.min(limit, 100_000) } })
        }
      }
      toast('success', t.savedToast)
    } catch {
      toast('error', t.saveFailed)
    } finally {
      setSaving(false)
    }
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
                devices && devices.length > 0 ? (
                  <Select value={defaultDevice} onChange={(event) => setDefaultDevice(event.target.value)} containerClassName="w-56" aria-label={t.sending.defaultDevice}>
                    {devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <span className="text-[13px] text-ink-3">{t.sending.noDevices}</span>
                )
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
            <SettingRow label={t.sending.retry} hint={t.sending.retryHint} control={<Switch checked={prefs.retry} onChange={setPref('retry')} label={t.sending.retry} />} />
            <SettingRow
              label={t.sending.quietHours}
              hint={t.sending.quietHoursHint}
              control={<Switch checked={prefs.quietHours} onChange={setPref('quietHours')} label={t.sending.quietHours} />}
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
            <SettingRow label={t.notifications.deviceOffline} control={<Switch checked={prefs.notifyOffline} onChange={setPref('notifyOffline')} label={t.notifications.deviceOffline} />} />
            <SettingRow label={t.notifications.lowBattery} control={<Switch checked={prefs.notifyBattery} onChange={setPref('notifyBattery')} label={t.notifications.lowBattery} />} />
            <SettingRow label={t.notifications.quota} control={<Switch checked={prefs.notifyQuota} onChange={setPref('notifyQuota')} label={t.notifications.quota} />} />
            <SettingRow label={t.notifications.email} control={<Switch checked={prefs.notifyEmail} onChange={setPref('notifyEmail')} label={t.notifications.email} />} />
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button loading={saving} onClick={save}>
            {c.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
