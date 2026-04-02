import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTestimonials } from '../../hooks/useTestimonials'
import type { TestimonialApiItem } from '@/services/testimonialService'
import { appEnv } from '@/lib/env'

const testimonials = [
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

const decorativeFaces = [
  '/muka.svg',
  '/muka2.svg',
  '/muka3.svg',
  '/muka4.svg',
  '/muka5.svg',
]

export default function Testimoni() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { data: testimonialsData, isLoading, error } = useTestimonials()

  const fetchedTestimonials = useMemo(() => {
    if (!Array.isArray(testimonialsData)) return []

    const resolvePhoto = (item: TestimonialApiItem, index: number) => {
      if (typeof item.photo_url !== 'string' || item.photo_url.length === 0) {
        return '/muka' + ((index % 6) + 1) + '.svg'
      }

      if (item.photo_url.startsWith('http')) {
        return item.photo_url
      }

      const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
      const cleanPath = item.photo_url.replace(/^\/+/, '')
      return cleanBase + '/' + cleanPath
    }

    return testimonialsData.map((item: TestimonialApiItem, index: number) => ({
      name: String(item.name || 'Pasien ' + (index + 1)),
      description: String(item.testimoni || ''),
      imgUrl: resolvePhoto(item, index),
      rating: Math.max(1, Math.min(5, Number(item.rating || 5))),
    }))
  }, [testimonialsData])

  const testimonialsSource = useMemo(
    () => (fetchedTestimonials.length > 0 ? fetchedTestimonials : testimonials),
    [fetchedTestimonials],
  )

  useEffect(() => {
    if (testimonialsSource.length === 0) return
    setCurrentTestimonial((prev) => prev % testimonialsSource.length)
  }, [testimonialsSource.length])

  useEffect(() => {
    if (testimonialsSource.length <= 1) return

    // Set interval tiap 3000ms (3 detik)
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) =>
          // Menggunakan modulo agar setelah index terakhir kembali ke 0
          (prev + 1) % testimonialsSource.length,
      )
    }, 3000)

    // Membersihkan interval saat komponen tidak lagi digunakan (unmount)
    // Ini penting agar tidak terjadi memory leak atau double interval
    return () => clearInterval(interval)
  }, [testimonialsSource.length])

  if (isLoading && fetchedTestimonials.length === 0) {
    return <div>Loading testimonials...</div>
  }

  if (error && fetchedTestimonials.length === 0) {
    return <div>Error loading testimonials: {error.message}</div>
  }

  if (testimonialsSource.length === 0) {
    return <div>Tidak ada testimoni.</div>
  }

  const activeIndex = currentTestimonial % testimonialsSource.length
  const testimonial = testimonialsSource[activeIndex]

  return (
    <section className="flex flex-col-reverse md:flex-row md:items-end gap-6 py-12 md:py-20 text-center justify-between max-w-6xl mx-6 md:w-full">
      {/* Sembunyikan seluruh decorative element di mobile */}
      <div className="hidden  lg:flex gap-2 items-end relative">
        <div className="bg-primary w-38.75 h-60.5 rounded-tr-4xl rounded-bl-4xl rounded" />
        <div className="bg-[#B9D654] w-39 h-24.5 rounded rounded-tl-4xl rounded-br-4xl" />
        <div className="absolute -right-40 -top-45 w-75 h-75">
          <motion.img
            src={decorativeFaces[0]}
            alt="Testimoni Image"
            className="w-30 rounded-full h-30 object-cover absolute top-12 right-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          />
          <motion.img
            src={decorativeFaces[1]}
            alt="Testimoni Image"
            className="w-18.5 rounded-full h-18.5 object-cover absolute top-12 -left-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          />
          <motion.img
            src={decorativeFaces[2]}
            alt="Testimoni Image"
            className="w-25 rounded-full h-25 object-cover absolute top-32"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          />
          <motion.img
            src={decorativeFaces[3]}
            alt="Testimoni Image"
            className="w-22.5 rounded-full h-22.5 object-cover absolute top-52 right-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          />
          <motion.img
            src={decorativeFaces[4]}
            alt="Testimoni Image"
            className="w-18.75 rounded-full h-18.75 object-cover absolute top-64 right-0 transform -translate-x-1/4 -translate-y-3/4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Mobile: tampilkan foto dalam grid biasa */}
      <div className="flex lg:hidden justify-center gap-3 flex-wrap mt-4">
        {decorativeFaces.map((face, i) => (
          <motion.img
            key={i}
            src={face}
            alt="Testimoni"
            className="w-14 h-14 rounded-full object-cover"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
      <div className="text-left flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="font-bold text-primary text-xl md:text-3xl"
        >
          Testimoni
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-black font-bold max-w-md text-2xl md:text-4xl"
        >
          Periksa apa yang dikatakan pasien tentang kami.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="bg-[#E0F4FB] p-4 gap-2 rounded-lg flex flex-col w-142 h-72 mt-6"
        >
          <img
            src="/icons/petik.svg"
            alt="Testimoni Image"
            className="w-6 h-6 object-cover"
          />
          <p className="text-muted-foreground text-sm md:text-lg mt-3 overflow-y-auto pr-1">
            {testimonial.description}
          </p>
          <div className="mt-auto flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div className="flex gap-1 mt-6">
              <img
                src={testimonial.imgUrl}
                alt="Testimoni Image"
                className="w-12 h-12 rounded-full shadow-lg object-cover"
              />
              <div className="flex flex-col justify-center">
                <p className="text-muted-foreground max-w-md md:text-lg">
                  {testimonial.name}
                </p>
                <div className="flex w-4 h-4 gap-1">
                  {Array.from({ length: testimonial.rating }).map(
                    (_, index) => (
                      <img
                        key={index}
                        src="/icons/star.svg"
                        alt="Testimoni Image"
                        className="shadow-lg object-cover"
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between self-end">
              <ChevronLeft
                className={
                  'bg-[#B4E5F6] rounded-full hover:bg-[#B4E5F6]/50 cursor-pointer'
                }
                onClick={() =>
                  setCurrentTestimonial(
                    (currentTestimonial - 1 + testimonialsSource.length) %
                      testimonialsSource.length,
                  )
                }
              />
              <div className="flex items-center gap-1 mx-2">
                {testimonialsSource.map((_, index) => (
                  <div
                    className={`w-2 h-2 ${activeIndex === index ? 'bg-[#B4E5F6]' : 'bg-[#B4E5F6]/50'} rounded-full`}
                    key={index}
                  ></div>
                ))}
              </div>
              <ChevronRight
                className={
                  'bg-[#B4E5F6] rounded-full hover:bg-[#B4E5F6]/50 cursor-pointer'
                }
                onClick={() =>
                  setCurrentTestimonial(
                    (currentTestimonial + 1) % testimonialsSource.length,
                  )
                }
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
