import type { ReactNode } from 'react'
import { Reveal } from '@/shared/ui'

export interface LegalSection {
  h: string
  p: string[]
}

/** Shared layout for legal documents (Terms, Privacy) — matches FAQ page rhythm. */
export function LegalDoc({ icon, title, updated, intro, sections }: {
  icon: ReactNode
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <Reveal className="text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          {icon}
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="tnum mt-3 text-[13px] text-ink-3">{updated}</p>
      </Reveal>
      <Reveal className="mt-10">
        <p className="text-[15px] leading-relaxed text-ink-2">{intro}</p>
      </Reveal>
      <div className="mt-10 space-y-8">
        {sections.map((section, index) => (
          <Reveal key={section.h} delay={Math.min(index * 0.04, 0.24)}>
            <section>
              <h2 className="text-lg font-semibold tracking-tight text-ink">
                <span className="tnum mr-2 font-mono text-sm text-brand">{index + 1}.</span>
                {section.h}
              </h2>
              {section.p.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-ink-2">{paragraph}</p>
              ))}
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
