import { simulate } from '@/shared/api/mockClient'
import { dailyStats, devices, messages } from '@/shared/mock/db'
import type { DailyStat, Device, SmsMessage } from '@/shared/mock/types'

export interface OverviewData {
  sentToday: number
  sentYesterday: number
  deliveryRate: number
  activeDevices: number
  totalDevices: number
  queued: number
  monthlyUsed: number
  monthlyLimit: number
  series: DailyStat[]
  recentMessages: SmsMessage[]
  devices: Device[]
}

export function fetchOverview(): Promise<OverviewData> {
  return simulate(() => {
    const last = dailyStats[dailyStats.length - 1]
    const prev = dailyStats[dailyStats.length - 2]
    const delivered = dailyStats.reduce((sum, day) => sum + day.delivered, 0)
    const sent = dailyStats.reduce((sum, day) => sum + day.sent, 0)
    return {
      sentToday: devices.reduce((sum, device) => sum + device.sentToday, 0),
      sentYesterday: prev?.sent ?? last.sent,
      deliveryRate: (delivered / sent) * 100,
      activeDevices: devices.filter((device) => device.status === 'online').length,
      totalDevices: devices.length,
      queued: messages.filter((message) => message.status === 'queued' || message.status === 'sending').length,
      monthlyUsed: 8000,
      monthlyLimit: 10000,
      series: dailyStats,
      recentMessages: messages.slice(0, 6),
      devices,
    }
  })
}
