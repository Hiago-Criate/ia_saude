import { useQuery } from '@tanstack/react-query'
import { adminFetch } from './client'

export interface MetricsResponse {
  timestamp: string
  services: {
    redis: { status: 'ok' | 'error'; latencyMs?: number; error?: string }
    supabase: { status: 'ok' | 'error'; latencyMs?: number; error?: string }
  }
  queue: {
    waiting: number
    active: number
    completed: number
    failed: number
    delayed: number
  }
  db: {
    total_users: number
    active_quotes: number
    active_pharmacies: number
    completed_quotes_today: number
    errors_last_hour: number
  }
}

export interface StatsResponse {
  total_users: number
  active_quotes: number
  total_pharmacies: number
  quotes_this_week: number
  quotes_by_day: Record<string, number>
}

export function useMetrics() {
  return useQuery<MetricsResponse>({
    queryKey: ['metrics'],
    queryFn: () => adminFetch<MetricsResponse>('/admin/metrics'),
    refetchInterval: 10_000,
    staleTime: 5_000,
  })
}

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: () => adminFetch<StatsResponse>('/admin/stats'),
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}
