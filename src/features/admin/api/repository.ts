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

export function fetchUsers(search: string, page = 1, pageSize = 20): Promise<Page<AdminUser>> {
  return api<Page<AdminUser>>('/admin/users', { query: { search: search || undefined, page, pageSize } })
}

export function updateUser(id: string, patch: AdminUserPatch): Promise<AdminUser> {
  return api<AdminUser>(`/admin/users/${id}`, { method: 'PATCH', body: patch })
}

export function deleteUser(id: string): Promise<void> {
  return api(`/admin/users/${id}`, { method: 'DELETE' })
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
}

export function updatePlan(id: string, patch: PlanPatch): Promise<Plan> {
  return api<Plan>(`/admin/plans/${id}`, { method: 'PATCH', body: patch })
}
