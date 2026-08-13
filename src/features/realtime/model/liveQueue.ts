import { useEffect, useSyncExternalStore } from 'react'
import { api } from '@/shared/api/client'
import type { Page, SmsMessage, SmsPriority } from '@/shared/api/types'
import { onRealtimeEvent, useSocketConnected } from '../socket'

/**
 * Live view of the gateway queue, driven by the real WebSocket feed:
 * `message.created` fills the lanes, `message.updated` drains them.
 * The initial lane counts come from one queued-messages fetch.
 */

export type FeedConnection = 'realtime' | 'polling'

export interface LiveEvent {
  id: number
  to: string
  priority: SmsPriority
  at: number
}

export interface LiveQueueState {
  connection: FeedConnection
  pending: Record<SmsPriority, number>
  sending: { to: string; priority: SmsPriority } | null
  sentThisSession: number
  events: LiveEvent[]
}

let state: LiveQueueState = {
  connection: 'polling',
  pending: { urgent: 0, transactional: 0, bulk: 0 },
  sending: null,
  sentThisSession: 0,
  events: [],
}

let listeners: (() => void)[] = []
let unsubscribeSocket: (() => void) | null = null
let seeded = false

function emit() {
  for (const listener of listeners) listener()
}

async function seedPending() {
  // One page of queued + sending messages is enough to fill the lane counters.
  try {
    const [queued, sending] = await Promise.all([
      api<Page<SmsMessage> & { countsByStatus: Record<string, number> }>('/messages', {
        query: { status: 'queued', pageSize: 100 },
      }),
      api<Page<SmsMessage> & { countsByStatus: Record<string, number> }>('/messages', {
        query: { status: 'sending', pageSize: 50 },
      }),
    ])
    const pending: LiveQueueState['pending'] = { urgent: 0, transactional: 0, bulk: 0 }
    for (const message of queued.items) pending[message.priority] += 1
    const inFlight = sending.items[0]
    state = {
      ...state,
      pending,
      sending: inFlight ? { to: inFlight.to, priority: inFlight.priority } : null,
    }
    emit()
  } catch { /* dashboard still renders; counters fill up from events */ }
}

function handleEvent(event: { event: string; data: Record<string, unknown> }) {
  if (event.event !== 'message.created' && event.event !== 'message.updated') return
  const message = event.data as unknown as SmsMessage
  const pending = { ...state.pending }
  let { sending, sentThisSession } = state
  const events = [...state.events]

  if (event.event === 'message.created') {
    pending[message.priority] += 1
  } else if (message.status === 'sending') {
    if (pending[message.priority] > 0) pending[message.priority] -= 1
    sending = { to: message.to, priority: message.priority }
  } else if (message.status === 'sent' || message.status === 'delivered') {
    if (sending?.to === message.to) sending = null
    if (message.status === 'sent') {
      sentThisSession += 1
      events.unshift({ id: message.id, to: message.to, priority: message.priority, at: Date.now() })
      if (events.length > 5) events.pop()
    }
  } else if (message.status === 'failed' && sending?.to === message.to) {
    sending = null
  }

  state = { ...state, pending, sending, sentThisSession, events }
  emit()
}

function subscribe(listener: () => void) {
  listeners.push(listener)
  if (!unsubscribeSocket) unsubscribeSocket = onRealtimeEvent(handleEvent)
  if (!seeded) {
    seeded = true
    void seedPending()
  }
  return () => {
    listeners = listeners.filter((entry) => entry !== listener)
    if (listeners.length === 0 && unsubscribeSocket) {
      unsubscribeSocket()
      unsubscribeSocket = null
    }
  }
}

const getSnapshot = () => state

export function useLiveQueue(): LiveQueueState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)
  const socketLive = useSocketConnected()
  const connection: FeedConnection = socketLive ? 'realtime' : 'polling'
  useEffect(() => {
    if (state.connection !== connection) {
      state = { ...state, connection }
      emit()
    }
  }, [connection])
  return { ...snapshot, connection }
}
