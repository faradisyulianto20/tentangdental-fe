import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { usePromos } from '@/hooks/usePromo'
import { useMemo } from 'react'
import type { PromoApiItem } from '@/services/promoService'
import { appEnv } from '@/lib/env'
import { Skeleton } from '../ui/skeleton'
import { PromoCard } from './Promo'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

type Promo = {
  judul: string
  imgUrl: string
  hargaAwal: number
  hargaDiskon: number
  detail: string
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function normalizePromoDetail(detail: string) {
  return decodeHtmlEntities(String(detail || ''))
}

export default function PromoPage() {
  const { data: promosData, isLoading } = usePromos()

  const fetchedPromos = useMemo(() => {
    if (!Array.isArray(promosData)) return []

    const resolveImage = (item: PromoApiItem) => {
      if (typeof item.image_url !== 'string' || item.image_url.length === 0) {
        return '/hero.png'
      }

      if (item.image_url.startsWith('http')) {
        return item.image_url
      }

      const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
      const cleanPath = item.image_url.replace(/^\/+/, '')
      return cleanBase + '/' + cleanPath
    }

    return promosData.map((item: PromoApiItem) => ({
      judul: String(item.name || 'Promo'),
      imgUrl: resolveImage(item),
      hargaAwal: Number(item.original_price || 0),
      hargaDiskon: Number(item.promo_price || 0),
      detail: String(item.detail || ''),
    }))
  }, [promosData])

  const promosSource = fetchedPromos.length > 0 ? fetchedPromos : []

  if (isLoading && fetchedPromos.length === 0) {
    return (
      <div className="text-center max-w-6xl mx-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-primary text-2xl md:text-4xl font-bold mt-6"
        >
          Promo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-muted-foreground text-sm md:text-base mt-3"
        >
          Temukan promo terbaik untuk harga terbaik
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-4 mt-6"
        >
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-primary w-59 flex flex-col gap-2"
            >
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="w-52 h-24 rounded-md" />
              <div className="flex flex-col mx-auto text-left w-full gap-1">
                <Skeleton className="h-3 w-32 rounded-md" />
                <Skeleton className="h-6 w-40 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </div>
              <Skeleton className="h-9 w-32 rounded-md mx-auto" />
            </div>
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="text-center max-w-6xl mx-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-primary text-2xl md:text-4xl font-bold mt-6"
      >
        Semua Promo
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-muted-foreground text-sm md:text-base mt-3"
      >
        Temukan promo terbaik untuk harga terbaik
      </motion.p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mt-6"
      >
        {promosSource.map((promo, index) => (
          <PromoCard key={index} promo={promo} variants={itemVariants} />
        ))}
      </motion.div>
    </div>
  )
}
