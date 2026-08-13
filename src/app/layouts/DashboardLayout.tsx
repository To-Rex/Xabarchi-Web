import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  Smartphone,
  UserRound,
  Users,
  FileText,
  X,
} from 'lucide-react'
import { useLang, useT } from '@/shared/i18n'
import { formatRelative } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { Avatar, Dropdown, DropdownItem, DropdownSeparator, LangSwitcher, Logo, LogoMark, ProgressBar, ThemeToggle } from '@/shared/ui'
import { signOut, useCurrentUser } from '@/features/auth/model/authStore'
import { markRead, useNotifications, useUnreadCount } from '@/features/notifications/model/store'

const dict = {
  uz: {
    nav: {
      overview: 'Boshqaruv paneli',
      sms: 'SMS xabarlar',
      telegram: 'Telegram bot',
      devices: 'Qurilmalar',
      contacts: 'Kontaktlar',
      templates: 'Shablonlar',
      analytics: 'Analitika',
      api: 'API',
      billing: "To'lovlar",
      settings: 'Sozlamalar',
      help: 'Yordam',
    },
    sections: { main: 'Asosiy', account: 'Hisob' },
    quota: { title: 'Oylik SMS limiti', used: 'ishlatildi' },
    upgrade: 'Tarifni oshirish',
    notifications: 'Bildirishnomalar',
    viewAll: "Barchasini ko'rish",
    empty: 'Yangi bildirishnoma yo‘q',
    profile: 'Profil',
    logout: 'Chiqish',
  },
  ru: {
    nav: {
      overview: 'Панель управления',
      sms: 'SMS сообщения',
      telegram: 'Telegram-бот',
      devices: 'Устройства',
      contacts: 'Контакты',
      templates: 'Шаблоны',
      analytics: 'Аналитика',
      api: 'API',
      billing: 'Платежи',
      settings: 'Настройки',
      help: 'Помощь',
    },
    sections: { main: 'Основное', account: 'Аккаунт' },
    quota: { title: 'Месячный лимит SMS', used: 'использовано' },
    upgrade: 'Повысить тариф',
    notifications: 'Уведомления',
    viewAll: 'Смотреть все',
    empty: 'Новых уведомлений нет',
    profile: 'Профиль',
    logout: 'Выйти',
  },
  en: {
    nav: {
      overview: 'Dashboard',
      sms: 'SMS messages',
      telegram: 'Telegram bot',
      devices: 'Devices',
      contacts: 'Contacts',
      templates: 'Templates',
      analytics: 'Analytics',
      api: 'API',
      billing: 'Billing',
      settings: 'Settings',
      help: 'Help',
    },
    sections: { main: 'Main', account: 'Account' },
    quota: { title: 'Monthly SMS limit', used: 'used' },
    upgrade: 'Upgrade plan',
    notifications: 'Notifications',
    viewAll: 'See all',
    empty: 'No new notifications',
    profile: 'Profile',
    logout: 'Sign out',
  },
}

const severityDot: Record<string, string> = {
  info: 'bg-info',
  success: 'bg-ok',
  warn: 'bg-gold',
  error: 'bg-danger',
}

function NavItem({ to, icon, label, end, onClick }: { to: string; icon: ReactNode; label: string; end?: boolean; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150',
          isActive ? 'text-brand-2 dark:text-brand' : 'text-ink-2 hover:bg-sunken hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              className="absolute inset-0 rounded-xl bg-brand-soft"
            />
          )}
          <span className="relative z-10 [&_svg]:size-[18px]">{icon}</span>
          <span className="relative z-10">{label}</span>
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const t = useT(dict)
  const { lang } = useLang()
  const used = 8000
  const limit = 10000

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Link to="/" aria-label="Xabarchi">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-3" aria-label={t.sections.main}>
        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3">{t.sections.main}</p>
          <div className="space-y-0.5">
            <NavItem to="/app" end icon={<LayoutDashboard />} label={t.nav.overview} onClick={onNavigate} />
            <NavItem to="/app/sms" icon={<MessageSquareText />} label={t.nav.sms} onClick={onNavigate} />
            <NavItem to="/app/telegram" icon={<Bot />} label={t.nav.telegram} onClick={onNavigate} />
            <NavItem to="/app/devices" icon={<Smartphone />} label={t.nav.devices} onClick={onNavigate} />
            <NavItem to="/app/contacts" icon={<Users />} label={t.nav.contacts} onClick={onNavigate} />
            <NavItem to="/app/templates" icon={<FileText />} label={t.nav.templates} onClick={onNavigate} />
            <NavItem to="/app/analytics" icon={<BarChart3 />} label={t.nav.analytics} onClick={onNavigate} />
            <NavItem to="/app/api" icon={<BookOpen />} label={t.nav.api} onClick={onNavigate} />
          </div>
        </div>
        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3">{t.sections.account}</p>
          <div className="space-y-0.5">
            <NavItem to="/app/billing" icon={<CreditCard />} label={t.nav.billing} onClick={onNavigate} />
            <NavItem to="/app/settings" icon={<Settings />} label={t.nav.settings} onClick={onNavigate} />
            <NavItem to="/app/help" icon={<LifeBuoy />} label={t.nav.help} onClick={onNavigate} />
          </div>
        </div>
      </nav>
      <div className="border-t border-line p-4">
        <div className="rounded-xl border border-line bg-sunken/60 p-3.5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-medium text-ink-2">{t.quota.title}</span>
            <span className="tnum font-semibold text-ink">80%</span>
          </div>
          <ProgressBar value={used / limit} tone={used / limit > 0.9 ? 'danger' : used / limit > 0.75 ? 'gold' : 'brand'} className="mt-2.5" />
          <p className="tnum mt-2 text-xs text-ink-3">
            {new Intl.NumberFormat(lang === 'en' ? 'en-GB' : lang === 'ru' ? 'ru-RU' : 'uz-Latn-UZ').format(used)} / {new Intl.NumberFormat(lang === 'en' ? 'en-GB' : lang === 'ru' ? 'ru-RU' : 'uz-Latn-UZ').format(limit)} {t.quota.used}
          </p>
          <Link
            to="/app/billing"
            onClick={onNavigate}
            className="mt-3 block rounded-lg bg-brand px-3 py-1.5 text-center text-[13px] font-medium text-brand-ink transition-all hover:bg-brand-2"
          >
            {t.upgrade}
          </Link>
        </div>
      </div>
    </div>
  )
}

function NotificationsBell() {
  const t = useT(dict)
  const { lang } = useLang()
  const items = useNotifications()
  const unread = useUnreadCount()
  const navigate = useNavigate()
  const recent = items.slice(0, 4)

  return (
    <Dropdown
      width="w-[340px]"
      trigger={(open) => (
        <span
          className={cn(
            'relative inline-flex size-9 items-center justify-center rounded-xl border border-line text-ink-2',
            'transition-all duration-200 hover:border-line-2 hover:text-ink',
            open && 'border-brand text-ink',
          )}
          aria-label={t.notifications}
        >
          <Bell className="size-4" />
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="tnum absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white"
            >
              {unread}
            </motion.span>
          )}
        </span>
      )}
    >
      {(close) => (
        <div>
          <p className="px-3 pb-1.5 pt-2 text-[13px] font-semibold text-ink">{t.notifications}</p>
          {recent.length === 0 && <p className="px-3 py-6 text-center text-[13px] text-ink-3">{t.empty}</p>}
          {recent.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                markRead(item.id)
                close()
                navigate('/app/notifications')
              }}
              className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-sunken"
            >
              <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', severityDot[item.severity], item.read && 'opacity-25')} />
              <span className="min-w-0 flex-1">
                <span className={cn('block truncate text-[13px]', item.read ? 'font-normal text-ink-2' : 'font-semibold text-ink')}>
                  {item.title[lang]}
                </span>
                <span className="block truncate text-xs text-ink-3">{item.body[lang]}</span>
                <span className="mt-0.5 block text-[11px] text-ink-3">{formatRelative(item.createdAt, lang)}</span>
              </span>
            </button>
          ))}
          <DropdownSeparator />
          <button
            onClick={() => {
              close()
              navigate('/app/notifications')
            }}
            className="w-full rounded-lg px-3 py-2 text-center text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft"
          >
            {t.viewAll}
          </button>
        </div>
      )}
    </Dropdown>
  )
}

export function DashboardLayout() {
  const t = useT(dict)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = useCurrentUser()

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden dark:bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-surface lg:hidden"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-ink-3 hover:bg-sunken hover:text-ink"
                aria-label="×"
              >
                <X className="size-5" />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-xl sm:px-6">
          <button className="rounded-lg p-2 text-ink-2 hover:bg-sunken lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Menu">
            <Menu className="size-5" />
          </button>
          <Link to="/" className="lg:hidden" aria-label="Xabarchi">
            <LogoMark className="size-7" />
          </Link>
          <div className="flex-1" />
          <LangSwitcher compact />
          <ThemeToggle />
          <NotificationsBell />
          <Dropdown
            width="w-52"
            trigger={(open) => (
              <span className={cn('block rounded-full ring-2 ring-transparent transition-all', open && 'ring-brand')}>
                <Avatar name={user ? `${user.firstName} ${user.lastName}` : '·'} hue={user?.avatarHue ?? 172} size="sm" />
              </span>
            )}
          >
            {(close) => (
              <>
                <div className="px-3 py-2">
                  <p className="text-[13px] font-semibold text-ink">{user ? `${user.firstName} ${user.lastName}` : '…'}</p>
                  <p className="truncate text-xs text-ink-3">{user?.email}</p>
                </div>
                <DropdownSeparator />
                <DropdownItem icon={<UserRound />} onClick={() => { close(); navigate('/app/profile') }}>
                  {t.profile}
                </DropdownItem>
                <DropdownItem icon={<Settings />} onClick={() => { close(); navigate('/app/settings') }}>
                  {t.nav.settings}
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  danger
                  icon={<LogOut />}
                  onClick={() => {
                    close()
                    signOut()
                    navigate('/')
                  }}
                >
                  {t.logout}
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-6xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
