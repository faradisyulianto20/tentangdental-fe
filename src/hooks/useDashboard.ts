import { useQuery } from '@tanstack/react-query'
import {
  getAdminDashboard,
  getAdminReservationStats,
  getAdminServiceAnalytics,
  type ReservationStatsData,
  type ServiceAnalyticsData,
} from '@/services/dashboardService'

type DashboardQuery = {
  month?: string
  start_date?: string
  end_date?: string
}

const staleTime = 1000 * 60

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
    staleTime,
  })
}

export function useAdminReservationStats(query?: DashboardQuery) {
  return useQuery<ReservationStatsData>({
    queryKey: ['admin-dashboard', 'reservation-stats', query ?? {}],
    queryFn: () => getAdminReservationStats(query),
    staleTime,
  })
}

export function useAdminServiceAnalytics(query?: DashboardQuery) {
  return useQuery<ServiceAnalyticsData>({
    queryKey: ['admin-dashboard', 'service-analytics', query ?? {}],
    queryFn: () => getAdminServiceAnalytics(query),
    staleTime,
  })
}
