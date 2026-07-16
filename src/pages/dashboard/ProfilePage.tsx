import { useState } from 'react'
import { motion } from 'motion/react'
import { BadgeCheck, KeyRound, Mail, Phone, Building2 } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatPhone } from '@/shared/lib/format'
import { simulate } from '@/shared/api/mockClient'
import { user } from '@/shared/mock/db'
import { Avatar, Badge, Button, Card, CardBody, CardHeader, CardTitle, Input, PageHeader, useToast } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Profil — Xabarchi',
    title: 'Profil',
    subtitle: "Shaxsiy ma'lumotlaringiz va xavfsizlik.",
    member: 'A’zo bo‘lgan sana',
    plan: 'Tarif',
    verified: 'Tasdiqlangan',
    personal: { title: "Shaxsiy ma'lumotlar", firstName: 'Ism', lastName: 'Familiya', email: 'Email', phone: 'Telefon', company: 'Kompaniya' },
    security: {
      title: 'Xavfsizlik',
      current: 'Joriy parol',
      newPass: 'Yangi parol',
      confirm: 'Yangi parolni takrorlang',
      change: 'Parolni almashtirish',
      errors: { current: 'Joriy parolni kiriting', newPass: 'Kamida 6 belgi', confirm: 'Parollar mos kelmadi' },
      changedToast: 'Parol almashtirildi',
    },
    savedToast: 'Profil saqlandi',
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<string, string>,
  },
  ru: {
    meta: 'Профиль — Xabarchi',
    title: 'Профиль',
    subtitle: 'Личные данные и безопасность.',
    member: 'Дата регистрации',
    plan: 'Тариф',
    verified: 'Подтверждён',
    personal: { title: 'Личные данные', firstName: 'Имя', lastName: 'Фамилия', email: 'Email', phone: 'Телефон', company: 'Компания' },
    security: {
      title: 'Безопасность',
      current: 'Текущий пароль',
      newPass: 'Новый пароль',
      confirm: 'Повторите новый пароль',
      change: 'Сменить пароль',
      errors: { current: 'Введите текущий пароль', newPass: 'Минимум 6 символов', confirm: 'Пароли не совпадают' },
      changedToast: 'Пароль изменён',
    },
    savedToast: 'Профиль сохранён',
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<string, string>,
  },
  en: {
    meta: 'Profile — Xabarchi',
    title: 'Profile',
    subtitle: 'Your personal details and security.',
    member: 'Member since',
    plan: 'Plan',
    verified: 'Verified',
    personal: { title: 'Personal details', firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone', company: 'Company' },
    security: {
      title: 'Security',
      current: 'Current password',
      newPass: 'New password',
      confirm: 'Repeat new password',
      change: 'Change password',
      errors: { current: 'Enter your current password', newPass: 'At least 6 characters', confirm: 'Passwords don’t match' },
      changedToast: 'Password changed',
    },
    savedToast: 'Profile saved',
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<string, string>,
  },
}

export default function ProfilePage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()

  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: formatPhone(user.phone),
    company: user.company,
  })
  const [saving, setSaving] = useState(false)

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; next?: string; confirm?: string }>({})
  const [changing, setChanging] = useState(false)

  const save = async () => {
    setSaving(true)
    await simulate(() => undefined, { minDelay: 450, maxDelay: 800 })
    setSaving(false)
    toast('success', t.savedToast)
  }

  const changePassword = async () => {
    const errors: typeof passwordErrors = {}
    if (!passwords.current) errors.current = t.security.errors.current
    if (passwords.next.length < 6) errors.next = t.security.errors.newPass
    if (passwords.next !== passwords.confirm) errors.confirm = t.security.errors.confirm
    setPasswordErrors(errors)
    if (Object.keys(errors).length > 0) return

    setChanging(true)
    await simulate(() => undefined, { minDelay: 600, maxDelay: 1000 })
    setChanging(false)
    setPasswords({ current: '', next: '', confirm: '' })
    toast('success', t.security.changedToast)
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={t.title} subtitle={t.subtitle} />

      {/* Identity card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card>
          <CardBody className="flex flex-wrap items-center gap-5">
            <Avatar name={`${user.firstName} ${user.lastName}`} hue={user.avatarHue} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-lg font-semibold text-ink">
                {form.firstName} {form.lastName}
                <Badge tone="ok">
                  <BadgeCheck className="size-3" />
                  {t.verified}
                </Badge>
              </p>
              <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-2">
                <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5 text-ink-3" />{form.email}</span>
                <span className="tnum inline-flex items-center gap-1.5 font-mono"><Phone className="size-3.5 text-ink-3" />{form.phone}</span>
                <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5 text-ink-3" />{form.company}</span>
              </p>
            </div>
            <div className="text-right text-[13px] text-ink-3">
              <p>{t.plan}: <span className="font-semibold text-brand">{t.planNames[user.planId]}</span></p>
              <p className="tnum mt-1">{t.member}: {formatDate(user.createdAt, lang)}</p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Personal details */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t.personal.title}</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 pt-3 sm:grid-cols-2">
          <Input label={t.personal.firstName} value={form.firstName} onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))} />
          <Input label={t.personal.lastName} value={form.lastName} onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))} />
          <Input label={t.personal.email} type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          <Input label={t.personal.phone} value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} inputMode="tel" />
          <Input label={t.personal.company} value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} containerClassName="sm:col-span-2" />
          <div className="flex justify-end sm:col-span-2">
            <Button loading={saving} onClick={save}>{c.save}</Button>
          </div>
        </CardBody>
      </Card>

      {/* Security */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4 text-brand" />
            {t.security.title}
          </CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 pt-3 sm:grid-cols-3">
          <Input
            label={t.security.current}
            type="password"
            value={passwords.current}
            onChange={(event) => setPasswords((prev) => ({ ...prev, current: event.target.value }))}
            error={passwordErrors.current}
            autoComplete="current-password"
          />
          <Input
            label={t.security.newPass}
            type="password"
            value={passwords.next}
            onChange={(event) => setPasswords((prev) => ({ ...prev, next: event.target.value }))}
            error={passwordErrors.next}
            autoComplete="new-password"
          />
          <Input
            label={t.security.confirm}
            type="password"
            value={passwords.confirm}
            onChange={(event) => setPasswords((prev) => ({ ...prev, confirm: event.target.value }))}
            error={passwordErrors.confirm}
            autoComplete="new-password"
          />
          <div className="flex justify-end sm:col-span-3">
            <Button variant="secondary" loading={changing} onClick={changePassword}>
              {t.security.change}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
