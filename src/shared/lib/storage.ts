/**
 * localStorage access can throw (storage disabled, some private modes,
 * quota exceeded). Guarded here once so providers never crash the app on boot.
 */

export function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch { /* storage unavailable — preference simply won't persist */ }
}

export function storageRemove(key: string) {
  try {
    localStorage.removeItem(key)
  } catch { /* ignore */ }
}
