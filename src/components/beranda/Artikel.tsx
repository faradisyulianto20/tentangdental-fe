'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useArticles } from '#/hooks/useArtikel'
import type { ArticleApiItem } from '#/services/artikelService'
import { appEnv } from '@/lib/env'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Berita() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data: articlesData, isLoading, isError } = useArticles()

  const navigateBerita = (id: string) => {
    navigate({
      to: '/artikel',
      search: { id },
    })
  }

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'right' ? 300 : -300,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="text-center max-w-7xl px-16 mt-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-primary text-xl md:text-3xl font-bold"
      >
        Artikel Terkini
      </motion.h1>

      <div className="relative mt-12">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-0.5 bg-linear-to-b from-[#01C7FE] to-[#89FBA4] rounded-full shadow-md cursor-pointer"
        >
          <div className="bg-white rounded-full p-1.5">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </div>
        </button>

        {/* Scroll Container */}
        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {articlesData?.map((item, index) => (
            <ArtikelCard
              key={index}
              artikel={item}
              onClick={() => navigateBerita(item.id)}
            />
          ))}
        </motion.div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-0.5 bg-linear-to-b from-[#01C7FE] to-[#89FBA4] rounded-full shadow-md cursor-pointer"
        >
          <div className="bg-white rounded-full p-1.5">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </div>
        </button>
      </div>
    </div>
  )
}

export function ArtikelCard({
  artikel,
  onClick,
}: {
  artikel: ArticleApiItem
  onClick?: () => void
}) {
  const imageUrl = (() => {
    if (!artikel.image_url) return '/default-article.jpg'
    if (artikel.image_url.startsWith('http')) return artikel.image_url

    const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
    const cleanPath = artikel.image_url.replace(/^\/+/, '')
    return cleanBase + '/' + cleanPath
  })()

  return (
    <motion.div
      className="flex flex-col shrink-0 w-64 snap-start cursor-pointer hover:shadow-md rounded-md border"
      onClick={onClick}
      variants={itemVariants}
    >
      <div className="hover:shadow-md cursor-pointer">
        <img
          src={imageUrl}
          alt={artikel.title}
          className="rounded-t-xl w-64 h-44 object-cover"
        />
      </div>
      <div className="flex flex-col text-left p-4">
        <h2 className="text-lg font-semibold leading-5 line-clamp-2">
          {artikel.title}
        </h2>
        <p className="text-gray-600 mt-2 line-clamp-3 text-sm">
          {artikel.writer} • {artikel.published_at}
        </p>
      </div>
    </motion.div>
  )
}
