import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { BadgeCheck, KeyRound, Mail, MailWarning, Phone, Building2 } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatPhone } from '@/shared/lib/format'
import { api } from '@/shared/api/client'
import { updateProfile, useCurrentUser } from '@/features/auth/model/authStore'
import { Avatar, Badge, Button, Card, CardBody, CardHeader, CardTitle, Input, PageHeader, Skeleton, useToast } from '@/shared/ui'

const dict = {
  uz: {
    meta: 'Profil — Xabarchi',
    title: 'Profil',
    subtitle: "Shaxsiy ma'lumotlaringiz va xavfsizlik.",
    member: 'A’zo bo‘lgan sana',
    plan: 'Tarif',
    verified: 'Tasdiqlangan',
    unverified: 'Tasdiqlanmagan',
    resendVerify: 'Tasdiqlash xatini yuborish',
    verifySent: 'Tasdiqlash xati yuborildi',
    personal: { title: "Shaxsiy ma'lumotlar", firstName: 'Ism', lastName: 'Familiya', email: 'Email', phone: 'Telefon', company: 'Kompaniya' },
    security: {
      title: 'Xavfsizlik',
      hint: 'Parolni almashtirish uchun emailingizga tiklash havolasini yuboramiz.',
      send: 'Tiklash havolasini yuborish',
      sentToast: 'Havola emailingizga yuborildi',
    },
    savedToast: 'Profil saqlandi',
    saveFailed: 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.',
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<string, string>,
  },
  ru: {
    meta: 'Профиль — Xabarchi',
    title: 'Профиль',
    subtitle: 'Личные данные и безопасность.',
    member: 'Дата регистрации',
    plan: 'Тариф',
    verified: 'Подтверждён',
    unverified: 'Не подтверждён',
    resendVerify: 'Отправить письмо подтверждения',
    verifySent: 'Письмо подтверждения отправлено',
    personal: { title: 'Личные данные', firstName: 'Имя', lastName: 'Фамилия', email: 'Email', phone: 'Телефон', company: 'Компания' },
    security: {
      title: 'Безопасность',
      hint: 'Для смены пароля мы отправим ссылку сброса на ваш email.',
      send: 'Отправить ссылку сброса',
      sentToast: 'Ссылка отправлена на ваш email',
    },
    savedToast: 'Профиль сохранён',
    saveFailed: 'Не удалось сохранить. Попробуйте ещё раз.',
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<string, string>,
  },
  en: {
    meta: 'Profile — Xabarchi',
    title: 'Profile',
    subtitle: 'Your personal details and security.',
    member: 'Member since',
    plan: 'Plan',
    verified: 'Verified',
    unverified: 'Unverified',
    resendVerify: 'Send verification e-mail',
    verifySent: 'Verification e-mail sent',
    personal: { title: 'Personal details', firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone', company: 'Company' },
    security: {
      title: 'Security',
      hint: 'To change your password we’ll e-mail you a reset link.',
      send: 'Send reset link',
      sentToast: 'Reset link sent to your e-mail',
    },
    savedToast: 'Profile saved',
    saveFailed: 'Could not save. Please try again.',
    planNames: { start: 'Start', biznes: 'Biznes', korxona: 'Korxona' } as Record<string, string>,
  },
}

export default function ProfilePage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()
  const user = useCurrentUser()

  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', company: '' })
  const [saving, setSaving] = useState(false)
  const [sendingReset, setSendingReset] = useState(false)
  const [sendingVerify, setSendingVerify] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        company: user.company,
      })
    }
  }, [user])

  if (!user) {
    return (
      <div className="max-w-3xl">
        <PageHeader title={t.title} subtitle={t.subtitle} />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="mt-5 h-64 rounded-2xl" />
      </div>
    )
  }

  const save = async () => {
    setSaving(true)
    try {
      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.replace(/\D/g, ''),
        company: form.company.trim(),
      })
      toast('success', t.savedToast)
    } catch {
      toast('error', t.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  const sendReset = async () => {
    setSendingReset(true)
    try {
      await api('/auth/password/forgot', { method: 'POST', body: { email: user.email }, auth: false })
      toast('success', t.security.sentToast)
    } catch {
      toast('error', t.saveFailed)
    } finally {
      setSendingReset(false)
    }
  }

  const resendVerification = async () => {
    setSendingVerify(true)
    try {
      await api('/auth/email/resend', { method: 'POST' })
      toast('success', t.verifySent)
    } catch {
      toast('error', t.saveFailed)
    } finally {
      setSendingVerify(false)
    }
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
                {user.emailVerified ? (
                  <Badge tone="ok">
                    <BadgeCheck className="size-3" />
                    {t.verified}
                  </Badge>
                ) : (
                  <Badge tone="gold">
                    <MailWarning className="size-3" />
                    {t.unverified}
                  </Badge>
                )}
              </p>
              <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-2">
                <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5 text-ink-3" />{user.email}</span>
                <span className="tnum inline-flex items-center gap-1.5 font-mono"><Phone className="size-3.5 text-ink-3" />{formatPhone(form.phone)}</span>
                <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5 text-ink-3" />{form.company}</span>
              </p>
              {!user.emailVerified && (
                <Button variant="ghost" size="sm" className="mt-2 -ml-2" loading={sendingVerify} onClick={resendVerification}>
                  {t.resendVerify}
                </Button>
              )}
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
          <Input label={t.personal.email} type="email" value={user.email} disabled />
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
        <CardBody className="flex flex-wrap items-center justify-between gap-4 pt-3">
          <p className="text-sm text-ink-2">{t.security.hint}</p>
          <Button variant="secondary" loading={sendingReset} onClick={sendReset}>
            {t.security.send}
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
