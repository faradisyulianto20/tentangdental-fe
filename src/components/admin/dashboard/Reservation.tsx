import { Button } from '@/components/ui/button'
import { Calendar, Clock, Phone, User } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

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

export function ReservationCard({ res }: { res: (typeof reservations)[0] }) {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-[#E0F4FB]">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-bold">{res.namaPasien}</h2>
          <p className="text-sm text-muted-foreground">{res.layanan}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={'default'}
            className=" text-white bg-[#A8C24A] mt-2 rounded-2xl text-sm"
            disabled
          >
            {res.status === 'reservasi'
              ? 'Menunggu'
              : res.status === 'hadir'
                ? 'Hadir'
                : 'Selesai'}
          </Button>
          <Button
            variant="default"
            className="bg-[#B9D654] text-white hover:bg-[#A8C24A] mt-2 text-sm"
          >
            {res.status === 'reservasi'
              ? 'Lihat Detail'
              : res.status === 'hadir'
                ? 'Konfirmasi Pemeriksaan'
                : 'Lihat Riwayat'}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 text-sm mt-2 gap-2">
        <p className="flex gap-2 items-center">
          <Calendar className="w-4 h-4" />
          {res.tanggalReservasi}
        </p>
        <p className="flex gap-2 items-center">
          <Phone className="w-4 h-4" />
          {res.nomorHandphone}
        </p>
        <p className="flex gap-2 items-center">
          <Clock className="w-4 h-4" />
          {res.jamReservasi}
        </p>
        <p className="flex gap-2 items-center">
          <User className="w-4 h-4" />
          {res.dokter}
        </p>
      </div>
    </div>
  )
}

export default function Reservation() {
  const navigate = useNavigate()

  const now = new Date()
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const reservationFiltered = reservations.filter((r) => r.status !== 'selesai')

  return (
    <div className="flex flex-col p-4 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Permintaan Reservasi</h1>
      <p className="text-sm text-muted-foreground">{formattedDate}</p>
      <div className="mt-4">
        {reservationFiltered.map((res, index) => (
          <ReservationCard key={index} res={res} />
        ))}
      </div>
      <Button
        variant="default"
        className="bg-[#B9D654] hover:bg-[#A8C24A] text-white"
        onClick={() => navigate({ to: '/admin/reservasi' })}
      >
        Lihat Semua Reservasi
      </Button>
    </div>
  )
}
