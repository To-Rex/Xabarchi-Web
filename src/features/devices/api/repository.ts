import { api } from '@/shared/api/client'
import type { Device } from '@/shared/api/types'

export function fetchDevices(): Promise<Device[]> {
  return api<Device[]>('/devices')
}

export async function setDefaultDevice(id: string): Promise<Device[]> {
  await api<Device>(`/devices/${id}/default`, { method: 'POST' })
  return fetchDevices()
}

export async function removeDevice(id: string): Promise<Device[]> {
  await api(`/devices/${id}`, { method: 'DELETE' })
  return fetchDevices()
}

export interface PairStart {
  code: string
  /** Deep link the mobile app understands when it scans the QR. */
  qrPayload: string
  expiresIn: number
}

/** Dashboard half of QR pairing: mint the short-lived code to render as QR. */
export function startPairing(): Promise<PairStart> {
  return api<PairStart>('/devices/pair/start', { method: 'POST' })
}
