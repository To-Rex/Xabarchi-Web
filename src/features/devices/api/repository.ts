import { simulate } from '@/shared/api/mockClient'
import { devices as seed } from '@/shared/mock/db'
import type { Device } from '@/shared/mock/types'

let list: Device[] = [...seed]
let addCounter = 0

export function fetchDevices(): Promise<Device[]> {
  return simulate(() => [...list])
}

export function setDefaultDevice(id: string): Promise<Device[]> {
  return simulate(
    () => {
      list = list.map((device) => ({ ...device, isDefault: device.id === id }))
      return [...list]
    },
    { minDelay: 200, maxDelay: 400 },
  )
}

export function removeDevice(id: string): Promise<Device[]> {
  return simulate(
    () => {
      list = list.filter((device) => device.id !== id)
      if (!list.some((device) => device.isDefault) && list.length > 0) list[0] = { ...list[0], isDefault: true }
      return [...list]
    },
    { minDelay: 300, maxDelay: 600 },
  )
}

/** Called when the mock QR pairing "detects" a phone. */
export function pairNewDevice(): Promise<Device> {
  return simulate(
    () => {
      const device: Device = {
        id: `dev_new_${++addCounter}`,
        name: 'Yangi qurilma',
        model: 'Samsung Galaxy S23',
        phone: '998977781255',
        operator: 'UMS',
        status: 'online',
        battery: 67,
        signal: 4,
        androidVersion: '15',
        appVersion: '2.4.1',
        sentToday: 0,
        dailyLimit: 500,
        lastSeenAt: new Date().toISOString(),
        isDefault: false,
      }
      list = [...list, device]
      return device
    },
    { minDelay: 200, maxDelay: 300 },
  )
}
