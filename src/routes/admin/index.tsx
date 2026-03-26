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
      <h1 className='font-bold text-xl'>Selamat Datang, <span className='text-transparent bg-clip-text bg-linear-to-r from-[#01C7FE] to-[#89FBA4] font-bold text-2xl leading-10 '>Admin Klinik</span></h1>
      <p className='text-muted-foreground mb-6'>{formatDate(now)}</p>

      <CardDashboard />

      <StatisticsDashboard />

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        <Reservation />
        <DoctorSchedule />
      </div>
    </div>
  </div>
}
