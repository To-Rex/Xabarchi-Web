import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { DispatchPath } from '@/shared/ui'
import { useCurrentUser, useIsAuthenticated } from '@/features/auth/model/authStore'
import { MarketingLayout } from './layouts/MarketingLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { RouteError } from './RouteError'

const HomePage = lazy(() => import('@/pages/marketing/HomePage'))
const MobileAppPage = lazy(() => import('@/pages/marketing/MobileAppPage'))
const PricingPage = lazy(() => import('@/pages/marketing/PricingPage'))
const FaqPage = lazy(() => import('@/pages/marketing/FaqPage'))
const DocsPage = lazy(() => import('@/pages/marketing/DocsPage'))
const ContactPage = lazy(() => import('@/pages/marketing/ContactPage'))
const TermsPage = lazy(() => import('@/pages/marketing/TermsPage'))
const PrivacyPage = lazy(() => import('@/pages/marketing/PrivacyPage'))

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'))
const AuthCallbackPage = lazy(() => import('@/pages/auth/AuthCallbackPage'))
const DemoPage = lazy(() => import('@/pages/auth/DemoPage'))

const OverviewPage = lazy(() => import('@/pages/dashboard/OverviewPage'))
const SmsPage = lazy(() => import('@/pages/dashboard/SmsPage'))
const TelegramPage = lazy(() => import('@/pages/dashboard/TelegramPage'))
const ComposePage = lazy(() => import('@/pages/dashboard/ComposePage'))
const DevicesPage = lazy(() => import('@/pages/dashboard/DevicesPage'))
const ContactsPage = lazy(() => import('@/pages/dashboard/ContactsPage'))
const TemplatesPage = lazy(() => import('@/pages/dashboard/TemplatesPage'))
const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage'))
const ApiPage = lazy(() => import('@/pages/dashboard/ApiPage'))
const BillingPage = lazy(() => import('@/pages/dashboard/BillingPage'))
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'))
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'))
const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage'))
const HelpPage = lazy(() => import('@/pages/dashboard/HelpPage'))
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminDevicesPage = lazy(() => import('@/pages/admin/AdminDevicesPage'))
const AdminPlansPage = lazy(() => import('@/pages/admin/AdminPlansPage'))
const AdminDiscountsPage = lazy(() => import('@/pages/admin/AdminDiscountsPage'))
const AdminInvoicesPage = lazy(() => import('@/pages/admin/AdminInvoicesPage'))

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function FullScreenLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <DispatchPath className="w-52 opacity-80" />
    </div>
  )
}

function Boundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<FullScreenLoader />}>{children}</Suspense>
}

function RequireAuth({ children }: { children: ReactNode }) {
  const authed = useIsAuthenticated()
  const location = useLocation()
  if (!authed) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const authed = useIsAuthenticated()
  const user = useCurrentUser()
  const location = useLocation()
  if (!authed) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user === null) return <FullScreenLoader /> // profile still loading
  if (!user.isAdmin) return <Navigate to="/app" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Boundary><HomePage /></Boundary> },
      { path: '/mobile', element: <Boundary><MobileAppPage /></Boundary> },
      { path: '/pricing', element: <Boundary><PricingPage /></Boundary> },
      { path: '/faq', element: <Boundary><FaqPage /></Boundary> },
      { path: '/docs', element: <Boundary><DocsPage /></Boundary> },
      { path: '/contact', element: <Boundary><ContactPage /></Boundary> },
      { path: '/terms', element: <Boundary><TermsPage /></Boundary> },
      { path: '/privacy', element: <Boundary><PrivacyPage /></Boundary> },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/login', element: <Boundary><LoginPage /></Boundary> },
      { path: '/register', element: <Boundary><RegisterPage /></Boundary> },
      { path: '/forgot-password', element: <Boundary><ForgotPasswordPage /></Boundary> },
      { path: '/reset-password', element: <Boundary><ResetPasswordPage /></Boundary> },
      { path: '/verify-email', element: <Boundary><VerifyEmailPage /></Boundary> },
      { path: '/auth/callback', element: <Boundary><AuthCallbackPage /></Boundary> },
      { path: '/demo', element: <Boundary><DemoPage /></Boundary> },
    ],
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Boundary><OverviewPage /></Boundary> },
      { path: 'sms', element: <Boundary><SmsPage /></Boundary> },
      { path: 'sms/new', element: <Boundary><ComposePage /></Boundary> },
      { path: 'telegram', element: <Boundary><TelegramPage /></Boundary> },
      { path: 'devices', element: <Boundary><DevicesPage /></Boundary> },
      { path: 'contacts', element: <Boundary><ContactsPage /></Boundary> },
      { path: 'templates', element: <Boundary><TemplatesPage /></Boundary> },
      { path: 'analytics', element: <Boundary><AnalyticsPage /></Boundary> },
      { path: 'api', element: <Boundary><ApiPage /></Boundary> },
      { path: 'billing', element: <Boundary><BillingPage /></Boundary> },
      { path: 'settings', element: <Boundary><SettingsPage /></Boundary> },
      { path: 'profile', element: <Boundary><ProfilePage /></Boundary> },
      { path: 'notifications', element: <Boundary><NotificationsPage /></Boundary> },
      { path: 'help', element: <Boundary><HelpPage /></Boundary> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Boundary><AdminOverviewPage /></Boundary> },
      { path: 'users', element: <Boundary><AdminUsersPage /></Boundary> },
      { path: 'devices', element: <Boundary><AdminDevicesPage /></Boundary> },
      { path: 'plans', element: <Boundary><AdminPlansPage /></Boundary> },
      { path: 'discounts', element: <Boundary><AdminDiscountsPage /></Boundary> },
      { path: 'invoices', element: <Boundary><AdminInvoicesPage /></Boundary> },
    ],
  },
  { path: '*', element: <Boundary><NotFoundPage /></Boundary>, errorElement: <RouteError /> },
])
