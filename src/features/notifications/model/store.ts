import { useSyncExternalStore } from 'react'
import { api } from '@/shared/api/client'
import type { AppNotification, Page } from '@/shared/api/types'
import { onRealtimeEvent } from '@/features/realtime/socket'

/**
 * Notification state shared between the topbar bell and the notifications
 * page: fetched from the API on first subscribe, then kept fresh by the
 * `notification.created` realtime event.
 */

let items: AppNotification[] = []
let listeners: (() => void)[] = []
let unsubscribeSocket: (() => void) | null = null
let loaded = false

function emit() {
  items = [...items]
  for (const listener of listeners) listener()
}

async function load() {
  try {
    const page = await api<Page<AppNotification>>('/notifications', { query: { pageSize: 50 } })
    items = page.items
    emit()
  } catch { /* bell simply stays empty on failure */ }
}

function subscribe(listener: () => void) {
  listeners.push(listener)
  if (!loaded) {
    loaded = true
    void load()
  }
  if (!unsubscribeSocket) {
    unsubscribeSocket = onRealtimeEvent((event) => {
      if (event.event !== 'notification.created') return
      items = [event.data as unknown as AppNotification, ...items]
      emit()
    })
  }
  return () => {
    listeners = listeners.filter((entry) => entry !== listener)
    if (listeners.length === 0 && unsubscribeSocket) {
      unsubscribeSocket()
      unsubscribeSocket = null
    }
  }
}

export function useNotifications(): AppNotification[] {
  return useSyncExternalStore(subscribe, () => items)
}

export function useUnreadCount(): number {
  return useNotifications().filter((item) => !item.read).length
}

export function markRead(id: string) {
  const target = items.find((item) => item.id === id)
  if (!target || target.read) return
  target.read = true
  emit()
  void api(`/notifications/${id}/read`, { method: 'POST' }).catch(() => {
    target.read = false // roll the optimistic flip back
    emit()
  })
}

export function markAllRead() {
  const unread = items.filter((item) => !item.read)
  if (unread.length === 0) return
  for (const item of unread) item.read = true
  emit()
  void api('/notifications/read-all', { method: 'POST' }).catch(() => {
    for (const item of unread) item.read = false
    emit()
  })
}
