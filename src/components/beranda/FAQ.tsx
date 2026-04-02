import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFaq } from '@/hooks/useFaq'
import type { FaqApiItem } from '#/services/faqService'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function FAQ() {
  const { data: faqData = [], isLoading, isError } = useFaq()  
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
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            index={index}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </motion.div>
    </div>
  )
}

export function FAQItem({
  item,
  isOpen,
  onClick,
}: {
  item: FaqApiItem
  index: number
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="p-4 rounded-lg border border-primary flex flex-col gap-2 text-primary cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <p
          className={`font-bold text-sm md:text-base ${isOpen ? 'line-clamp-none' : 'line-clamp-1'}`}
        >
          {item.question}
        </p>
        <ChevronRight
          className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.p
            key="jawaban"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-muted-foreground text-sm md:text-base overflow-hidden"
          >
            {item.answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
