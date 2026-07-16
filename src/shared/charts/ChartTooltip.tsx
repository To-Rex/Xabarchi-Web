import type { ReactNode } from 'react'

interface Row {
  color?: string
  label: string
  value: ReactNode
}

/** Shared tooltip card for Recharts — identity dot + text in ink tokens. */
export function ChartTooltipCard({ title, rows }: { title: ReactNode; rows: Row[] }) {
  return (
    <div className="rounded-xl border border-line bg-raised px-3.5 py-2.5 shadow-pop">
      <p className="text-xs font-medium text-ink-3">{title}</p>
      <div className="mt-1.5 space-y-1">
        {rows.map((row) => (
          <p key={row.label} className="flex items-center gap-2 text-[13px]">
            {row.color && <span className="size-2 rounded-full" style={{ background: row.color }} />}
            <span className="text-ink-2">{row.label}</span>
            <span className="tnum ml-auto pl-4 font-semibold text-ink">{row.value}</span>
          </p>
        ))}
      </div>
    </div>
  )
}
