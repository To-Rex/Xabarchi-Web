import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/shared/lib/cn'

interface FieldShellProps {
  label?: string
  hint?: string
  error?: string
  id: string
  children: ReactNode
  className?: string
}

function FieldShell({ label, hint, error, id, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-ink-2">
          {label}
        </label>
      )}
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-[13px] text-danger"
            role="alert"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p className="text-[13px] text-ink-3">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

const inputBase =
  'w-full rounded-xl border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-3 transition-all duration-200 ' +
  'focus:outline-none focus:ring-4 disabled:opacity-55'

const inputTone = (error?: string) =>
  error
    ? 'border-danger focus:border-danger focus:ring-danger/15'
    : 'border-line-2 hover:border-ink-3 focus:border-brand focus:ring-brand/15'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leading?: ReactNode
  trailing?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leading, trailing, className, containerClassName, id: idProp, ...props },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} id={id} className={containerClassName}>
      <div className="relative">
        {leading && <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-3">{leading}</span>}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={cn(inputBase, inputTone(error), 'h-10', leading && 'pl-10', trailing && 'pr-10', className)}
          {...props}
        />
        {trailing && <span className="absolute inset-y-0 right-3 flex items-center text-ink-3">{trailing}</span>}
      </div>
    </FieldShell>
  )
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, containerClassName, id: idProp, ...props },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} id={id} className={containerClassName}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(inputBase, inputTone(error), 'min-h-24 resize-y py-2.5 leading-relaxed', className)}
        {...props}
      />
    </FieldShell>
  )
})

export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  containerClassName?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, containerClassName, id: idProp, children, ...props },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} id={id} className={containerClassName}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(inputBase, inputTone(error), 'h-10 appearance-none pr-9', className)}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </FieldShell>
  )
})
