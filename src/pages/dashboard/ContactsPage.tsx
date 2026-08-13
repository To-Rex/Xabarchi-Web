import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Pencil, Plus, Search, Send, Trash2, UsersRound } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatPhone } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import type { Contact, ContactGroup } from '@/shared/api/types'
import { Avatar, Button, Card, EmptyState, Input, Modal, PageHeader, Skeleton, useToast } from '@/shared/ui'
import { createContact, deleteContact, fetchContacts, updateContact, type ContactInput } from '@/features/contacts/api/repository'

const dict = {
  uz: {
    meta: 'Kontaktlar — Xabarchi',
    title: 'Kontaktlar',
    subtitle: 'Mijozlar bazangiz — guruhlar bilan tartibda.',
    add: "Kontakt qo'shish",
    searchPlaceholder: 'Ism, raqam yoki kompaniya bo‘yicha qidirish',
    cols: { name: 'Ism', phone: 'Telefon', company: 'Kompaniya', groups: 'Guruhlar', added: "Qo'shilgan" },
    empty: 'Hali kontakt yo‘q',
    emptyBody: "Birinchi kontaktni qo'shing — ommaviy yuborishda ular qo'l keladi.",
    form: {
      addTitle: "Yangi kontakt",
      editTitle: 'Kontaktni tahrirlash',
      firstName: 'Ism',
      lastName: 'Familiya',
      phone: 'Telefon',
      company: 'Kompaniya',
      groups: 'Guruhlar',
      errors: { firstName: 'Ismni kiriting', phone: 'Raqam +998 bilan, 12 raqamdan iborat bo‘lsin' },
    },
    sendSms: 'SMS yuborish',
    createdToast: "Kontakt qo'shildi",
    updatedToast: 'Kontakt yangilandi',
    deletedToast: "Kontakt o'chirildi",
    confirmDelete: (name: string) => `«${name}» kontaktini o'chirmoqchimisiz?`,
  },
  ru: {
    meta: 'Контакты — Xabarchi',
    title: 'Контакты',
    subtitle: 'Ваша база клиентов — в порядке, с группами.',
    add: 'Добавить контакт',
    searchPlaceholder: 'Поиск по имени, номеру или компании',
    cols: { name: 'Имя', phone: 'Телефон', company: 'Компания', groups: 'Группы', added: 'Добавлен' },
    empty: 'Контактов пока нет',
    emptyBody: 'Добавьте первый контакт — они пригодятся при массовых рассылках.',
    form: {
      addTitle: 'Новый контакт',
      editTitle: 'Изменить контакт',
      firstName: 'Имя',
      lastName: 'Фамилия',
      phone: 'Телефон',
      company: 'Компания',
      groups: 'Группы',
      errors: { firstName: 'Введите имя', phone: 'Номер должен начинаться с +998 и содержать 12 цифр' },
    },
    sendSms: 'Отправить SMS',
    createdToast: 'Контакт добавлен',
    updatedToast: 'Контакт обновлён',
    deletedToast: 'Контакт удалён',
    confirmDelete: (name: string) => `Удалить контакт «${name}»?`,
  },
  en: {
    meta: 'Contacts — Xabarchi',
    title: 'Contacts',
    subtitle: 'Your customer base — tidy, with groups.',
    add: 'Add contact',
    searchPlaceholder: 'Search by name, number or company',
    cols: { name: 'Name', phone: 'Phone', company: 'Company', groups: 'Groups', added: 'Added' },
    empty: 'No contacts yet',
    emptyBody: 'Add your first contact — they come in handy for bulk sends.',
    form: {
      addTitle: 'New contact',
      editTitle: 'Edit contact',
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone',
      company: 'Company',
      groups: 'Groups',
      errors: { firstName: 'Enter a first name', phone: 'Numbers start with +998 and contain 12 digits' },
    },
    sendSms: 'Send SMS',
    createdToast: 'Contact added',
    updatedToast: 'Contact updated',
    deletedToast: 'Contact deleted',
    confirmDelete: (name: string) => `Delete contact “${name}”?`,
  },
}

function useDebounced<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return debounced
}

function GroupChips({ contact, groups }: { contact: Contact; groups: ContactGroup[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {contact.groupIds.map((groupId) => {
        const group = groups.find((entry) => entry.id === groupId)
        if (!group) return null
        return (
          <span
            key={groupId}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: `color-mix(in oklab, ${group.color} 12%, transparent)`, color: group.color }}
          >
            <span className="size-1.5 rounded-full" style={{ background: group.color }} />
            {group.name}
          </span>
        )
      })}
    </span>
  )
}

const emptyForm: ContactInput = { firstName: '', lastName: '', phone: '', company: '', groupIds: [] }

export default function ContactsPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const debouncedSearch = useDebounced(search)
  const [version, setVersion] = useState(0)

  const { data, loading, error, refetch } = useAsync(
    () => fetchContacts({ search: debouncedSearch, groupId: groupFilter }),
    [debouncedSearch, groupFilter, version],
  )

  const [editing, setEditing] = useState<Contact | 'new' | null>(null)
  const [form, setForm] = useState<ContactInput>(emptyForm)
  const [formErrors, setFormErrors] = useState<{ firstName?: string; phone?: string }>({})
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState<Contact | null>(null)

  const openNew = () => {
    setForm(emptyForm)
    setFormErrors({})
    setEditing('new')
  }
  const openEdit = (contact: Contact) => {
    setForm({ firstName: contact.firstName, lastName: contact.lastName, phone: contact.phone, company: contact.company ?? '', groupIds: contact.groupIds })
    setFormErrors({})
    setEditing(contact)
  }

  const save = async () => {
    const errors: typeof formErrors = {}
    if (form.firstName.trim().length < 2) errors.firstName = t.form.errors.firstName
    const digits = form.phone.replace(/\D/g, '')
    const phone = digits.length === 9 ? `998${digits}` : digits
    if (phone.length !== 12 || !phone.startsWith('998')) errors.phone = t.form.errors.phone
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setBusy(true)
    if (editing === 'new') {
      await createContact({ ...form, phone })
      toast('success', t.createdToast, `${form.firstName} ${form.lastName}`.trim())
    } else if (editing) {
      await updateContact(editing.id, { ...form, phone })
      toast('success', t.updatedToast)
    }
    setBusy(false)
    setEditing(null)
    setVersion((v) => v + 1)
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setBusy(true)
    await deleteContact(deleting.id)
    setBusy(false)
    setDeleting(null)
    toast('info', t.deletedToast)
    setVersion((v) => v + 1)
  }

  const groups = data?.groups ?? []
  const filters = useMemo(() => [{ id: 'all', name: c.all, color: 'var(--x-ink-2)' }, ...groups], [groups, c.all])

  return (
    <div>
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button onClick={openNew}>
            <Plus className="size-4" />
            {t.add}
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4">
          <Input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            leading={<Search className="size-4" />}
            aria-label={c.search}
            containerClassName="max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((group) => (
              <button
                key={group.id}
                onClick={() => setGroupFilter(group.id)}
                className={cn(
                  'rounded-full border px-3 py-1 text-[13px] font-medium transition-all',
                  groupFilter === group.id
                    ? 'border-brand bg-brand-soft text-brand-2 dark:text-brand'
                    : 'border-line text-ink-2 hover:border-line-2 hover:text-ink',
                )}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
        ) : loading || !data ? (
          <div className="space-y-2.5 p-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-13 w-full" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          debouncedSearch || groupFilter !== 'all' ? (
            <EmptyState icon={<Search />} title={c.noResults} body={c.noResultsBody} />
          ) : (
            <EmptyState icon={<UsersRound />} title={t.empty} body={t.emptyBody} action={<Button onClick={openNew}>{t.add}</Button>} />
          )
        ) : (
          <div className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {data.items.map((contact) => (
                <motion.div
                  key={contact.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="group flex items-center gap-4 px-5 py-3.5"
                >
                  <Avatar name={`${contact.firstName} ${contact.lastName}`} hue={(contact.id.charCodeAt(4) * 37) % 360} size="sm" />
                  <div className="w-44 min-w-0 shrink-0">
                    <p className="truncate text-sm font-semibold text-ink">{contact.firstName} {contact.lastName}</p>
                    {contact.company && <p className="truncate text-xs text-ink-3">{contact.company}</p>}
                  </div>
                  <span className="tnum hidden w-40 shrink-0 font-mono text-[13px] text-ink-2 sm:block">{formatPhone(contact.phone)}</span>
                  <span className="hidden min-w-0 flex-1 md:block">
                    <GroupChips contact={contact} groups={groups} />
                  </span>
                  <span className="tnum hidden shrink-0 text-xs text-ink-3 lg:block">{formatDate(contact.createdAt, lang)}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 max-lg:opacity-100">
                    <button
                      onClick={() => navigate('/app/sms/new')}
                      aria-label={t.sendSms}
                      title={t.sendSms}
                      className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-brand-soft hover:text-brand"
                    >
                      <Send className="size-4" />
                    </button>
                    <button
                      onClick={() => openEdit(contact)}
                      aria-label={c.edit}
                      title={c.edit}
                      className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-sunken hover:text-ink"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(contact)}
                      aria-label={c.delete}
                      title={c.delete}
                      className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Add / edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? t.form.addTitle : t.form.editTitle}
        closeLabel={c.close}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>{c.cancel}</Button>
            <Button loading={busy} onClick={save}>{c.save}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t.form.firstName}
            value={form.firstName}
            onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
            error={formErrors.firstName}
          />
          <Input label={t.form.lastName} value={form.lastName} onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))} />
          <Input
            label={t.form.phone}
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            error={formErrors.phone}
            placeholder="+998 90 123 45 67"
            inputMode="tel"
          />
          <Input
            label={`${t.form.company} (${c.optional})`}
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
          />
          <div className="sm:col-span-2">
            <p className="text-[13px] font-medium text-ink-2">{t.form.groups}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {groups.map((group) => {
                const active = form.groupIds.includes(group.id)
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        groupIds: active ? prev.groupIds.filter((id) => id !== group.id) : [...prev.groupIds, group.id],
                      }))
                    }
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium transition-all',
                      active ? 'border-transparent text-white' : 'border-line text-ink-2 hover:border-line-2',
                    )}
                    style={active ? { background: group.color } : undefined}
                  >
                    <span className="size-1.5 rounded-full" style={{ background: active ? '#fff' : group.color }} />
                    {group.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={c.confirmDeleteTitle}
        closeLabel={c.close}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>{c.cancel}</Button>
            <Button variant="danger" loading={busy} onClick={confirmDelete}>
              <Trash2 className="size-4" />
              {c.delete}
            </Button>
          </>
        }
      >
        {deleting && <p className="text-sm leading-relaxed text-ink-2">{t.confirmDelete(`${deleting.firstName} ${deleting.lastName}`)}</p>}
      </Modal>
    </div>
  )
}
