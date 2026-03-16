import { createFileRoute } from '@tanstack/react-router'
import ArtikelForm from '@/components/admin/artikel/ArtikelForm'
import { ArtikelCard } from '@/components/beranda/Artikel'

export const Route = createFileRoute('/admin/artikel')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ArtikelForm />
      <div className="grid grid-cols-4 gap-4 mt-6">
        {artikelList.map((item, index) => (
          <ArtikelCard key={index} artikel={item} />
        ))}
      </div>
    </div>
  )
}

const artikelList = [
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
  },
]
