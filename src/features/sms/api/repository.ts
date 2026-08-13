import { api } from '@/shared/api/client'
import type { Contact, Device, MessageStatus, Page, SmsMessage, SmsPriority } from '@/shared/api/types'

export interface MessagesQuery {
  status?: MessageStatus | 'all'
  search?: string
  page?: number
  pageSize?: number
}

export interface MessagesPage {
  items: SmsMessage[]
  total: number
  countsByStatus: Record<MessageStatus | 'all', number>
}

/**
 * Sync id → name lookups used while rendering message rows. Warmed before
 * `fetchMessages` resolves so the page renders with names in place.
 */
const deviceNames = new Map<string, string>()
const contactNames = new Map<string, string>()
let namesWarmed = false

async function warmNameCaches(): Promise<void> {
  if (namesWarmed) return
  try {
    const [devices, contacts] = await Promise.all([
      api<Device[]>('/devices'),
      api<Page<Contact>>('/contacts', { query: { pageSize: 200 } }),
    ])
    for (const device of devices) deviceNames.set(device.id, device.name)
    for (const contact of contacts.items) contactNames.set(contact.id, `${contact.firstName} ${contact.lastName}`)
    namesWarmed = true
  } catch { /* rows fall back to raw ids */ }
}

export async function fetchMessages(query: MessagesQuery = {}): Promise<MessagesPage> {
  const { status = 'all', search = '', page = 1, pageSize = 12 } = query
  const [result] = await Promise.all([
    api<MessagesPage>('/messages', {
      query: { status: status === 'all' ? undefined : status, search, page, pageSize },
    }),
    warmNameCaches(),
  ])
  return result
}

export interface SendPayload {
  to: string[]
  text: string
  deviceId?: string
  priority: SmsPriority
}

export function sendSms(payload: SendPayload): Promise<SmsMessage[]> {
  return api<SmsMessage[]>('/messages', {
    method: 'POST',
    body: {
      to: payload.to,
      text: payload.text,
      deviceId: payload.deviceId || undefined,
      priority: payload.priority,
    },
  })
}

/** Re-queue an existing message (same recipient, text, priority). */
export function resendSms(id: number): Promise<SmsMessage> {
  return api<SmsMessage>(`/messages/${id}/resend`, { method: 'POST' })
}

export function getDeviceName(deviceId?: string | null): string {
  if (!deviceId) return '—'
  return deviceNames.get(deviceId) ?? deviceId.slice(0, 8)
}

export function getContactName(contactId?: string | null): string | undefined {
  if (!contactId) return undefined
  return contactNames.get(contactId)
}
