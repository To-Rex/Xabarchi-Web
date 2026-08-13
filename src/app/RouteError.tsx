import { Link, useRouteError } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { Button, Logo } from '@/shared/ui'

const dict = {
  uz: {
    title: 'Nimadir xato ketdi',
    body: "Sahifani yuklashda kutilmagan xatolik yuz berdi. Qayta yuklab ko'ring — muammo takrorlansa, biz bilan bog'laning.",
    reload: 'Qayta yuklash',
    home: 'Bosh sahifa',
  },
  ru: {
    title: 'Что-то пошло не так',
    body: 'При загрузке страницы произошла непредвиденная ошибка. Попробуйте перезагрузить — если повторится, свяжитесь с нами.',
    reload: 'Перезагрузить',
    home: 'На главную',
  },
  en: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred while loading the page. Try reloading — if it persists, contact us.',
    reload: 'Reload',
    home: 'Home',
  },
}

/** Router-level error boundary: catches render errors and failed lazy chunks. */
export function RouteError() {
  const t = useT(dict)
  const error = useRouteError()
  const detail = error instanceof Error ? error.message : null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Link to="/" aria-label="Xabarchi">
        <Logo />
      </Link>
      <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t.title}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">{t.body}</p>
      {detail && (
        <code className="mt-4 max-w-md break-all rounded-lg bg-sunken px-3 py-2 font-mono text-xs text-ink-3">{detail}</code>
      )}
      <div className="mt-8 flex gap-3">
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="size-4" />
          {t.reload}
        </Button>
        <Link to="/">
          <Button variant="secondary">{t.home}</Button>
        </Link>
      </div>
    </div>
  )
}
