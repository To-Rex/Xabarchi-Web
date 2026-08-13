/**
 * Real HTTP transport for the Xabarchi API.
 *
 * - Base URL comes from VITE_API_URL (falls back to the deployed backend).
 * - JWT pair lives in localStorage; a 401 triggers one single-flight refresh
 *   and the original request is retried once. A failed refresh signs out.
 * - Backend errors arrive as `{code, message}` and surface as ApiError.
 */

import { storageGet, storageRemove, storageSet } from '@/shared/lib/storage'

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '')
  ?? 'https://manager-xabarchi-backend-bula2s-f6aaa1-13-140-185-49.sslip.io'

export const API_BASE = `${API_URL}/api/v1`

const TOKENS_KEY = 'xabarchi:tokens'

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/* ------------------------------------------------------------- tokens */

let sessionListeners: (() => void)[] = []

/** Fires whenever the token pair appears/disappears (sign-in / sign-out). */
export function onSessionChange(listener: () => void) {
  sessionListeners.push(listener)
  return () => {
    sessionListeners = sessionListeners.filter((entry) => entry !== listener)
  }
}

function emitSession() {
  for (const listener of sessionListeners) listener()
}

export function getTokens(): TokenPair | null {
  const raw = storageGet(TOKENS_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as TokenPair
    return parsed.accessToken && parsed.refreshToken ? parsed : null
  } catch {
    return null
  }
}

export function setTokens(tokens: TokenPair) {
  storageSet(TOKENS_KEY, JSON.stringify(tokens))
  emitSession()
}

export function clearTokens() {
  storageRemove(TOKENS_KEY)
  emitSession()
}

/* ------------------------------------------------------------ request */

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Query params; null/undefined/'' entries are dropped. */
  query?: Record<string, string | number | boolean | null | undefined>
  /** Attach the Bearer token (default true). */
  auth?: boolean
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${API_BASE}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== null && value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

/** Single-flight refresh: concurrent 401s wait for one /auth/refresh call. */
let refreshing: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const tokens = getTokens()
      if (!tokens) return false
      try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        })
        if (!response.ok) return false
        const next = (await response.json()) as TokenPair
        setTokens(next)
        return true
      } catch {
        return false
      }
    })().finally(() => {
      refreshing = null
    })
  }
  return refreshing
}

async function parseError(response: Response): Promise<ApiError> {
  let code = 'http_error'
  let message = `Request failed (${response.status})`
  try {
    const data = await response.json()
    if (typeof data?.code === 'string') code = data.code
    if (typeof data?.message === 'string') message = data.message
    // FastAPI validation errors arrive as {detail: [...]}.
    else if (typeof data?.detail === 'string') message = data.detail
    else if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
      code = 'validation_error'
      message = data.detail[0].msg
    }
  } catch { /* non-JSON body — keep defaults */ }
  return new ApiError(response.status, code, message)
}

export async function api<T = void>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true } = options

  const attempt = async (): Promise<Response> => {
    const headers: Record<string, string> = {}
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (auth) {
      const tokens = getTokens()
      if (tokens) headers.Authorization = `Bearer ${tokens.accessToken}`
    }
    return fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  let response = await attempt()

  if (response.status === 401 && auth && getTokens()) {
    if (await refreshTokens()) {
      response = await attempt()
    } else {
      clearTokens() // refresh failed — session is over
    }
  }

  if (!response.ok) throw await parseError(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

/** ws(s):// URL for the realtime endpoint, token included. */
export function wsUrl(): string | null {
  const tokens = getTokens()
  if (!tokens) return null
  const base = API_BASE.replace(/^http/, 'ws')
  return `${base}/ws?token=${encodeURIComponent(tokens.accessToken)}`
}
