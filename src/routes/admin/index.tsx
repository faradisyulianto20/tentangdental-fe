import { createFileRoute } from '@tanstack/react-router'

import CardDashboard from '@/components/admin/dashboard/CardDashboard'
import StatisticsDashboard from '@/components/admin/dashboard/StatisticsDashboard'
import DoctorSchedule from '@/components/admin/dashboard/DoctorSchedule'
import RecentReservations from '@/components/admin/dashboard/RecentReservations'
import {
  useAdminDashboard,
  useAdminReservationStats,
  useAdminServiceAnalytics,
} from '@/hooks/useDashboard'
import { useAuth } from '@/hooks/useAuth'
import { useAdminReservations } from '@/hooks/useReservasi'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth()
  const dashboard = useAdminDashboard()
  const reservationStats = useAdminReservationStats()
  const serviceAnalytics = useAdminServiceAnalytics()
  const adminReservations = useAdminReservations()

  const now = new Date()

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString('id-ID', options)
  }

  const monthLabel =
    serviceAnalytics.data?.month ||
    new Intl.DateTimeFormat('id-ID', {
      month: 'long',
      year: 'numeric',
    }).format(now)

  const serviceItems =
    serviceAnalytics.data?.services?.map((item) => ({
      service_name: item.service_name,
      reservation_count: item.reservation_count ?? item.total_reservations,
    })) ||
    dashboard.data?.monthly_analytics?.map((item) => ({
      service_name: item.service_name,
      reservation_count: item.total_reservations,
    })) ||
    []

  const totalReservations =
    reservationStats.data?.statistics?.total ??
    dashboard.data?.totals?.total_reservations ??
    0

  const validatedReservations =
    reservationStats.data?.statistics?.validated ??
    dashboard.data?.daily_statistics?.validated ??
    0

  const pendingReservations =
    reservationStats.data?.statistics?.pending ??
    dashboard.data?.daily_statistics?.pending ??
    0

  const adminName = auth.user?.name || 'Admin Klinik'

  // Transform recent reservations from admin reservations data (only pending, validated, rejected)
  const recentReservationItems =
    adminReservations.data?.reservations
      ?.filter(
        (item) =>
          item.status === 'pending' ||
          item.status === 'validated' ||
          item.status === 'rejected' ||
          item.status === 'cancelled',
      )
      .map((item) => ({
        id: item.id,
        patient_name: item.patient?.name || '-',
        service_name: item.services?.[0]?.name || '-',
        doctor_name: item.doctor?.name || '-',
        reservation_date: item.reservation_date || '',
        appointment_time: item.appointment_time || '',
        status: item.status || 'pending',
      })) || []
  return (
    <div>
      <div>
        <h1 className="font-bold text-xl">
          Selamat Datang,{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#01C7FE] to-[#89FBA4] font-bold text-2xl leading-10 ">
            {adminName}
          </span>
        </h1>
        <p className="text-muted-foreground mb-6">{formatDate(now)}</p>

        {(dashboard.error ||
          reservationStats.error ||
          serviceAnalytics.error) && (
          <p className="mb-4 text-sm text-destructive">
            Gagal memuat data dashboard. Coba refresh halaman.
          </p>
        )}

        <CardDashboard
          totalReservations={totalReservations}
          validatedReservations={validatedReservations}
          pendingReservations={pendingReservations}
        />

        <StatisticsDashboard monthLabel={monthLabel} services={serviceItems} />

        <div className="flex flex-col md:flex-row gap-6 mt-6 md:flex">
          <div className="flex-1">
            <RecentReservations items={recentReservationItems} />
          </div>
          <DoctorSchedule />
        </div>
      </div>
    </div>
  )
}
