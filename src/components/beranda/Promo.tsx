import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '../ui/skeleton'
import { usePromos } from '@/hooks/usePromo'
import { useMemo, useState } from 'react'
import type { PromoApiItem } from '#/services/promoService'
import { appEnv } from '@/lib/env'
import { X } from 'lucide-react'

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

// Modal lightbox untuk gambar penuh
function ImageLightbox({
  imgUrl,
  judul,
  onClose,
}: {
  imgUrl: string
  judul: string
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative max-w-2xl w-fit  mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={imgUrl}
            alt={judul}
            className="w-full h-auto rounded-xl shadow-2xl object-contain max-h-[80vh]"
          />
          <p className="text-white text-center mt-3 font-semibold text-lg">{judul}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function PromoCard({
  promo,
  variants,
}: {
  promo: Promo
  variants: any
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <motion.div
        variants={variants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="p-4 rounded-lg border border-primary sm:w-1/2 items-center md:w-59 flex flex-col gap-2 text-[#1682B1] shadow-md"
        data-testid={`promo-card-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="text-xl font-bold text-primary" data-testid={`promo-title-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}>{promo.judul}</div>

        {/* Image dengan hover zoom & klik untuk lightbox */}
        <div
          className="relative md:w-52 rounded-md overflow-hidden cursor-zoom-in"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setLightboxOpen(true)}
          data-testid={`promo-image-container-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <motion.img
            src={promo.imgUrl}
            alt={promo.judul}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-full md:h-full object-cover"
            data-testid={`promo-image-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}
          />
          {/* Overlay hint saat hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded-full">
                  Lihat Penuh
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col mx-auto text-left">
          <div className="text-primary text-xs line-through opacity-70" data-testid={`promo-original-price-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}>
            Rp {promo.hargaAwal.toLocaleString('id-ID')}
          </div>
          <div className="text-2xl font-bold text-primary" data-testid={`promo-discount-price-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}>
            Rp {promo.hargaDiskon.toLocaleString('id-ID')}
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: normalizePromoDetail(promo.detail) }}
          className="text-primary text-xs text-left overflow-auto md:h-32 leading-tight [&_p]:mb-1.5 [&_strong]:font-bold [&_em]:italic [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-1.5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1"
          data-testid={`promo-detail-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <Link to="/reservasi" className="mx-auto items-justify-end mt-auto">
          <Button className="bg-linear-to-r from-[#01C7FE] to-[#89FBA4] hover:shadow-md" data-testid={`promo-book-button-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}>
            Pesan Sekarang
          </Button>
        </Link>
      </motion.div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          imgUrl={promo.imgUrl}
          judul={promo.judul}
          onClose={() => setLightboxOpen(false)}
          data-testid={`promo-lightbox-${promo.judul.replace(/\s+/g, '-').toLowerCase()}`}
        />
      )}
    </>
  )
}

export default function Promo() {
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

  if (isLoading) {
    return (
      <div className="text-center max-w-6xl mx-6">
        <Skeleton className="h-9 w-24 rounded-md mx-auto mt-6" />
        <Skeleton className="h-5 w-64 rounded-md mx-auto mt-3" />
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-muted w-59 flex flex-col gap-2 shadow-md">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="w-52 h-24 rounded-md" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-7 w-36 rounded" />
              </div>
              <Skeleton className="h-32 w-full rounded" />
              <Skeleton className="h-9 w-32 rounded-md mx-auto mt-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (fetchedPromos.length === 0) {
    return (
      <div className="text-center max-w-6xl mx-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-primary text-xl md:text-3xl font-bold mt-6"
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
        <p className="text-muted-foreground mt-6">Promo belum tersedia.</p>
      </div>
    )
  }

  return (
    <div className="text-center max-w-6xl mx-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-primary text-xl md:text-3xl font-bold mt-6"
        data-testid="promo-heading"
      >
        Promo
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-muted-foreground text-sm md:text-base mt-3"
        data-testid="promo-subtitle"
      >
        Temukan promo terbaik untuk harga terbaik
      </motion.p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mt-6"
        data-testid="promo-list"
      >
        {promosSource.slice(0, 4).map((promo, index) => (
          <PromoCard key={index} promo={promo} variants={itemVariants} />
        ))}
      </motion.div>
      <Link to="/promo" className="mt-6 inline-block">
        <Button data-testid="promo-view-all-button">Lihat Semua Promo</Button>
      </Link>
    </div>
  )
}