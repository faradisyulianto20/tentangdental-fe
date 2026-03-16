import { Button } from '@/components/ui/button'
import { Calendar, Clock, Phone, User } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export default function Reservation() {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate({
      to: '/admin/reservasi',
    })
  }

  const now = new Date()
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col p-4 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Permintaan Reservasi</h1>
      <p className="text-sm text-muted-foreground">{formattedDate}</p>
      <div className="mt-4">
        {reservations.map((res, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 bg-[#E0F4FB]">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-bold">{res.namaPasien}</h2>
                <p className="text-sm text-muted-foreground">{res.layanan}</p>
              </div>
              <Button
                variant="default"
                className="bg-[#B9D654] text-white hover:bg-[#A8C24A] mt-2"
              >
                Lihat Detail
              </Button>
            </div>
            <div className="grid grid-cols-2 text-sm mt-2 gap-2">
              <p className="flex gap-2 items-center">
                <Calendar />
                {res.tanggalReservasi}
              </p>
              <p className="flex gap-2 items-center">
                <Phone />
                {res.nomorHandphone}
              </p>
              <p className="flex gap-2 items-center">
                <Clock />
                {res.jamReservasi}
              </p>
              <p className="flex gap-2 items-center">
                <User />
                {res.dokter}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="default"
        className=" bg-[#B9D654] hover:bg-[#A8C24A] hover:text-white"
        onClick={() => handleNavigate()}
      >
        Lihat Semua Reservasi
      </Button>
    </div>
  )
}

const reservations = [
  {
    namaPasien: 'John Doe',
    layanan: 'Pembersihan Gigi',
    tanggalReservasi: 'Sabtu, 15 Maret 2024',
    nomorHandphone: '081234567890',
    jamReservasi: '10:00 AM',
    dokter: 'Dr. Smith',
  },
  {
    namaPasien: 'Jane Smith',
    layanan: 'Pemeriksaan Gigi',
    tanggalReservasi: 'Minggu, 16 Maret 2024',
    nomorHandphone: '081234567891',
    jamReservasi: '11:00 AM',
    dokter: 'Dr. Johnson',
  },
]
