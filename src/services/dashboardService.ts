import { apiRequest } from '@/lib/api-client'

type DashboardQuery = {
  month?: string
  start_date?: string
  end_date?: string
}

export type DashboardData = {
  daily_statistics: {
    pending: number
    validated: number
    completed: number
    total: number
  }
  totals: {
    total_patients: number
    total_reservations: number
    total_rontgens: number
    pending_reservations: number
  }
  pending_reservations: number
  validated_reservations: number
  completed_reservations: number
  total_patients: number
  monthly_analytics: Array<{
    service_name: string
    total_reservations: number
  }>
  recent_reservations: Array<{
    id: string | number
    patient_name: string
    service_name: string
    doctor_name: string
    reservation_date: string
    appointment_time: string
    status: string
  }>
}

export type ReservationStatsData = {
  month: string | null
  total_reservations: number
  by_status: {
    pending: number
    validated: number
    completed: number
    cancelled: number
  }
  by_date: Array<{
    date: string
    total: number
  }>
  period: {
    start_date: string | null
    end_date: string | null
  }
  statistics: {
    pending: number
    validated: number
    completed: number
    cancelled: number
    total: number
  }
}

export type ServiceAnalyticsData = {
  month: string | null
  period: {
    start_date: string | null
    end_date: string | null
  }
  services: Array<{
    service_id: string | number
    service_name: string
    reservation_count: number
    total_reservations: number
  }>
  summary: {
    total_reservations: number
  }
}

function toQueryString(query?: DashboardQuery): string {
  if (!query) return ''

  const params = new URLSearchParams()
  if (query.month) params.set('month', query.month)
  if (query.start_date) params.set('start_date', query.start_date)
  if (query.end_date) params.set('end_date', query.end_date)

  const text = params.toString()
  return text ? `?${text}` : ''
}

export async function getAdminDashboard(): Promise<DashboardData> {
  return apiRequest<DashboardData>('admin/dashboard', {
    method: 'GET',
    auth: true,
  })
}

export async function getAdminReservationStats(
  query?: DashboardQuery,
): Promise<ReservationStatsData> {
  return apiRequest<ReservationStatsData>(
    `admin/dashboard/reservation-stats${toQueryString(query)}`,
    {
      method: 'GET',
      auth: true,
    },
  )
}

export async function getAdminServiceAnalytics(
  query?: DashboardQuery,
): Promise<ServiceAnalyticsData> {
  return apiRequest<ServiceAnalyticsData>(
    `admin/dashboard/service-analytics${toQueryString(query)}`,
    {
      method: 'GET',
      auth: true,
    },
  )
}
