/**
 * Domain models shared by feature repositories. When a real backend arrives,
 * these become the API response contracts.
 */

export type Operator = 'Ucell' | 'Beeline' | 'Mobiuz' | 'UMS' | 'Humans'

export interface Device {
  id: string
  name: string
  model: string
  phone: string
  operator: Operator
  status: 'online' | 'offline'
  battery: number
  /** 0..4 bars */
  signal: number
  androidVersion: string
  appVersion: string
  sentToday: number
  dailyLimit: number
  lastSeenAt: string
  isDefault: boolean
}

export type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'failed'

export interface SmsMessage {
  id: string
  to: string
  contactId?: string
  text: string
  status: MessageStatus
  deviceId: string
  segments: number
  createdAt: string
  deliveredAt?: string
  failReason?: 'no_signal' | 'invalid_number' | 'device_offline'
}

export interface ContactGroup {
  id: string
  name: string
  color: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  phone: string
  company?: string
  groupIds: string[]
  createdAt: string
}

export interface Template {
  id: string
  name: string
  text: string
  /** Placeholders like {ism}, {kod} extracted from text */
  variables: string[]
  usedCount: number
  updatedAt: string
}

export interface LocalizedText {
  uz: string
  ru: string
  en: string
}

export interface AppNotification {
  id: string
  kind: 'device' | 'billing' | 'system' | 'sms'
  severity: 'info' | 'success' | 'warn' | 'error'
  title: LocalizedText
  body: LocalizedText
  createdAt: string
  read: boolean
}

export interface Plan {
  id: 'start' | 'biznes' | 'korxona'
  monthlyPrice: number
  smsPerMonth: number
  maxDevices: number
  apiAccess: boolean
  prioritySupport: boolean
}

export interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  status: 'paid' | 'due' | 'failed'
  planId: Plan['id']
  period: string
}

export interface ApiKey {
  id: string
  name: string
  /** Only the prefix is ever shown again, like a real secret manager */
  prefix: string
  createdAt: string
  lastUsedAt?: string
  scopes: ('sms.send' | 'sms.read' | 'devices.read' | 'contacts.read')[]
}

export interface DailyStat {
  /** ISO date (YYYY-MM-DD) */
  date: string
  sent: number
  delivered: number
  failed: number
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  role: string
  avatarHue: number
  planId: Plan['id']
  createdAt: string
  timezone: string
}
