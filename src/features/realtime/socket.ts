/**
 * Shared WebSocket connection to /api/v1/ws.
 *
 * One socket per tab, lazily opened when the first subscriber appears and
 * closed when the last one leaves. Auto-reconnects with capped backoff;
 * `useSocketConnected` exposes live/polling state for the UI.
 */

import { useSyncExternalStore } from 'react'
import { wsUrl } from '@/shared/api/client'

export interface RealtimeEvent {
  event: string
  data: Record<string, unknown>
}

type Handler = (event: RealtimeEvent) => void

let socket: WebSocket | null = null
let handlers: Handler[] = []
let connected = false
let connectionListeners: (() => void)[] = []
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectDelay = 1000

function emitConnection() {
  for (const listener of connectionListeners) listener()
}

function open() {
  const url = wsUrl()
  if (!url || socket) return

  const ws = new WebSocket(url)
  socket = ws

  ws.onopen = () => {
    connected = true
    reconnectDelay = 1000
    emitConnection()
  }
  ws.onmessage = (message) => {
    try {
      const parsed = JSON.parse(message.data as string) as RealtimeEvent & { type?: string }
      if (parsed.type === 'ping' || !parsed.event) return
      for (const handler of handlers) handler(parsed)
    } catch { /* non-JSON frame — ignore */ }
  }
  ws.onclose = () => {
    socket = null
    connected = false
    emitConnection()
    // Reconnect while anyone still listens (fresh token each attempt).
    if (handlers.length > 0 && !reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null
        open()
      }, reconnectDelay)
      reconnectDelay = Math.min(reconnectDelay * 2, 15_000)
    }
  }
  ws.onerror = () => ws.close()
}

function close() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  socket?.close()
  socket = null
  connected = false
}

/** Subscribe to every realtime event; opens the socket on first use. */
export function onRealtimeEvent(handler: Handler): () => void {
  handlers.push(handler)
  open()
  return () => {
    handlers = handlers.filter((entry) => entry !== handler)
    if (handlers.length === 0) close()
  }
}

export function useSocketConnected(): boolean {
  return useSyncExternalStore(
    (listener) => {
      connectionListeners.push(listener)
      return () => {
        connectionListeners = connectionListeners.filter((entry) => entry !== listener)
      }
    },
    () => connected,
  )
}
