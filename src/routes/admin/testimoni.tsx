import TestimoniForm from '@/components/admin/testimoni/TestimoniForm'
import { createFileRoute } from '@tanstack/react-router'
import { Star } from 'lucide-react'

export const Route = createFileRoute('/admin/testimoni')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <TestimoniForm />
      <div className="flex flex-col gap-4 mt-6">
        {testimoniList.map((testimoni, index) => (
          <TestimoniCard key={index} testimoni={testimoni} />
        ))}
      </div>
    </div>
  )
}

export function TestimoniCard({
  testimoni,
}: {
  testimoni: (typeof testimoniList)[0]
}) {
  return (
    <div className="flex border rounded-lg p-4 gap-2 cursor-pointer">
      <img
        src={testimoni.imgUrl}
        alt={testimoni.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">{testimoni.name}</p>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className="w-4 h-4"
              color="oklch(0.905 0.182 98.244)"
              fill={i < testimoni.rating ? 'oklch(0.905 0.182 98.244)' : 'none'}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {testimoni.description}
        </p>
      </div>
    </div>
  )
}

const testimoniList = [
  {
    name: 'Budi Santoso',
    description:
      'Pelayanan di Tentang Dental sangat profesional. Proses scaling giginya cepat dan tidak sakit sama sekali. Ruang tunggunya juga nyaman banget!',
    imgUrl: '/muka.svg',
    rating: 5,
  },
  {
    name: 'Siti Aminah',
    description:
      'Dokternya sangat sabar menjelaskan detail kesehatan gigi saya. Fasilitasnya modern dan sangat bersih. Sangat direkomendasikan untuk keluarga.',
    imgUrl: '/muka2.svg',
    rating: 5,
  },
  {
    name: 'Rian Hidayat',
    description:
      'Tempat praktik gigi terbaik di kota ini. Harganya cukup terjangkau dengan kualitas pelayanan bintang lima. Staf administrasinya juga ramah.',
    imgUrl: '/muka3.svg',
    rating: 4,
  },
  {
    name: 'Dewi Lestari',
    description:
      'Baru pertama kali ke sini untuk cabut gigi bungsu dan pengalamannya luar biasa minim rasa sakit. Alat-alatnya terlihat sangat steril.',
    imgUrl: '/muka4.svg',
    rating: 5,
  },
  {
    name: 'Andi Wijaya',
    description:
      'Sistem booking-nya sangat mudah via WhatsApp. Tidak perlu antre lama karena jadwalnya sangat on-time. Dokter giginya sangat berpengalaman.',
    imgUrl: '/muka5.svg',
    rating: 4,
  },
  {
    name: 'Farah Quinnisa',
    description:
      'Sangat puas dengan hasil pemutihan gigi (bleaching) di sini. Hasilnya natural dan konsultasinya sangat mendalam. Sukses terus Tentang Dental!',
    imgUrl: '/muka6.svg',
    rating: 5,
  },
]
