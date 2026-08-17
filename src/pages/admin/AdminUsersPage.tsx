import { useState } from 'react'
import { BadgeCheck, Bell, MailCheck, RotateCcw, Search, Shield, Smartphone, Trash2, Undo2 } from 'lucide-react'
import { useLang } from '@/shared/i18n'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatNumber } from '@/shared/lib/format'
import {
  deleteUser,
  fetchUsers,
  notifyUser,
  resetQuota,
  restoreUser,
  updateUser,
  type AdminUser,
  type AdminUserPatch,
} from '@/features/admin/api/repository'
import { Avatar, Badge, Button, Card, CardBody, EmptyState, Input, Modal, Skeleton, Switch, Textarea, useToast } from '@/shared/ui'

const PLANS = ['start', 'biznes', 'korxona'] as const

export default function AdminUsersPage() {
  usePageMeta('Admin — Foydalanuvchilar')
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [showDeleted, setShowDeleted] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [version, setVersion] = useState(0)

  const { data, loading, error, refetch } = useAsync(() => fetchUsers(query, page, 20, showDeleted), [query, page, showDeleted, version])
  const users = data?.items ?? []
  const total = data?.total ?? 0
  const pageSize = 20
  const pages = Math.max(1, Math.ceil(total / pageSize))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(search.trim())
    setPage(1)
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Foydalanuvchilar</h1>
          <p className="mt-0.5 text-sm text-ink-2">Jami: {formatNumber(total, lang)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[13px] text-ink-2">
            <Switch checked={showDeleted} onChange={(v) => { setShowDeleted(v); setPage(1) }} />
            O‘chirilganlar
          </label>
          <form onSubmit={submit} className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Email, kompaniya, ism, telefon…"
              leading={<Search className="size-4" />}
              containerClassName="w-64"
            />
            <Button type="submit" variant="secondary">Qidirish</Button>
          </form>
        </div>
      </div>

      {error ? (
        <EmptyState title="Xatolik" body="Ro‘yxatni yuklab bo‘lmadi." action={<Button onClick={refetch}>Qayta urinish</Button>} />
      ) : loading && !data ? (
        <div className="space-y-2.5">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : users.length === 0 ? (
        <EmptyState icon={<Search />} title="Topilmadi" body="So‘rovingizga mos foydalanuvchi yo‘q." />
      ) : (
        <div className="space-y-2.5">
          {users.map((u) => (
            <Card key={u.id}>
              <CardBody className="flex flex-wrap items-center gap-4">
                <Avatar name={`${u.firstName} ${u.lastName}`} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink">
                    {u.firstName} {u.lastName}
                    {u.isAdmin && <Badge tone="brand"><Shield className="size-3" /> Admin</Badge>}
                    {u.deletedAt && <Badge tone="danger">o‘chirilgan</Badge>}
                    {u.emailVerified ? <BadgeCheck className="size-4 text-ok" /> : <Badge tone="gold">tasdiqlanmagan</Badge>}
                  </p>
                  <p className="tnum truncate text-[13px] text-ink-3">{u.email} · {u.company}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge tone={u.planActive ? 'ok' : 'neutral'}>{u.planId}{u.planActive ? ' · faol' : ''}</Badge>
                  <p className="tnum text-[11px] text-ink-3">
                    <Smartphone className="mr-0.5 inline size-3" />{u.deviceCount} · {formatNumber(u.smsSentThisMonth, lang)} SMS/oy
                  </p>
                </div>
                <div className="text-right text-[11px] text-ink-3">
                  <p className="tnum">{formatDate(u.createdAt, lang)}</p>
                  <Button variant="ghost" size="sm" className="mt-1" onClick={() => setEditing(u)}>Boshqarish</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Oldingi</Button>
          <span className="tnum text-sm text-ink-2">{page} / {pages}</span>
          <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Keyingi</Button>
        </div>
      )}

      {editing && (
        <EditUserModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); setVersion((v) => v + 1) }}
        />
      )}
    </div>
  )
}

function EditUserModal({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: () => void }) {
  const { lang } = useLang()
  const toast = useToast()
  const [planId, setPlanId] = useState<AdminUser['planId']>(user.planId)
  const [expiresAt, setExpiresAt] = useState<string | null>(user.planExpiresAt)
  const [emailVerified, setEmailVerified] = useState(user.emailVerified)
  const [isAdmin, setIsAdmin] = useState(user.isAdmin)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notifyTitle, setNotifyTitle] = useState('')
  const [notifyBody, setNotifyBody] = useState('')
  const [notifySeverity, setNotifySeverity] = useState<'info' | 'success' | 'warn' | 'error'>('info')

  const extend = (days: number) => setExpiresAt(new Date(Date.now() + days * 864e5).toISOString())

  const doReset = async () => {
    setBusy(true)
    try { await resetQuota(user.id); toast('success', 'Kvota nolga tushirildi'); onSaved() }
    catch { toast('error', 'Bajarilmadi'); setBusy(false) }
  }

  const doRestore = async () => {
    setBusy(true)
    try { await restoreUser(user.id); toast('success', 'Foydalanuvchi tiklandi'); onSaved() }
    catch { toast('error', 'Bajarilmadi'); setBusy(false) }
  }

  const sendNotify = async () => {
    if (!notifyTitle.trim() || !notifyBody.trim()) return
    setBusy(true)
    try {
      await notifyUser(user.id, { title: notifyTitle.trim(), body: notifyBody.trim(), severity: notifySeverity })
      toast('success', 'Xabar yuborildi')
      setNotifyTitle(''); setNotifyBody('')
      setBusy(false)
    } catch { toast('error', 'Yuborilmadi'); setBusy(false) }
  }

  const save = async () => {
    setBusy(true)
    try {
      const patch: AdminUserPatch = { planId, planExpiresAt: expiresAt, emailVerified, role: isAdmin ? 'admin' : 'owner' }
      await updateUser(user.id, patch)
      toast('success', 'Saqlandi')
      onSaved()
    } catch {
      toast('error', 'Saqlab bo‘lmadi')
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await deleteUser(user.id)
      toast('info', 'Foydalanuvchi o‘chirildi')
      onSaved()
    } catch {
      toast('error', 'O‘chirib bo‘lmadi')
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`${user.firstName} ${user.lastName}`}
      closeLabel="Yopish"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Bekor</Button>
          <Button loading={busy} onClick={save}>Saqlash</Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="tnum -mt-1 text-[13px] text-ink-3">{user.email} · {user.company}</p>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-ink-2">Tarif</p>
          <div className="flex gap-1.5">
            {PLANS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlanId(p)}
                className={`flex-1 rounded-lg py-2 text-[13px] font-semibold capitalize transition-colors ${planId === p ? 'bg-brand text-brand-ink' : 'bg-sunken text-ink-2 hover:text-ink'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-ink-2">Obuna muddati</p>
          <p className="mb-2 text-[13px] text-ink">
            {expiresAt ? <>Tugaydi: <span className="tnum font-semibold">{formatDate(expiresAt, lang)}</span></> : <span className="text-ink-3">Muddatsiz (bepul/o‘chiq)</span>}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="secondary" onClick={() => extend(31)}>+31 kun</Button>
            <Button size="sm" variant="secondary" onClick={() => extend(365)}>+1 yil</Button>
            <Button size="sm" variant="ghost" onClick={() => setExpiresAt(null)}>Tugatish</Button>
          </div>
        </div>

        <div className="space-y-3 border-t border-line pt-4">
          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] text-ink"><MailCheck className="size-4 text-ok" /> Email tasdiqlangan</span>
            <Switch checked={emailVerified} onChange={setEmailVerified} />
          </label>
          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] text-ink"><Shield className="size-4 text-brand" /> Admin huquqi</span>
            <Switch checked={isAdmin} onChange={setIsAdmin} />
          </label>
        </div>

        {/* quick actions */}
        <div className="border-t border-line pt-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-3">Amallar</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" loading={busy} onClick={doReset}>
              <RotateCcw className="size-4" /> Oylik kvotani nolga ({formatNumber(user.smsSentThisMonth, lang)})
            </Button>
          </div>
        </div>

        {/* send a notification */}
        <div className="border-t border-line pt-4">
          <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-3"><Bell className="size-3.5" /> Xabar yuborish</p>
          <div className="space-y-2">
            <Input placeholder="Sarlavha" value={notifyTitle} onChange={(e) => setNotifyTitle(e.target.value)} />
            <Textarea placeholder="Matn" rows={2} value={notifyBody} onChange={(e) => setNotifyBody(e.target.value)} />
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1">
                {(['info', 'success', 'warn', 'error'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNotifySeverity(s)}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold capitalize transition-colors ${notifySeverity === s ? 'bg-brand text-brand-ink' : 'bg-sunken text-ink-2'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button size="sm" loading={busy} disabled={!notifyTitle.trim() || !notifyBody.trim()} onClick={sendNotify}>Yuborish</Button>
            </div>
          </div>
        </div>

        {/* restore or delete */}
        <div className="border-t border-line pt-4">
          {user.deletedAt ? (
            <Button variant="secondary" size="sm" loading={busy} onClick={doRestore}>
              <Undo2 className="size-4" /> Foydalanuvchini tiklash
            </Button>
          ) : confirmDelete ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-danger-soft p-3">
              <span className="text-[13px] text-danger">Rostdan o‘chirasizmi?</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>Yo‘q</Button>
                <Button size="sm" variant="danger" loading={busy} onClick={remove}>Ha, o‘chir</Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="text-danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" /> Foydalanuvchini o‘chirish
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
