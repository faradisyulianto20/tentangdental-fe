'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Berita() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
    }
  }

  return (
    <div className="text-center max-w-7xl px-16 mt-12">
      <h1 className="text-primary text-xl md:text-3xl font-bold">
        Berita Terkini
      </h1>

      <div className="relative mt-6">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-[2px] bg-gradient-to-b from-[#01C7FE] to-[#89FBA4] rounded-full shadow-md cursor-pointer"
        >
          <div className="bg-white rounded-full p-1.5">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </div>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-12 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {berita.map((item, index) => (
            <div key={index} className="flex flex-col flex-shrink-0 w-62 snap-start">
              <div className="hover:shadow-md cursor-pointer">
                <img src={item.imgPath} alt={item.title} className="rounded-xl w-62 h-48 object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <h2 className="text-lg font-semibold mt-4">{item.title}</h2>
                <p className="text-gray-600 mt-2 line-clamp-3">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-[2px] bg-gradient-to-b from-[#01C7FE] to-[#89FBA4] rounded-full shadow-md cursor-pointer"
        >
          <div className="bg-white rounded-full p-1.5">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </div>
        </button>
      </div>
    </div>
  )
}

const berita = [
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: 'berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: 'berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: 'berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: 'berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: 'berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: 'berita1.png',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle:
      'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: 'berita1.png',
  },
]