import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// Ga dipake karena bikin posisi error
// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// }

const images = [
  { src: '/hero.png', alt: 'Ruang Klinik' },
  { src: '/hero1.png', alt: 'Kursi Dental' },
  { src: '/hero2.png', alt: 'Alat Dental' },
  { src: '/hero3.png', alt: 'Gedung Klinik' },
  { src: '/hero4.png', alt: 'Fasilitas' },
]

export default function GalleryCarousel() {
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const applyViewport = () => {
      setIsMobile(window.innerWidth < 768)
    }

    applyViewport()
    window.addEventListener('resize', applyViewport)

    return () => window.removeEventListener('resize', applyViewport)
  }, [])

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
      0: {
        transform: 'translateX(-50%) scale(1)',
        zIndex: 30,
        opacity: 1,
        width: isMobile ? '220px' : '380px',
        height: isMobile ? '150px' : '240px',
        left: '50%',
        top: isMobile ? '10px' : '20px',
      },
      1: {
        transform: 'translateX(-50%) scale(0.82)',
        zIndex: 20,
        opacity: 0.9,
        width: isMobile ? '170px' : '300px',
        height: isMobile ? '120px' : '200px',
        left:
          offset > 0 ? (isMobile ? '74%' : '72%') : isMobile ? '26%' : '28%',
        top: isMobile ? '25px' : '50px',
      },
      2: {
        transform: 'translateX(-50%) scale(0.68)', // fix: hapus kurung dobel
        zIndex: 10,
        opacity: 0.7,
        width: isMobile ? '140px' : '260px',
        height: isMobile ? '100px' : '175px',
        left:
          offset > 0 ? (isMobile ? '90%' : '88%') : isMobile ? '10%' : '12%',
        top: isMobile ? '40px' : '80px',
      },
    }

    return configs[absOffset] ?? { display: 'none' }
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 py-12 overflow-hidden max-w-6xl mx-6">
      <div className="text-center">
        <h1 className="text-primary text-xl md:text-3xl font-bold">Galeri</h1>
        <p className="text-muted-foreground text-sm md:text-base mt-3">
          Temukan Tempat Ternyaman dan Fasilitas Terlengkap di Tentang Dental.
        </p>
      </div>
      {/* Carousel */}
      {/* Carousel container - lebih kecil di mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative w-full max-w-4xl h-50 md:h-80"
      >
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
              {offset !== 0 && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
              )}
            </div>
          )
        })}
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={prev}
          className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-[#58C4EC] flex items-center justify-center text-[#58C4EC] hover:bg-[#58C4EC] hover:text-white transition"
        >
          <ChevronLeft size={16} className="cursor-pointer" />
        </button>

        <div className="flex gap-1 md:gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-[#58C4EC] w-3 h-2 md:w-4 md:h-3'
                  : 'bg-[#58C4EC]/30 w-2 h-2 md:w-3 md:h-3'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#58C4EC] flex items-center justify-center text-white hover:bg-[#58C4EC]/80 transition"
        >
          <ChevronRight size={16} className="cursor-pointer" />
        </button>
      </div>
    </div>
  )
}
