import { api } from '@/shared/api/client'
import type { DailyStat, Device, SmsMessage } from '@/shared/api/types'

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
  return api<OverviewData>('/analytics/overview')
}

export function fetchDailyStats(days = 14): Promise<DailyStat[]> {
  return api<DailyStat[]>('/analytics/daily', { query: { days } })
}
