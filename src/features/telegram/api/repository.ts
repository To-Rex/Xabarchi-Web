import { api, ApiError } from '@/shared/api/client'
import type { BotBroadcast, BotMessageKind, BotSubscriber, Page, TelegramBot } from '@/shared/api/types'

/**
 * Telegram bot service — a standalone channel next to SMS. Each company
 * connects its own bot (BotFather token) and pushes any media kind to its
 * subscribers.
 */

export async function fetchBot(): Promise<TelegramBot | null> {
  try {
    return await api<TelegramBot>('/telegram/bot')
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export function connectBot(token: string): Promise<TelegramBot> {
  return api<TelegramBot>('/telegram/connect', { method: 'POST', body: { token: token.trim() } })
}

export function disconnectBot(): Promise<void> {
  return api('/telegram/bot', { method: 'DELETE' })
}

export async function fetchSubscribers(): Promise<BotSubscriber[]> {
  try {
    const page = await api<Page<BotSubscriber>>('/telegram/subscribers', { query: { pageSize: 100 } })
    return page.items
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return [] // no bot yet
    throw error
  }
}

export async function fetchBroadcasts(): Promise<BotBroadcast[]> {
  try {
    const page = await api<Page<BotBroadcast>>('/telegram/broadcasts', { query: { pageSize: 50 } })
    return page.items
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return [] // no bot yet
    throw error
  }
}

export interface BroadcastInput {
  kind: BotMessageKind
  text: string
  mediaName?: string
  buttonLabel?: string
  buttonUrl?: string
}

export function sendBroadcast(input: BroadcastInput): Promise<BotBroadcast> {
  return api<BotBroadcast>('/telegram/broadcasts', { method: 'POST', body: input })
}
