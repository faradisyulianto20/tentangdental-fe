'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useArticles } from '#/hooks/useArtikel'
import type { ArticleApiItem } from '#/services/artikelService'
import { appEnv } from '@/lib/env'
import { Skeleton } from '../ui/skeleton'

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
  const { data: articlesData, isLoading } = useArticles()

  const navigateBerita = (id: string) => {
    navigate({ to: '/artikel', search: { id } })
  }

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'right' ? 300 : -300,
      behavior: 'smooth',
    })
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 mt-12 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-primary text-xl md:text-3xl font-bold"
        data-testid="artikel-heading"
      >
        Artikel Terkini
      </motion.h1>

      <div className="relative mt-12">
        {/* Left Arrow */}
        

        {/* Scroll Container */}
        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          data-testid="artikel-list"
        >
          {isLoading
            ? [...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col shrink-0 w-64 snap-start">
                  <Skeleton className="rounded-t-xl w-64 h-44" />
                  <div className="flex flex-col p-4 gap-2">
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-5 w-5/6 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md mt-2" />
                  </div>
                </div>
              ))
            : !articlesData || articlesData.length === 0
              ? null
              : (
                <>
                <button
                  onClick={() => scroll('left')}
                  className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-0.5 bg-linear-to-b from-[#01C7FE] to-[#89FBA4] rounded-full shadow-md cursor-pointer"
                  data-testid="artikel-prev-button"
                >
                  <div className="bg-white rounded-full p-1.5">
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </div>
                </button>
                {articlesData.map((item, index) => (
                  <ArtikelCard
                    key={item.id}
                    artikel={item}
                    index={index}
                    onClick={() => navigateBerita(String(item.id))}
                  />
                ))}
                        {/* Right Arrow */}
                  <button
                    onClick={() => scroll('right')}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-0.5 bg-linear-to-b from-[#01C7FE] to-[#89FBA4] rounded-full shadow-md cursor-pointer"
                    data-testid="artikel-next-button"
                  >
                    <div className="bg-white rounded-full p-1.5">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </div>
                  </button>
                </>
              )}
        </motion.div>

        {!isLoading && (!articlesData || articlesData.length === 0) && (
          <p className="text-muted-foreground mt-4" data-testid="artikel-empty-state">Artikel belum tersedia.</p>
        )}

      </div>
    </div>
  )
}

export function ArtikelCard({
  artikel,
  index,
  onClick,
}: {
  artikel: ArticleApiItem
  index: number
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
      data-testid={`artikel-card-${artikel.id}`}
    >
      <img
        src={imageUrl}
        alt={artikel.title}
        className="rounded-t-xl w-64 h-44 object-cover"
        data-testid={`artikel-image-${artikel.id}`}
      />
      <div className="flex flex-col text-left p-4">
        <h2 className="text-lg font-semibold leading-5 line-clamp-2" data-testid={`artikel-title-${artikel.id}`}>
          {artikel.title}
        </h2>
        <p className="text-gray-600 mt-2 line-clamp-3 text-sm" data-testid={`artikel-meta-${artikel.id}`}>
          {artikel.writer} • {artikel.published_at}
        </p>
      </div>
    </motion.div>
  )
}