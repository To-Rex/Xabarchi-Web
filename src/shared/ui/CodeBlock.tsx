import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

/** Dark-on-both-themes code panel with copy-to-clipboard. */
export function CodeBlock({ code, title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-[#1d3138] bg-[#0a1418] text-[13px]', className)}>
      <div className="flex items-center justify-between border-b border-[#1d3138] px-4 py-2">
        <span className="font-mono text-xs text-[#63797f]">{title}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#9cb2b1] transition-colors hover:bg-[#16262d] hover:text-white"
        >
          {copied ? <Check className="size-3.5 text-[#2cc5b6]" /> : <Copy className="size-3.5" />}
          {copied ? 'OK' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono leading-relaxed text-[#d7e4e2]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
