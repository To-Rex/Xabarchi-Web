import { api } from '@/shared/api/client'
import type { Page, Plan } from '@/shared/api/types'

/** Admin-panel API — every call requires the signed-in user to be an admin. */

export interface AdminOverview {
  totalUsers: number
  paidUsers: number
  totalDevices: number
  onlineDevices: number
  messagesToday: number
  messagesMonth: number
  deliveredMonth: number
  totalBots: number
  revenueMonth: number
  planCounts: Record<string, number>
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  role: string
  planId: 'start' | 'biznes' | 'korxona'
  planActive: boolean
  planExpiresAt: string | null
  emailVerified: boolean
  isAdmin: boolean
  smsSentThisMonth: number
  deviceCount: number
  createdAt: string
  deletedAt: string | null
}

export interface AdminDevice {
  id: string
  name: string
  model: string
  phone: string
  operator: string
  status: string
  battery: number
  signal: number
  sentToday: number
  dailyLimit: number
  lastSeenAt: string | null
  ownerEmail: string
  ownerCompany: string
}

export interface AdminInvoice {
  id: string
  number: string
  date: string
  amount: number
  status: string
  planId: string
  period: string
  ownerEmail: string
  ownerCompany: string
}

export interface AdminUserPatch {
  planId?: 'start' | 'biznes' | 'korxona'
  planExpiresAt?: string | null
  emailVerified?: boolean
  role?: string
}

export function fetchOverview(): Promise<AdminOverview> {
  return api<AdminOverview>('/admin/overview')
}

export function fetchUsers(search: string, page = 1, pageSize = 20, deleted = false): Promise<Page<AdminUser>> {
  return api<Page<AdminUser>>('/admin/users', { query: { search: search || undefined, deleted: deleted || undefined, page, pageSize } })
}

export function updateUser(id: string, patch: AdminUserPatch): Promise<AdminUser> {
  return api<AdminUser>(`/admin/users/${id}`, { method: 'PATCH', body: patch })
}

export function deleteUser(id: string): Promise<void> {
  return api(`/admin/users/${id}`, { method: 'DELETE' })
}

export function resetQuota(id: string): Promise<AdminUser> {
  return api<AdminUser>(`/admin/users/${id}/reset-quota`, { method: 'POST' })
}

export function restoreUser(id: string): Promise<AdminUser> {
  return api<AdminUser>(`/admin/users/${id}/restore`, { method: 'POST' })
}

export interface NotifyPayload {
  title: string
  body: string
  severity: 'info' | 'success' | 'warn' | 'error'
}

export function notifyUser(id: string, payload: NotifyPayload): Promise<void> {
  return api(`/admin/users/${id}/notify`, { method: 'POST', body: payload })
}

export function fetchDevices(page = 1, pageSize = 30): Promise<Page<AdminDevice>> {
  return api<Page<AdminDevice>>('/admin/devices', { query: { page, pageSize } })
}

export function fetchInvoices(page = 1, pageSize = 30): Promise<Page<AdminInvoice>> {
  return api<Page<AdminInvoice>>('/admin/invoices', { query: { page, pageSize } })
}

export function fetchPlans(): Promise<Plan[]> {
  return api<Plan[]>('/admin/plans')
}

export interface PlanPatch {
  monthlyPrice?: number
  smsPerMonth?: number
  maxDevices?: number
  apiAccess?: boolean
  prioritySupport?: boolean
  syncToPolar?: boolean
}

export interface PlanSync {
  plan: Plan
  polarSync: string
}

export function updatePlan(id: string, patch: PlanPatch): Promise<PlanSync> {
  return api<PlanSync>(`/admin/plans/${id}`, { method: 'PATCH', body: patch })
}

export interface Discount {
  id: string
  name: string
  code?: string | null
  type: string
  basisPoints?: number
  amount?: number
  currency?: string
  duration?: string
}

export interface DiscountPayload {
  name: string
  kind: 'percentage' | 'fixed'
  value: number
  code?: string
  duration: 'once' | 'forever' | 'repeating'
  planId?: 'biznes' | 'korxona'
}

export function fetchDiscounts(): Promise<Discount[]> {
  return api<Discount[]>('/admin/discounts')
}

export function createDiscount(payload: DiscountPayload): Promise<Discount> {
  return api<Discount>('/admin/discounts', { method: 'POST', body: payload })
}
