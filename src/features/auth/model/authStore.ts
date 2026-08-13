import { useSyncExternalStore } from 'react'
import { api, clearTokens, getTokens, onSessionChange, setTokens, type TokenPair } from '@/shared/api/client'
import type { UserProfile } from '@/shared/api/types'

/**
 * Real session store: JWT pair in localStorage (via the API client) plus the
 * cached /auth/me profile. `useIsAuthenticated` drives the router guard;
 * `useCurrentUser` feeds the layout/profile pages.
 */

interface AuthResponse {
  user: UserProfile
  accessToken: string
  refreshToken: string
}

let currentUser: UserProfile | null = null
let userListeners: (() => void)[] = []

function emitUser() {
  for (const listener of userListeners) listener()
}

function setUser(user: UserProfile | null) {
  currentUser = user
  emitUser()
}

/* ------------------------------------------------------------- hooks */

export function useIsAuthenticated(): boolean {
  return useSyncExternalStore(onSessionChange, () => getTokens() !== null)
}

export function useCurrentUser(): UserProfile | null {
  return useSyncExternalStore(
    (listener) => {
      userListeners.push(listener)
      // Lazy-load the profile on first mount of any subscriber.
      if (currentUser === null && getTokens() !== null) void refreshMe()
      return () => {
        userListeners = userListeners.filter((entry) => entry !== listener)
      }
    },
    () => currentUser,
  )
}

/* ----------------------------------------------------------- actions */

export async function login(email: string, password: string): Promise<UserProfile> {
  const data = await api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password }, auth: false })
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  setUser(data.user)
  return data.user
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  password: string
}

export async function register(payload: RegisterPayload): Promise<UserProfile> {
  const data = await api<AuthResponse>('/auth/register', { method: 'POST', body: payload, auth: false })
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  setUser(data.user)
  return data.user
}

/** OAuth callback hands us a ready token pair via the URL fragment. */
export async function adoptSession(tokens: TokenPair): Promise<UserProfile> {
  setTokens(tokens)
  return refreshMe()
}

export async function refreshMe(): Promise<UserProfile> {
  const user = await api<UserProfile>('/auth/me')
  setUser(user)
  return user
}

export interface ProfileUpdate {
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  timezone?: string
  avatarHue?: number
}

export async function updateProfile(update: ProfileUpdate): Promise<UserProfile> {
  const user = await api<UserProfile>('/auth/me', { method: 'PATCH', body: update })
  setUser(user)
  return user
}

export function signOut() {
  clearTokens()
  setUser(null)
}
