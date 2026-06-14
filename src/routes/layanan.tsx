import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { useState, useEffect } from 'react'
import { useLayananById, useLayanan } from '@/hooks/useLayanan'
import { appEnv } from '@/lib/env'

export const Route = createFileRoute('/layanan')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: typeof search.id === 'string' ? search.id : '',
    }
  },
  component: RouteComponent,
})

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
}

function RouteComponent() {
  const [totalLayanan, setTotalLayanan] = useState(4)
  const navigate = useNavigate()
  const { id } = Route.useSearch()

  useEffect(() => {
    setTotalLayanan(4)
  }, [id])

  const {
    data: artikel,
    isLoading: isArtikelLoading,
    isError: isArtikelError,
  } = useLayananById(id)
  const {
    data: layanan = [],
    isLoading: isLayananLoading,
    isError: isLayananError,
  } = useLayanan()

  const resolveStorageUrl = (value: string | null | undefined) => {
    if (!value) return '/layanan-default.png'
    if (value.startsWith('http')) return value

    const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
    const cleanPath = value.replace(/^\/+/, '')
    return cleanBase + '/' + cleanPath
  }

  const decodeHtmlEntities = (input: string) => {
    return input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
  }

  const handleNavigate = (id: string) => {
    navigate({
      to: '/layanan',
      search: { id: id },
    })
  }

  const layananFiltered = layanan
    .filter((item) => item.id !== parseInt(id))
    .slice(0, totalLayanan)

  // Memeriksa apakah konten artikel tersedia dan tidak kosong
  const hasArticleContent =
    artikel?.article_content &&
    artikel?.article_content !== '' &&
    artikel?.article_content !== '<p></p>'

  if (isArtikelLoading || isLayananLoading) {
    return (
      <div className="mx-6 max-w-6xl flex justify-center flex-col items-center my-12 xl:mx-auto">
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-5 w-96 rounded-md mt-3" />
        <Skeleton className="w-full my-12 rounded-xl max-w-290.75 h-111.75" />
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
          <div className="w-full md:w-1/4">
            <Skeleton className="h-8 w-40 rounded-md" />
            <div className="flex flex-col gap-3 mt-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isArtikelError || isLayananError) {
    return (
      <div className="flex justify-center items-center h-64">
        Error loading data
      </div>
    )
  }

  return (
    <div className="mx-6 max-w-6xl flex justify-center flex-col items-center my-12 xl:mx-auto">
      <motion.h1
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="text-primary text-xl md:text-3xl font-bold"
      >
        {artikel?.name}
      </motion.h1>

      <motion.p
        variants={fadeUp}
        custom={0.15}
        initial="hidden"
        animate="visible"
        className="text-muted-foreground text-sm md:text-base mt-3 text-center"
      >
        {artikel?.detail}
      </motion.p>

      <motion.div
        variants={fadeUp}
        custom={0.3}
        initial="hidden"
        animate="visible"
        className="my-12 rounded-xl h-111.75 overflow-hidden w-full"
      >
        <img
          src={resolveStorageUrl(
            artikel?.support_image_url || artikel?.support_img_url,
          )}
          alt={artikel?.name ?? ''}
          className="object-cover h-full mx-auto"
        />
      </motion.div>

      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Kolom Artikel (Hanya tampil jika ada konten) */}
        {hasArticleContent && (
          <motion.div
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate="visible"
            className="max-w-none flex-1 leading-relaxed [&_p]:mb-2 [&_strong]:font-bold [&_em]:italic [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1"
            dangerouslySetInnerHTML={{
              __html: decodeHtmlEntities(artikel.article_content),
            }}
          />
        )}

        {/* Kolom Layanan Lainnya */}
        <div className={hasArticleContent ? 'w-full md:w-1/4' : 'w-full'}>
          <motion.h2
            variants={fadeUp}
            custom={0.45}
            initial="hidden"
            animate="visible"
            className="font-bold text-2xl"
          >
            Layanan Lainnya
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`mt-6 gap-3 ${
              hasArticleContent
                ? 'flex flex-col'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
            }`}
          >
            {layananFiltered.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-8 text-muted-foreground col-span-full"
              >
                Belum ada layanan lainnya
              </motion.div>
            ) : (
              layananFiltered.map((item) => (
                <motion.button
                  key={item.id}
                  variants={itemVariants}
                  onClick={() => handleNavigate(String(item.id))}
                  className="flex items-center text-left gap-2 border px-4 py-2 border-primary rounded-lg cursor-pointer hover:shadow-md w-full"
                >
                  <img
                    src={resolveStorageUrl(item.icon_url)}
                    alt={item.name}
                    className="w-8 h-8 shrink-0"
                  />
                  <div className="truncate">
                    <h2 className="text-base font-bold truncate">{item.name}</h2>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={0.5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={hasArticleContent ? '' : 'flex justify-center'}
          >
            <Button
              className="mt-6"
              onClick={() => setTotalLayanan((prev) => prev + 5)}
            >
              Lebih Banyak
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}