import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { FileText, Pencil, Plus, Search, Send, Trash2 } from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { commonDict } from '@/shared/i18n/common'
import { useAsync } from '@/shared/lib/useAsync'
import { usePageMeta } from '@/shared/lib/usePageMeta'
import { formatDate, formatNumber, smsSegments } from '@/shared/lib/format'
import type { Template } from '@/shared/api/types'
import { Badge, Button, Card, EmptyState, Input, Modal, PageHeader, Skeleton, Textarea, useToast } from '@/shared/ui'
import { createTemplate, deleteTemplate, extractVariables, fetchTemplates, updateTemplate } from '@/features/templates/api/repository'

const dict = {
  uz: {
    meta: 'Shablonlar — Xabarchi',
    title: 'Shablonlar',
    subtitle: "Tayyor matnlar — {ism} kabi o'zgaruvchilar bilan.",
    add: 'Shablon yaratish',
    searchPlaceholder: 'Shablon nomi yoki matni bo‘yicha qidirish',
    used: (n: string) => `${n} marta ishlatilgan`,
    updated: 'Yangilangan',
    variables: "O'zgaruvchilar",
    use: 'Ishlatish',
    empty: 'Hali shablon yo‘q',
    emptyBody: "Tez-tez yuboriladigan matnlarni shablonga aylantiring — {ism} kabi o'zgaruvchilar avtomatik almashtiriladi.",
    form: {
      addTitle: 'Yangi shablon',
      editTitle: 'Shablonni tahrirlash',
      name: 'Nomi',
      text: 'Matn',
      textHint: "O'zgaruvchilarni jingalak qavsda yozing: {ism}, {kod}, {sana}",
      errors: { name: 'Nomini kiriting', text: 'Matnni kiriting' },
    },
    segments: 'segment',
    createdToast: 'Shablon yaratildi',
    updatedToast: 'Shablon yangilandi',
    deletedToast: "Shablon o'chirildi",
    confirmDelete: (name: string) => `«${name}» shablonini o'chirmoqchimisiz?`,
  },
  ru: {
    meta: 'Шаблоны — Xabarchi',
    title: 'Шаблоны',
    subtitle: 'Готовые тексты — с переменными вроде {имя}.',
    add: 'Создать шаблон',
    searchPlaceholder: 'Поиск по названию или тексту шаблона',
    used: (n: string) => `Использован ${n} раз`,
    updated: 'Обновлён',
    variables: 'Переменные',
    use: 'Использовать',
    empty: 'Шаблонов пока нет',
    emptyBody: 'Превратите частые тексты в шаблоны — переменные вроде {имя} подставятся автоматически.',
    form: {
      addTitle: 'Новый шаблон',
      editTitle: 'Изменить шаблон',
      name: 'Название',
      text: 'Текст',
      textHint: 'Переменные пишите в фигурных скобках: {имя}, {код}, {дата}',
      errors: { name: 'Введите название', text: 'Введите текст' },
    },
    segments: 'сегм.',
    createdToast: 'Шаблон создан',
    updatedToast: 'Шаблон обновлён',
    deletedToast: 'Шаблон удалён',
    confirmDelete: (name: string) => `Удалить шаблон «${name}»?`,
  },
  en: {
    meta: 'Templates — Xabarchi',
    title: 'Templates',
    subtitle: 'Ready-made texts — with variables like {name}.',
    add: 'Create template',
    searchPlaceholder: 'Search by template name or text',
    used: (n: string) => `Used ${n} times`,
    updated: 'Updated',
    variables: 'Variables',
    use: 'Use',
    empty: 'No templates yet',
    emptyBody: 'Turn your frequent texts into templates — variables like {name} get substituted automatically.',
    form: {
      addTitle: 'New template',
      editTitle: 'Edit template',
      name: 'Name',
      text: 'Text',
      textHint: 'Write variables in curly braces: {name}, {code}, {date}',
      errors: { name: 'Enter a name', text: 'Enter the text' },
    },
    segments: 'segments',
    createdToast: 'Template created',
    updatedToast: 'Template updated',
    deletedToast: 'Template deleted',
    confirmDelete: (name: string) => `Delete template “${name}”?`,
  },
}

/** Render template text with {variables} highlighted. */
function HighlightedText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let lastIndex = 0
  for (const match of text.matchAll(/\{(\w+)\}/g)) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(
      <span key={match.index} className="rounded-md bg-brand-soft px-1 py-0.5 font-mono text-[12px] font-medium text-brand-2 dark:text-brand">
        {match[0]}
      </span>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return <>{parts}</>
}

function useDebounced<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return debounced
}

export default function TemplatesPage() {
  const t = useT(dict)
  const c = useT(commonDict)
  const { lang } = useLang()
  usePageMeta(t.meta)
  const toast = useToast()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounced(search)
  const [version, setVersion] = useState(0)
  const { data, loading, error, refetch } = useAsync(() => fetchTemplates(debouncedSearch), [debouncedSearch, version])

  const [editing, setEditing] = useState<Template | 'new' | null>(null)
  const [form, setForm] = useState({ name: '', text: '' })
  const [formErrors, setFormErrors] = useState<{ name?: string; text?: string }>({})
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState<Template | null>(null)

  const liveVariables = useMemo(() => extractVariables(form.text), [form.text])
  const liveSegments = useMemo(() => smsSegments(form.text), [form.text])

  const openNew = () => {
    setForm({ name: '', text: '' })
    setFormErrors({})
    setEditing('new')
  }
  const openEdit = (template: Template) => {
    setForm({ name: template.name, text: template.text })
    setFormErrors({})
    setEditing(template)
  }

  const save = async () => {
    const errors: typeof formErrors = {}
    if (!form.name.trim()) errors.name = t.form.errors.name
    if (!form.text.trim()) errors.text = t.form.errors.text
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setBusy(true)
    if (editing === 'new') {
      await createTemplate(form)
      toast('success', t.createdToast, form.name)
    } else if (editing) {
      await updateTemplate(editing.id, form)
      toast('success', t.updatedToast)
    }
    setBusy(false)
    setEditing(null)
    setVersion((v) => v + 1)
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setBusy(true)
    await deleteTemplate(deleting.id)
    setBusy(false)
    setDeleting(null)
    toast('info', t.deletedToast)
    setVersion((v) => v + 1)
  }

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

      <Input
        placeholder={t.searchPlaceholder}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        leading={<Search className="size-4" />}
        aria-label={c.search}
        containerClassName="mb-5 max-w-md"
      />

      {error ? (
        <EmptyState title={c.errorTitle} body={c.errorBody} action={<Button onClick={refetch}>{c.retry}</Button>} />
      ) : loading || !data ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        debouncedSearch ? (
          <EmptyState icon={<Search />} title={c.noResults} body={c.noResultsBody} />
        ) : (
          <EmptyState icon={<FileText />} title={t.empty} body={t.emptyBody} action={<Button onClick={openNew}>{t.add}</Button>} />
        )
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {data.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Card className="flex h-full flex-col p-5 transition-shadow hover:shadow-pop">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-semibold text-ink">{template.name}</h3>
                    <span className="flex shrink-0 gap-0.5">
                      <button onClick={() => openEdit(template)} aria-label={c.edit} className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-sunken hover:text-ink">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => setDeleting(template)} aria-label={c.delete} className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger">
                        <Trash2 className="size-3.5" />
                      </button>
                    </span>
                  </div>

                  <p className="mt-3 flex-1 rounded-xl bg-sunken/70 p-3.5 text-[13px] leading-relaxed text-ink-2">
                    <HighlightedText text={template.text} />
                  </p>

                  {template.variables.length > 0 && (
                    <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-3">
                      {t.variables}:
                      {template.variables.map((variable) => (
                        <Badge key={variable} tone="brand" className="font-mono">{`{${variable}}`}</Badge>
                      ))}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
                    <div className="text-xs text-ink-3">
                      <p className="tnum">{t.used(formatNumber(template.usedCount, lang))}</p>
                      <p className="tnum mt-0.5">{t.updated}: {formatDate(template.updatedAt, lang)}</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => navigate('/app/sms/new', { state: { templateId: template.id } })}>
                      <Send className="size-3.5" />
                      {t.use}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
        <div className="space-y-4">
          <Input label={t.form.name} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} error={formErrors.name} />
          <Textarea
            label={t.form.text}
            hint={t.form.textHint}
            value={form.text}
            onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
            error={formErrors.text}
            rows={4}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
            <span className="tnum">{liveSegments.chars} / {liveSegments.segments} {t.segments}</span>
            {liveVariables.map((variable) => (
              <Badge key={variable} tone="brand" className="font-mono">{`{${variable}}`}</Badge>
            ))}
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
        {deleting && <p className="text-sm leading-relaxed text-ink-2">{t.confirmDelete(deleting.name)}</p>}
      </Modal>
    </div>
  )
}
