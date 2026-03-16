import { ProfilDokterCard } from '@/components/beranda/ProfilDokter'
import ProfilDokterForm from '@/components/admin/profil-dokter/ProfilDokterForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/profil-dokter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <ProfilDokterForm />
    <div className="flex flex-col gap-4 mt-12 justify-center w-full">
      {
        listDokter.map((dokter, index) => (
          <ProfilDokterCard key={index} dokter={dokter} index={index} />
        ))
      }
    </div>
  </div>
}

type Dokter = {
  imgUrl: string
  nama: string
  spesialis: string
  deskripsi: string
}

const listDokter: Dokter[] = [
  {
    imgUrl: '/dokter.png',
    nama: 'Drg. Sania Dara Afiati, Sp.KG',
    spesialis: 'Spesialis Konversi Gigi',
    deskripsi:
      'Sebagai spesialis konservasi gigi, perhatian utama saya adalah menjaga serta merawat gigi alami Anda agar tetap sehat dan berfungsi optimal dalam jangka panjang, melalui perawatan yang tepat, modern, dan berstandar tinggi.',
  },
  {
    imgUrl: '/dokter.png',
    nama: 'Drg. Sania Dara Afiati, Sp.KG',
    spesialis: 'Spesialis Konversi Gigi',
    deskripsi:
      'Sebagai spesialis konservasi gigi, perhatian utama saya adalah menjaga serta merawat gigi alami Anda agar tetap sehat dan berfungsi optimal dalam jangka panjang, melalui perawatan yang tepat, modern, dan berstandar tinggi.',
  },
]