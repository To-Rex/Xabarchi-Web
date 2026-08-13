import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import QRCode from 'qrcode'
import { BatteryFull, BatteryLow, BatteryMedium, CheckCircle2, MoreVertical, Plus, Smartphone, Star, Trash2 } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatNumber, formatPhone, formatRelative } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import type { Device } from '@/shared/api/types'
import { Badge, Button, Card, Dropdown, DropdownItem, EmptyState, Modal, PageHeader, ProgressBar, Skeleton, Spinner, useToast } from '@/shared/ui'
import { fetchDevices, removeDevice, setDefaultDevice, startPairing } from '@/features/devices/api/repository'
import { onRealtimeEvent } from '@/features/realtime/socket'

const dict = {
  uz: {
    meta: 'Qurilmalar — Xabarchi',
    title: 'Qurilmalar',
    subtitle: 'SMS shlyuz sifatida ishlayotgan telefonlaringiz.',
    add: "Qurilma qo'shish",
    defaultBadge: 'Asosiy',
    makeDefault: 'Asosiy qilish',
    disconnect: 'Uzish',
    battery: 'Batareya',
    signal: 'Signal',
    todayLoad: 'Bugungi yuklama',
    lastSeen: "So'nggi aloqa",
    version: 'Ilova versiyasi',
    empty: "Hali qurilma ulanmagan",
    emptyBody: "Android telefoningizga Xabarchi ilovasini o'rnating va QR kod orqali ulang.",
    qr: {
      title: "Qurilma qo'shish",
      step1: 'Android telefoningizda Xabarchi ilovasini oching',
      step2: '«Qurilma ulash» bo‘limida QR skannerini tanlang',
      step3: 'Quyidagi kodni skanerlang',
      codeLabel: 'Ulanish kodi',
      expires: (s: number) => `Kod ${s} soniyadan keyin yangilanadi`,
      waiting: 'Ulanish kutilmoqda…',
      found: 'Qurilma topildi!',
      connected: (name: string) => `${name} muvaffaqiyatli ulandi`,
    },
    confirmRemove: (name: string) => `«${name}» qurilmasini uzmoqchimisiz? Navbatdagi xabarlar boshqa qurilmaga o'tkaziladi.`,
    removedToast: 'Qurilma uzildi',
    defaultToast: 'Asosiy qurilma yangilandi',
    pairedToast: 'Qurilma ulandi',
  },
  ru: {
    meta: 'Устройства — Xabarchi',
    title: 'Устройства',
    subtitle: 'Телефоны, работающие как ваши SMS-шлюзы.',
    add: 'Добавить устройство',
    defaultBadge: 'Основное',
    makeDefault: 'Сделать основным',
    disconnect: 'Отключить',
    battery: 'Батарея',
    signal: 'Сигнал',
    todayLoad: 'Нагрузка за сегодня',
    lastSeen: 'Последняя связь',
    version: 'Версия приложения',
    empty: 'Устройства ещё не подключены',
    emptyBody: 'Установите приложение Xabarchi на Android-телефон и подключите его по QR-коду.',
    qr: {
      title: 'Добавить устройство',
      step1: 'Откройте приложение Xabarchi на Android-телефоне',
      step2: 'В разделе «Подключить устройство» выберите QR-сканер',
      step3: 'Отсканируйте код ниже',
      codeLabel: 'Код подключения',
      expires: (s: number) => `Код обновится через ${s} сек`,
      waiting: 'Ожидание подключения…',
      found: 'Устройство найдено!',
      connected: (name: string) => `${name} успешно подключено`,
    },
    confirmRemove: (name: string) => `Отключить устройство «${name}»? Сообщения из очереди перейдут на другое устройство.`,
    removedToast: 'Устройство отключено',
    defaultToast: 'Основное устройство обновлено',
    pairedToast: 'Устройство подключено',
  },
  en: {
    meta: 'Devices — Xabarchi',
    title: 'Devices',
    subtitle: 'The phones working as your SMS gateways.',
    add: 'Add device',
    defaultBadge: 'Default',
    makeDefault: 'Make default',
    disconnect: 'Disconnect',
    battery: 'Battery',
    signal: 'Signal',
    todayLoad: 'Today’s load',
    lastSeen: 'Last seen',
    version: 'App version',
    empty: 'No devices connected yet',
    emptyBody: 'Install the Xabarchi app on an Android phone and pair it with a QR code.',
    qr: {
      title: 'Add device',
      step1: 'Open the Xabarchi app on your Android phone',
      step2: 'Choose the QR scanner under “Connect device”',
      step3: 'Scan the code below',
      waiting: 'Waiting for connection…',
      found: 'Device found!',
      connected: (name: string) => `${name} connected successfully`,
    },
    confirmRemove: (name: string) => `Disconnect “${name}”? Queued messages will be rerouted to another device.`,
    removedToast: 'Device disconnected',
    defaultToast: 'Default device updated',
    pairedToast: 'Device connected',
  },
}

function SignalBars({ level }: { level: number }) {
  return (
    <span className="inline-flex items-end gap-0.5" aria-label={`${level}/4`}>
      {[1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className={cn('w-1 rounded-sm', bar <= level ? 'bg-brand' : 'bg-line-2')}
          style={{ height: 4 + bar * 3 }}
        />
      ))}
    </span>
  )
}

function BatteryIcon({ level }: { level: number }) {
  if (level <= 25) return <BatteryLow className="size-4 text-gold" />
  if (level <= 60) return <BatteryMedium className="size-4 text-ink-2" />
  return <BatteryFull className="size-4 text-ok" />
}

export default function DevicesPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()

  const { data, loading, error, refetch } = useAsync(fetchDevices)
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrStage, setQrStage] = useState<'waiting' | 'found'>('waiting')
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [pairedName, setPairedName] = useState('')
  const [removing, setRemoving] = useState<Device | null>(null)
  const [busy, setBusy] = useState(false)

  const list = devices ?? data

  // Real QR pairing: mint a short-lived code, render it, renew on expiry,
  // and wait for the phone's `device.paired` event over the WebSocket.
  useEffect(() => {
    if (!qrOpen) {
      setQrStage('waiting')
      setQrImage(null)
      return
    }
    let cancelled = false
    let doneTimer: ReturnType<typeof setTimeout> | null = null

    const requestCode = async () => {
      try {
        const pair = await startPairing()
        if (cancelled) return null
        const image = await QRCode.toDataURL(pair.qrPayload, { margin: 1, width: 352 })
        if (cancelled) return null
        setQrImage(image)
        return pair.expiresIn
      } catch {
        if (!cancelled) {
          setQrOpen(false)
          toast('error', c.errorTitle)
        }
        return null
      }
    }

    let renewTimer: ReturnType<typeof setTimeout> | null = null
    const cycle = async () => {
      const expiresIn = await requestCode()
      // Renew a little before the code dies so the QR never goes stale.
      if (expiresIn && !cancelled) renewTimer = setTimeout(cycle, Math.max(10, expiresIn - 10) * 1000)
    }
    void cycle()

    const unsubscribe = onRealtimeEvent((event) => {
      if (event.event !== 'device.paired') return
      const device = event.data as unknown as Device
      setPairedName(device.name)
      setQrStage('found')
      doneTimer = setTimeout(async () => {
        setDevices(await fetchDevices())
        setQrOpen(false)
        toast('success', t.pairedToast, t.qr.connected(device.name))
      }, 1600)
    })

    return () => {
      cancelled = true
      if (renewTimer) clearTimeout(renewTimer)
      if (doneTimer) clearTimeout(doneTimer)
      unsubscribe()
    }
  }, [qrOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const makeDefault = async (device: Device) => {
    setBusy(true)
    try {
      setDevices(await setDefaultDevice(device.id))
      toast('success', t.defaultToast, device.name)
    } catch {
      toast('error', c.errorTitle)
    } finally {
      setBusy(false)
    }
  }

  const confirmRemove = async () => {
    if (!removing) return
    setBusy(true)
    try {
      setDevices(await removeDevice(removing.id))
      setRemoving(null)
      toast('info', t.removedToast)
    } catch {
      toast('error', c.errorTitle)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button onClick={() => setQrOpen(true)}>
            <Plus className="size-4" />
            {t.add}
          </Button>
        }
      />

      {error ? (
        <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
      ) : loading && !list ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : !list || list.length === 0 ? (
        <EmptyState
          icon={<Smartphone />}
          title={t.empty}
          body={t.emptyBody}
          action={
            <Button onClick={() => setQrOpen(true)}>
              <Plus className="size-4" />
              {t.add}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {list.map((device, index) => {
              const load = device.sentToday / device.dailyLimit
              const online = device.status === 'online'
              return (
                <motion.div
                  key={device.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <Card className={cn('h-full transition-shadow hover:shadow-pop', !online && 'opacity-80')}>
                    <div className="flex items-start justify-between p-5 pb-0">
                      <div className="flex items-center gap-3">
                        <span className={cn('relative flex size-11 items-center justify-center rounded-xl', online ? 'bg-brand-soft text-brand' : 'bg-sunken text-ink-3')}>
                          <Smartphone className="size-5" />
                          <span
                            className={cn(
                              'absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface',
                              online ? 'bg-ok' : 'bg-ink-3',
                            )}
                          />
                        </span>
                        <div>
                          <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                            {device.name}
                            {device.isDefault && <Star className="size-3.5 fill-gold text-gold" />}
                          </p>
                          <p className="text-[13px] text-ink-3">{device.model}</p>
                        </div>
                      </div>
                      <Dropdown
                        width="w-48"
                        trigger={() => (
                          <span className="inline-flex size-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-sunken hover:text-ink">
                            <MoreVertical className="size-4" />
                          </span>
                        )}
                      >
                        {(close) => (
                          <>
                            {!device.isDefault && (
                              <DropdownItem icon={<Star />} onClick={() => { close(); makeDefault(device) }}>
                                {t.makeDefault}
                              </DropdownItem>
                            )}
                            <DropdownItem danger icon={<Trash2 />} onClick={() => { close(); setRemoving(device) }}>
                              {t.disconnect}
                            </DropdownItem>
                          </>
                        )}
                      </Dropdown>
                    </div>

                    <div className="space-y-3.5 p-5">
                      <div className="flex items-center justify-between gap-2 text-[13px]">
                        <span className="tnum font-mono text-ink-2">{formatPhone(device.phone)}</span>
                        <span className="flex flex-wrap justify-end gap-1.5">
                          {device.connection === 'realtime' && <Badge tone="brand">Realtime</Badge>}
                          {device.connection === 'polling' && <Badge tone="gold">Polling</Badge>}
                          <Badge tone={online ? 'ok' : 'neutral'}>{online ? c.online : c.offline}</Badge>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 rounded-xl border border-line p-3">
                        <div className="text-center">
                          <p className="flex items-center justify-center gap-1"><BatteryIcon level={online ? device.battery : 0} /></p>
                          <p className="tnum mt-1 text-[13px] font-semibold text-ink">{online ? `${device.battery}%` : '—'}</p>
                          <p className="text-[10.5px] text-ink-3">{t.battery}</p>
                        </div>
                        <div className="border-x border-line text-center">
                          <p className="flex h-4 items-end justify-center"><SignalBars level={online ? device.signal : 0} /></p>
                          <p className="mt-1 text-[13px] font-semibold text-ink">{device.operator}</p>
                          <p className="text-[10.5px] text-ink-3">{t.signal}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] leading-4 text-ink-3">v{device.appVersion}</p>
                          <p className="mt-1 text-[13px] font-semibold text-ink">A{device.androidVersion}</p>
                          <p className="text-[10.5px] text-ink-3">{t.version}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-ink-2">{t.todayLoad}</span>
                          <span className="tnum font-medium text-ink">
                            {formatNumber(device.sentToday, lang)} / {formatNumber(device.dailyLimit, lang)}
                          </span>
                        </div>
                        <ProgressBar value={load} tone={load > 0.9 ? 'danger' : load > 0.7 ? 'gold' : 'brand'} className="mt-2" />
                      </div>

                      <p className="text-xs text-ink-3">
                        {t.lastSeen}: <span className="tnum">{device.lastSeenAt ? formatRelative(device.lastSeenAt, lang) : '—'}</span>
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* QR pairing modal */}
      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title={t.qr.title} closeLabel={c.close} size="sm">
        <div className="flex flex-col items-center text-center">
          <ol className="w-full space-y-2 text-left text-[13px] text-ink-2">
            {[t.qr.step1, t.qr.step2, t.qr.step3].map((step, index) => (
              <li key={step} className="flex gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="relative mt-5">
            <AnimatePresence mode="wait">
              {qrStage === 'waiting' ? (
                <motion.div key="qr" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative overflow-hidden rounded-xl border border-line">
                  {qrImage ? (
                    <img src={qrImage} alt="QR" className="size-44 rounded-lg bg-white p-1.5" />
                  ) : (
                    <div className="flex size-44 items-center justify-center rounded-lg bg-white">
                      <Spinner className="size-6" />
                    </div>
                  )}
                  {/* scanline */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-2 h-0.5 rounded-full bg-brand shadow-[0_0_12px_var(--x-brand)]"
                    animate={{ top: ['8%', '88%', '8%'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="found"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="flex size-44 flex-col items-center justify-center gap-3 rounded-xl bg-ok-soft"
                >
                  <CheckCircle2 className="size-12 text-ok" />
                  <p className="px-4 text-sm font-semibold text-ok">{t.qr.found}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-3">
            {qrStage === 'waiting' && <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />}
            {qrStage === 'waiting' ? t.qr.waiting : t.qr.connected(pairedName)}
          </p>
        </div>
      </Modal>

      {/* Disconnect confirm */}
      <Modal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title={c.confirmDeleteTitle}
        closeLabel={c.close}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoving(null)}>{c.cancel}</Button>
            <Button variant="danger" loading={busy} onClick={confirmRemove}>
              <Trash2 className="size-4" />
              {t.disconnect}
            </Button>
          </>
        }
      >
        {removing && <p className="text-sm leading-relaxed text-ink-2">{t.confirmRemove(removing.name)}</p>}
      </Modal>
    </div>
  )
}
