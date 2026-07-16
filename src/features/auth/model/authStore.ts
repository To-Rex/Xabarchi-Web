import { useSyncExternalStore } from 'react'

/**
 * Mock session store backed by localStorage. A real backend replaces the
 * internals with token handling; the hook contract stays identical.
 */

const STORAGE_KEY = 'xabarchi:auth'

let listeners: (() => void)[] = []

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((entry) => entry !== listener)
  }
}

function getSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function useIsAuthenticated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export function signIn() {
  localStorage.setItem(STORAGE_KEY, '1')
  emit()
}

export function signOut() {
  localStorage.removeItem(STORAGE_KEY)
  emit()
}
