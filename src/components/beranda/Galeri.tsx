import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  { src: '/hero.png', alt: 'Ruang Klinik' },
  { src: '/hero1.png', alt: 'Kursi Dental' },
  { src: '/hero2.png', alt: 'Alat Dental' },
  { src: '/hero3.png', alt: 'Gedung Klinik' },
  { src: '/hero4.png', alt: 'Fasilitas' },
]

export default function GalleryCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)
  const next = () => setCurrent((c) => (c + 1) % images.length)

  // Hitung posisi relatif tiap card dari center
  const getPosition = (index: number) => {
    let offset = index - current
    if (offset > images.length / 2) offset -= images.length
    if (offset < -images.length / 2) offset += images.length
    return offset
  }

  const getStyle = (offset: number): React.CSSProperties => {
    const absOffset = Math.abs(offset)

    if (absOffset > 2) return { display: 'none' }

    const configs: Record<number, React.CSSProperties> = {
      0: { // center — besar & depan
        transform: 'translateX(-50%) scale(1)',
        zIndex: 30,
        opacity: 1,
        width: '380px',
        height: '240px',
        left: '50%',
        top: '20px',
      },
      1: { // kanan 1
        transform: `translateX(-50%) scale(0.82)`,
        zIndex: 20,
        opacity: 0.9,
        width: '300px',
        height: '200px',
        left: offset > 0 ? '72%' : '28%',
        top: '50px',
      },
      2: { // kanan/kiri 2 — paling pinggir
        transform: `translateX(-50%) scale(0.68))`,
        zIndex: 10,
        opacity: 0.7,
        width: '260px',
        height: '175px',
        left: offset > 0 ? '88%' : '12%',
        top: '80px',
      },
    }

    return configs[absOffset] ?? { display: 'none' }
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 py-12 overflow-hidden max-w-6xl">
        <div className="text-center">
             <h1 className="text-primary text-3xl font-bold">Galeri</h1>
            <p className="text-muted-foreground">Temukan Tempat Ternyaman dan Fasilitas Terlengkap di Tentang Dental.</p>
</div>
      {/* Carousel */}
      <div className="relative w-full max-w-4xl h-[320px]">
        {images.map((img, index) => {
          const offset = getPosition(index)
          const style = getStyle(offset)

          return (
            <div
              key={index}
              className="absolute transition-all duration-500 ease-in-out rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              style={style}
              onClick={() => setCurrent(index)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
              {/* Overlay blur untuk card non-center */}
              {offset !== 0 && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
              )}
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full border border-[#58C4EC] flex items-center justify-center text-[#58C4EC] hover:bg-[#58C4EC] hover:text-white transition"
        >
          <ChevronLeft size={18} className="cursor-pointer"/>
        </button>

        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-[#58C4EC] w-4 h-3'
                  : 'bg-[#58C4EC]/30 w-3 h-3'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full bg-[#58C4EC] flex items-center justify-center text-white hover:bg-[#58C4EC]/80 transition"
        >
          <ChevronRight size={18} className='cursor-pointer'/>
        </button>
      </div>
    </div>
  )
}