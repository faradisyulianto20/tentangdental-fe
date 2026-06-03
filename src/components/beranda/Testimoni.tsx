import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTestimonials } from '../../hooks/useTestimonials'
import type { TestimonialApiItem } from '@/services/testimonialService'
import { appEnv } from '@/lib/env'
import { Skeleton } from '../ui/skeleton'

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
    () => (fetchedTestimonials.length > 0 ? fetchedTestimonials : []),
    [fetchedTestimonials],
  )

  const decodeHtmlEntities = (input: string) => {
    return input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
  }

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
    }, 5000)

    // Membersihkan interval saat komponen tidak lagi digunakan (unmount)
    // Ini penting agar tidak terjadi memory leak atau double interval
    return () => clearInterval(interval)
  }, [testimonialsSource.length])

  if (isLoading && fetchedTestimonials.length === 0) {
    return (
      <section className="flex flex-col-reverse md:flex-row md:items-end gap-6 py-12 md:py-20 text-center justify-between items-center w-full px-6 md:max-w-6xl">
        {/* Skeleton decorative elements */}
        <div className="hidden lg:flex gap-2 items-end relative">
          <div className="bg-muted w-38.75 h-60.5 rounded-tr-4xl rounded-bl-4xl rounded" />
          <div className="bg-muted w-39 h-24.5 rounded rounded-tl-4xl rounded-br-4xl" />
          <div className="absolute -right-40 -top-45 w-75 h-75">
            <Skeleton className="w-30 h-30 rounded-full absolute top-12 right-12" />
            <Skeleton className="w-18.5 h-18.5 rounded-full absolute top-12 -left-20" />
            <Skeleton className="w-25 h-25 rounded-full absolute top-32" />
            <Skeleton className="w-22.5 h-22.5 rounded-full absolute top-52 right-30" />
            <Skeleton className="w-18.75 h-18.75 rounded-full absolute top-64 right-0 transform -translate-x-1/4 -translate-y-3/4" />
          </div>
        </div>

        <div className="text-center lg:text-left flex flex-col gap-2 justify-center items-center lg:items-start">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-14 w-72 rounded-md" />

          <div className="bg-muted p-4 gap-2 rounded-lg flex flex-col w-full lg:w-142 h-72 mt-6">
            <Skeleton className="w-6 h-6 rounded" />

            <div className="space-y-3 mt-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            <div className="mt-auto flex flex-col md:flex-row gap-6 md:items-end justify-between">
              <div className="flex gap-4 w-fit">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex flex-col w-full gap-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex items-center gap-1 mx-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-2 h-2 rounded-full" />
                  ))}
                </div>
                <Skeleton className="w-6 h-6 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error && fetchedTestimonials.length === 0) {
    return <div>Error loading testimonials: {error.message}</div>
  }

  if (testimonialsSource.length === 0) {
    return (
      <section className="flex flex-col-reverse md:flex-row md:items-end gap-6 py-12 md:py-20 text-center justify-between items-center w-full px-6 md:max-w-6xl">
        <div className="text-center lg:text-left flex flex-col gap-2 justify-center items-center lg:items-start">
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
            className="text-black font-bold lg:max-w-md text-2xl md:text-4xl"
          >
            Periksa apa yang dikatakan pasien tentang kami.
          </motion.p>
          <p className="text-muted-foreground mt-6">Belum ada testimoni yang tersedia.</p>
        </div>
      </section>
    )
  }

  const activeIndex = currentTestimonial % testimonialsSource.length
  const testimonial = testimonialsSource[activeIndex]

  const index1 = (activeIndex + 1) % testimonialsSource.length

  const index2 = (activeIndex + 2) % testimonialsSource.length
  const index3 = (activeIndex + 3) % testimonialsSource.length
  const index4 = (activeIndex + 4) % testimonialsSource.length
  const index5 = (activeIndex + 5) % testimonialsSource.length

  return (
    <section className="flex flex-col-reverse md:flex-row md:items-end gap-6 py-12 md:py-20 text-center justify-between items-center w-full px-6 md:max-w-6xl" data-testid="testimoni-carousel">
      {/* Sembunyikan seluruh decorative element di mobile */}
      <div className="hidden  lg:flex gap-2 items-end relative">
        <div className="bg-primary w-38.75 h-60.5 rounded-tr-4xl rounded-bl-4xl rounded" />
        <div className="bg-[#B9D654] w-39 h-24.5 rounded rounded-tl-4xl rounded-br-4xl" />
        <div className="absolute -right-40 -top-45 w-75 h-75">
          <motion.img
            key={`img1-${index1}`}
            src={testimonialsSource[index1].imgUrl}
            alt="Testimoni Image"
            className="w-30 rounded-full h-30 object-cover absolute top-12 right-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            data-testid={`testimoni-preview-img-${index1}`}
          />
          <motion.img
            key={`img2-${index2}`}
            src={testimonialsSource[index2].imgUrl}
            alt="Testimoni Image"
            className="w-18.5 rounded-full h-18.5 object-cover absolute top-12 -left-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            data-testid={`testimoni-preview-img-${index2}`}
          />
          <motion.img
            key={`img3-${index3}`}
            src={testimonialsSource[index3].imgUrl}
            alt="Testimoni Image"
            className="w-25 rounded-full h-25 object-cover absolute top-32"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75 }}
            data-testid={`testimoni-preview-img-${index3}`}
          />
          <motion.img
            key={`img4-${index4}`}
            src={testimonialsSource[index4].imgUrl}
            alt="Testimoni Image"
            className="w-22.5 rounded-full h-22.5 object-cover absolute top-52 right-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85 }}
            data-testid={`testimoni-preview-img-${index4}`}
          />
          <motion.img
            key={`img5-${index5}`}
            src={testimonialsSource[index5].imgUrl}
            alt="Testimoni Image"
            className="w-18.75 rounded-full h-18.75 object-cover absolute top-64 right-0 transform -translate-x-1/4 -translate-y-3/4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.95 }}
            data-testid={`testimoni-preview-img-${index5}`}
          />
        </div>
      </div>
      <div className="text-center lg:text-left flex flex-col gap-2 justify-center items-center lg:items-start">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="font-bold text-primary text-xl md:text-3xl"
          data-testid="testimoni-heading"
        >
          Testimoni
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-black font-bold lg:max-w-md text-2xl md:text-4xl"
          data-testid="testimoni-subtitle"
        >
          Periksa apa yang dikatakan pasien tentang kami.
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="bg-[#E0F4FB] p-4 gap-2 rounded-lg flex flex-col  w-full lg:w-142 h-72 mt-6 "
            data-testid={`testimoni-item-${activeIndex}`}
          >
            <img
              src="/icons/petik.svg"
              alt="Testimoni Image"
              className="w-6 h-6 object-cover"
              data-testid="testimoni-quote-icon"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-md overflow-y-auto pr-1 leading-tight whitespace-normal prose prose-slate max-w-none prose-p:leading-tight no-scrollbar"
              dangerouslySetInnerHTML={{
                __html: decodeHtmlEntities(testimonial.description),
              }}
              data-testid="testimoni-content"
            />
            <div className="mt-auto flex flex-col md:flex-row gap-6 md:items-end justify-between">
              <div className="flex gap-4 w-fit">
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  src={testimonial.imgUrl}
                  alt="Testimoni Image"
                  className="w-16 h-16 rounded-full shadow-lg object-cover"
                  data-testid="testimoni-author-photo"
                />
                <div className="flex flex-col w-full mt-2">
                  <p className="font-bold max-w-md md:text-lg" data-testid="testimoni-author-name">
                    {testimonial.name}
                  </p>
                  <div className="flex w-4 h-4 gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`cursor-pointer ${
                          index < testimonial.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        data-testid={`testimoni-star-${index + 1}`}
                      >
                        <Star
                          fill={
                            index < testimonial.rating ? 'currentColor' : 'none'
                          }
                          size={14}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between self-center lg:self-end">
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
                  data-testid="testimoni-prev-button"
                />
                <div className="flex items-center gap-1 mx-2">
                  {testimonialsSource.map((_, index) => (
                    <div
                      className={`w-2 h-2 ${activeIndex === index ? 'bg-[#B4E5F6]' : 'bg-[#B4E5F6]/50'} rounded-full`}
                      key={index}
                      data-testid={`testimoni-dot-${index}`}
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
                  data-testid="testimoni-next-button"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
