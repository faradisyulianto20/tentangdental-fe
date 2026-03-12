import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-6xl mx-6 w-full">
      <div className="text-center my-12 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-primary text-xl md:text-3xl font-bold"
        >
          Pertanyaan yang Sering Ditanyakan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted-foreground text-sm md:text-base mt-3"
        >
          Temukan jawaban atas pertanyaan umum seputar perencanaan UMKM
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        className="flex flex-col gap-2 my-6 mx-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {faq.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="p-4 rounded-lg border border-primary flex flex-col gap-2 text-primary cursor-pointer"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex justify-between">
              <p
                className={`font-bold text-sm md:text-base ${openIndex === index ? 'line-clamp-none' : 'line-clamp-1'}`}
              >
                {item.pertanyaan}
              </p>
              <ChevronRight
                className={`text-muted-foreground transition-transform duration-300 ${openIndex === index ? 'rotate-90' : ''}`}
              />
            </div>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.p
                  key="jawaban"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="text-muted-foreground text-sm md:text-base overflow-hidden"
                >
                  {item.jawaban}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

const faq = [
  {
    pertanyaan: 'Apakah Tentang Dental menerima pasien baru?',
    jawaban:
      'Ya, kami dengan senang hati menerima pasien baru. Anda dapat menghubungi kami untuk membuat janji atau konsultasi.',
  },
  {
    pertanyaan: 'Apa saja layanan yang ditawarkan oleh Tentang Dental?',
    jawaban:
      'Kami menawarkan berbagai layanan perawatan gigi, termasuk pemeriksaan rutin, pembersihan, perawatan saluran akar, pemasangan gigi palsu, dan banyak lagi.',
  },
  {
    pertanyaan: 'Apakah Tentang Dental menerima asuransi kesehatan?',
    jawaban:
      'Ya, kami menerima berbagai jenis asuransi kesehatan. Silakan hubungi kami untuk informasi lebih lanjut tentang asuransi yang kami terima.',
  },
  {
    pertanyaan: 'Bagaimana cara membuat janji dengan Tentang Dental?',
    jawaban:
      'Anda dapat membuat janji dengan menghubungi kami melalui telepon, email, atau menggunakan formulir online di situs web kami.',
  },
]