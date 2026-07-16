import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type ToastTone = 'success' | 'error' | 'warn' | 'info'

interface ToastItem {
  id: number
  tone: ToastTone
  title: string
  body?: string
}

interface ToastContextValue {
  toast: (tone: ToastTone, title: string, body?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 className="size-5 text-ok" />,
  error: <XCircle className="size-5 text-danger" />,
  warn: <AlertTriangle className="size-5 text-gold" />,
  info: <Info className="size-5 text-info" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (tone: ToastTone, title: string, body?: string) => {
      const id = ++idRef.current
      setItems((prev) => [...prev.slice(-3), { id, tone, title, body }])
      setTimeout(() => dismiss(id), 4600)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-5 sm:items-end sm:pr-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                className={cn(
                  'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line',
                  'bg-raised p-3.5 shadow-pop',
                )}
                role="status"
              >
                <span className="mt-px shrink-0">{toneIcon[item.tone]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  {item.body && <p className="mt-0.5 text-[13px] leading-snug text-ink-2">{item.body}</p>}
                </div>
                <button
                  onClick={() => dismiss(item.id)}
                  className="rounded-md p-1 text-ink-3 transition-colors hover:bg-sunken hover:text-ink"
                  aria-label="×"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.toast
}
