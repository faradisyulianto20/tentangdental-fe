import { createFileRoute } from '@tanstack/react-router'

import CardDashboard from '@/components/admin/dashboard/CardDashboard'
import StatisticsDashboard from '@/components/admin/dashboard/StatisticsDashboard'
import Reservation from '@/components/admin/dashboard/Reservation'
import DoctorSchedule from '@/components/admin/dashboard/DoctorSchedule'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {

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

  return <div>
    <div>
      <h1 className='font-bold text-xl'>Selamat Datang, Admin Klinik</h1>
      <p className='text-muted-foreground my-3'>{formatDate(now)}</p>

      <CardDashboard />

      <StatisticsDashboard />

      <div className='grid grid-cols-2 gap-6'>
        <Reservation />
        <DoctorSchedule />
      </div>
    </div>
  </div>
}
