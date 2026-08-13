import { api } from '@/shared/api/client'
import type { Invoice, Plan } from '@/shared/api/types'

export function fetchPlans(): Promise<Plan[]> {
  return api<Plan[]>('/billing/plans')
}

export function fetchInvoices(): Promise<Invoice[]> {
  return api<Invoice[]>('/billing/invoices')
}

/** Polar checkout: returns the hosted payment page URL to redirect to. */
export async function startCheckout(planId: Plan['id']): Promise<string> {
  const result = await api<{ url: string }>('/billing/checkout', { method: 'POST', body: { planId } })
  return result.url
}

/** Polar customer portal (manage subscription / payment methods). */
export async function openPortal(): Promise<string> {
  const result = await api<{ url: string }>('/billing/portal')
  return result.url
}
