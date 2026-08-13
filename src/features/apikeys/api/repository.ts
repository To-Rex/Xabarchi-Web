import { api } from '@/shared/api/client'
import type { ApiKey, ApiKeyCreated, ApiScope } from '@/shared/api/types'

export function fetchApiKeys(): Promise<ApiKey[]> {
  return api<ApiKey[]>('/api-keys')
}

/** The returned `key` is shown exactly once — it is never retrievable again. */
export function createApiKey(name: string, scopes: ApiScope[]): Promise<ApiKeyCreated> {
  return api<ApiKeyCreated>('/api-keys', { method: 'POST', body: { name, scopes } })
}

export function revokeApiKey(id: string): Promise<void> {
  return api(`/api-keys/${id}`, { method: 'DELETE' })
}
