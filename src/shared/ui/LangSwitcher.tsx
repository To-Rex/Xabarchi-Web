import { Check, Languages } from 'lucide-react'
import { LANGS, useLang } from '@/shared/i18n'
import { cn } from '@/shared/lib/cn'
import { Dropdown, DropdownItem } from './Dropdown'

export function LangSwitcher({ compact }: { compact?: boolean }) {
  const { lang, setLang } = useLang()
  const current = LANGS.find((entry) => entry.code === lang)!

  return (
    <Dropdown
      width="w-44"
      trigger={(open) => (
        <span
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-xl border border-line px-3 text-[13px] font-medium text-ink-2',
            'transition-all duration-200 hover:border-line-2 hover:text-ink',
            open && 'border-brand text-ink shadow-glow',
          )}
        >
          <Languages className="size-4" />
          {compact ? current.code.toUpperCase() : current.label}
        </span>
      )}
    >
      {(close) =>
        LANGS.map((entry) => (
          <DropdownItem
            key={entry.code}
            active={entry.code === lang}
            onClick={() => {
              setLang(entry.code)
              close()
            }}
          >
            <span className="mr-1">{entry.flag}</span>
            <span className="flex-1">{entry.label}</span>
            {entry.code === lang && <Check className="size-4 text-brand" />}
          </DropdownItem>
        ))
      }
    </Dropdown>
  )
}
