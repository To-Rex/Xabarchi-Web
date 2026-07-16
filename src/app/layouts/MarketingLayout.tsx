import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib/cn'
import { CONTACT } from '@/shared/config/contact'
import { Button, LangSwitcher, Logo, ThemeToggle } from '@/shared/ui'

const dict = {
  uz: {
    nav: { product: 'Imkoniyatlar', pricing: 'Narxlar', docs: 'API hujjatlari', faq: 'Savollar', contact: 'Aloqa' },
    login: 'Kirish',
    cta: "Bepul boshlash",
    footer: {
      tagline: "O'z telefoningiz — o'z SMS shlyuzingiz.",
      product: 'Mahsulot',
      company: 'Kompaniya',
      about: 'Biz haqimizda',
      help: 'Yordam markazi',
      contact: 'Aloqa',
      legal: '© 2026 Xabarchi. Barcha huquqlar himoyalangan.',
      terms: 'Foydalanish shartlari',
      privacy: 'Maxfiylik siyosati',
    },
  },
  ru: {
    nav: { product: 'Возможности', pricing: 'Цены', docs: 'API документация', faq: 'Вопросы', contact: 'Контакты' },
    login: 'Войти',
    cta: 'Начать бесплатно',
    footer: {
      tagline: 'Ваш телефон — ваш SMS-шлюз.',
      product: 'Продукт',
      company: 'Компания',
      about: 'О нас',
      help: 'Центр помощи',
      contact: 'Контакты',
      legal: '© 2026 Xabarchi. Все права защищены.',
      terms: 'Условия использования',
      privacy: 'Политика конфиденциальности',
    },
  },
  en: {
    nav: { product: 'Features', pricing: 'Pricing', docs: 'API docs', faq: 'FAQ', contact: 'Contact' },
    login: 'Sign in',
    cta: 'Start for free',
    footer: {
      tagline: 'Your phone — your SMS gateway.',
      product: 'Product',
      company: 'Company',
      about: 'About us',
      help: 'Help center',
      contact: 'Contact',
      legal: '© 2026 Xabarchi. All rights reserved.',
      terms: 'Terms of service',
      privacy: 'Privacy policy',
    },
  },
}

export function MarketingLayout() {
  const t = useT(dict)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  const links = [
    { to: '/#features', label: t.nav.product, hash: true },
    { to: '/pricing', label: t.nav.pricing },
    { to: '/docs', label: t.nav.docs },
    { to: '/faq', label: t.nav.faq },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-xl' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/" aria-label="Xabarchi">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Asosiy">
            {links.map((link) =>
              link.hash ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-brand' : 'text-ink-2 hover:text-ink',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LangSwitcher compact />
            <ThemeToggle />
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink">
              {t.login}
            </Link>
            <Link to="/register">
              <Button size="sm">{t.cta}</Button>
            </Link>
          </div>

          <button
            className="rounded-lg p-2 text-ink md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-line bg-bg/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 pb-5 pt-2">
                {links.map((link) =>
                  link.hash ? (
                    <a key={link.to} href={link.to} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-2">
                      {link.label}
                    </a>
                  ) : (
                    <NavLink key={link.to} to={link.to} className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-2">
                      {link.label}
                    </NavLink>
                  ),
                )}
                <div className="mt-3 flex items-center gap-2">
                  <LangSwitcher compact />
                  <ThemeToggle />
                  <div className="flex-1" />
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-ink-2">
                    {t.login}
                  </Link>
                  <Link to="/register">
                    <Button size="sm">{t.cta}</Button>
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{t.footer.tagline}</p>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-ink-3">{t.footer.product}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="/#features" className="text-ink-2 transition-colors hover:text-brand">{t.nav.product}</a></li>
              <li><Link to="/pricing" className="text-ink-2 transition-colors hover:text-brand">{t.nav.pricing}</Link></li>
              <li><Link to="/docs" className="text-ink-2 transition-colors hover:text-brand">{t.nav.docs}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-ink-3">{t.footer.company}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/faq" className="text-ink-2 transition-colors hover:text-brand">{t.nav.faq}</Link></li>
              <li><Link to="/app/help" className="text-ink-2 transition-colors hover:text-brand">{t.footer.help}</Link></li>
              <li><Link to="/contact" className="text-ink-2 transition-colors hover:text-brand">{t.footer.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-ink-3">{t.footer.contact}</h4>
            <ul className="mt-3 space-y-2 font-mono text-sm text-ink-2">
              <li><a href={`tel:${CONTACT.phone}`} className="tnum transition-colors hover:text-brand">{CONTACT.phoneDisplay}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="break-all transition-colors hover:text-brand">{CONTACT.email}</a></li>
              <li>{CONTACT.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-[13px] text-ink-3">
            <span>{t.footer.legal}</span>
            <span className="flex gap-5">
              <a href="#" className="transition-colors hover:text-ink-2">{t.footer.terms}</a>
              <a href="#" className="transition-colors hover:text-ink-2">{t.footer.privacy}</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
