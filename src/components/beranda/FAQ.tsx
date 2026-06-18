import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFaq } from '@/hooks/useFaq'
import type { FaqApiItem } from '#/services/faqService'
import { Skeleton } from '../ui/skeleton'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function FAQ() {
  const { data: faqData, isLoading } = useFaq()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const heading = (
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
        Temukan jawaban atas pertanyaan umum seputar Tentang Dental
      </motion.p>
    </div>
  )

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-6 w-full">
        {heading}
        <div className="flex flex-col gap-2 my-6 mx-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-muted flex flex-col gap-2"
            >
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-6 w-full">
      {heading}

      <motion.div
        variants={containerVariants}
        className="flex flex-col gap-2 my-6 mx-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        data-testid="faq-list"
      >
        {!faqData || faqData.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-lg border border-primary text-center text-muted-foreground"
            data-testid="faq-empty-state"
          >
            Belum ada pertanyaan yang sering ditanyakan
          </motion.div>
        ) : (
          faqData.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))
        )}
      </motion.div>
    </div>
  )
}

export function FAQItem({
  item,
  index,
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
      data-testid={`faq-item-${index}`}
    >
      <div className="flex justify-between">
        <p
          className={`font-bold text-sm md:text-base ${isOpen ? 'line-clamp-none' : 'line-clamp-1'}`}
          data-testid={`faq-question-${index}`}
        >
          {item.question}
        </p>
        <ChevronRight
          className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          data-testid={`faq-toggle-${index}`}
        />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="jawaban"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-muted-foreground text-sm md:text-base overflow-hidden leading-relaxed [&_strong]:font-bold [&_em]:italic [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{
              __html: String(item.answer || '')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&'),
            }}
            data-testid={`faq-answer-${index}`}
          ></motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
