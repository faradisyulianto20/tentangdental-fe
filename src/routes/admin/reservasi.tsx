import { ReservationCard } from '@/components/admin/dashboard/Reservation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/reservasi')({
  component: RouteComponent,
})

const reservations = [
  {
    namaPasien: 'John Doe',
    layanan: 'Pembersihan Gigi',
    tanggalReservasi: 'Sabtu, 15 Maret 2024',
    nomorHandphone: '081234567890',
    jamReservasi: '10:00 AM',
    dokter: 'Dr. Smith',
    status: 'reservasi',
  },
  {
    namaPasien: 'Jane Smith',
    layanan: 'Pemeriksaan Gigi',
    tanggalReservasi: 'Minggu, 16 Maret 2024',
    nomorHandphone: '081234567891',
    jamReservasi: '11:00 AM',
    dokter: 'Dr. Johnson',
    status: 'hadir',
  },
  {
    namaPasien: 'Alice Johnson',
    layanan: 'Tambal Gigi',
    tanggalReservasi: 'Senin, 17 Maret 2024',
    nomorHandphone: '081234567892',
    jamReservasi: '09:00 AM',
    dokter: 'Dr. Lee',
    status: 'selesai',
  },
]

function RouteComponent() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const reservationFiltered = reservations.filter((res) => res.status !== 'selesai')
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Antrian Pasien</h1>
      <p className="text-sm text-muted-foreground">{formattedDate}</p>
      <div className="mt-4">
        {reservationFiltered.map((res, index) => (
          <ReservationCard key={index} res={res} />
        ))}
      </div>
    </div>
  )
}

