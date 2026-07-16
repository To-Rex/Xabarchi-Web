import { useSyncExternalStore } from 'react'
import { notifications as seed } from '@/shared/mock/db'
import type { AppNotification } from '@/shared/mock/types'

/**
 * In-memory notification state shared between the topbar bell and the
 * notifications page. A real backend swaps this for a socket/poll feed.
 */

let items: AppNotification[] = [...seed]
let listeners: (() => void)[] = []

function emit() {
  items = [...items]
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((entry) => entry !== listener)
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
  if (target && !target.read) {
    target.read = true
    emit()
  }
}

export function markAllRead() {
  let changed = false
  for (const item of items) {
    if (!item.read) {
      item.read = true
      changed = true
    }
  }
  if (changed) emit()
}
