import { Link, NavLink, Outlet } from 'react-router-dom'
import { ArrowLeft, CreditCard, LayoutDashboard, Receipt, ShieldCheck, Smartphone, Ticket, Users } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button, LogoMark, ThemeToggle } from '@/shared/ui'
import { signOut, useCurrentUser } from '@/features/auth/model/authStore'

const NAV = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Umumiy' },
  { to: '/admin/users', icon: Users, label: 'Foydalanuvchilar' },
  { to: '/admin/devices', icon: Smartphone, label: 'Qurilmalar' },
  { to: '/admin/plans', icon: CreditCard, label: 'Tariflar' },
  { to: '/admin/discounts', icon: Ticket, label: 'Chegirmalar' },
  { to: '/admin/invoices', icon: Receipt, label: 'Hisob-fakturalar' },
]

export function AdminLayout() {
  const user = useCurrentUser()

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink">
              Xabarchi
              <span className="flex items-center gap-1 rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                <ShieldCheck className="size-3" />
                Admin
              </span>
            </span>
          </Link>
          <div className="flex-1" />
          <Link to="/app" className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:text-ink sm:flex">
            <ArrowLeft className="size-4" />
            Panelga qaytish
          </Link>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={signOut}>Chiqish</Button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-brand-soft text-brand-2 dark:text-brand' : 'text-ink-2 hover:bg-sunken hover:text-ink',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {user && !user.isAdmin ? null : <Outlet />}
      </main>
    </div>
  )
}
