/**
 * API response contracts — mirror the backend DTOs (CamelModel wire format).
 * Source of truth: Xabarchi-Backend app/schemas/*.
 */

export type Operator = 'Ucell' | 'Beeline' | 'Mobiuz' | 'UMS' | 'Humans'

/**
 * How the gateway device is currently linked to the server:
 * live WebSocket, HTTP polling fallback, or fully offline.
 */
export type DeviceConnection = 'realtime' | 'polling' | 'offline'

export interface Device {
  id: string
  name: string
  model: string
  phone: string
  operator: Operator
  status: 'online' | 'offline'
  connection: DeviceConnection
  battery: number
  /** 0..4 bars */
  signal: number
  androidVersion: string
  appVersion: string
  sentToday: number
  dailyLimit: number
  lastSeenAt: string | null
  isDefault: boolean
}

export type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'failed'

/**
 * Queue class: urgent (OTP — jumps the queue, no send interval),
 * transactional (orders, reminders), bulk (campaigns — slowest lane).
 */
export type SmsPriority = 'urgent' | 'transactional' | 'bulk'

export interface SmsMessage {
  id: number
  to: string
  contactId?: string | null
  text: string
  status: MessageStatus
  priority: SmsPriority
  deviceId?: string | null
  segments: number
  createdAt: string
  sentAt?: string | null
  deliveredAt?: string | null
  failReason?: 'no_signal' | 'invalid_number' | 'device_offline' | null
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
  company?: string | null
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

export type ApiScope = 'sms.send' | 'sms.read' | 'devices.read' | 'contacts.read' | 'telegram.send' | 'telegram.read'

export interface ApiKey {
  id: string
  name: string
  /** Only the prefix is ever shown again, like a real secret manager */
  prefix: string
  createdAt: string
  lastUsedAt?: string | null
  scopes: ApiScope[]
}

/** Creation response — carries the full secret exactly once. */
export interface ApiKeyCreated extends ApiKey {
  key: string
}

/* ----------------------------------------------------- telegram service */

/** Every media shape a company bot can push to its subscribers. */
export type BotMessageKind = 'text' | 'photo' | 'video' | 'document' | 'post'

export interface TelegramBot {
  id: string
  /** @username handle, without the @ */
  username: string
  title: string
  status: 'active' | 'paused'
  connectedAt: string
  subscriberCount: number
  webhookOk: boolean
}

export interface BotSubscriber {
  id: string
  name: string
  username?: string | null
  joinedAt: string
  avatarHue: number
  source: 'link' | 'qr' | 'search'
}

export interface BotBroadcast {
  id: number
  kind: BotMessageKind
  /** Message text, or the caption for media kinds */
  text: string
  /** File name shown for photo/video/document broadcasts */
  mediaName?: string | null
  /** Inline button (post kind) */
  buttonLabel?: string | null
  buttonUrl?: string | null
  audience: number
  delivered: number
  createdAt: string
  status: 'queued' | 'sending' | 'sent' | 'failed'
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
  emailVerified: boolean
  isAdmin?: boolean
}

/** Generic offset-paginated result (backend `Page[T]`). */
export interface Page<T> {
  items: T[]
  total: number
}
