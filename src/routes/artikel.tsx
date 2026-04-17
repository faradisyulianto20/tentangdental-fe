import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import Artikel from '../components/beranda/Artikel'
import { useArticles, useArticleBySlug } from '#/hooks/useArtikel'
import { appEnv } from '@/lib/env'
import { Skeleton } from '../components/ui/skeleton'

export const Route = createFileRoute('/artikel')({
  validateSearch: (search) => {
    return {
      id: search.id,
    }
  },
  component: RouteComponent,
})

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
}

function RouteComponent() {
  let { id } = Route.useSearch()
  const { data: artikel } = useArticles()
  const lastArticleId = artikel?.length ? artikel[artikel.length - 1].id : null
  if (!id) {
    id = String(lastArticleId)
  }
  const currentArticle = artikel?.find((item) => String(item.id) === String(id))
  const slug = currentArticle?.slug || ''
  const { data: currentArtikel, isLoading } = useArticleBySlug(slug)

  const resolveImage = (value: string | null | undefined) => {
    if (!value) return 'placeholder.png'
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 w-full">
        <Skeleton className="w-full my-12 rounded-xl h-96" />
        <div className="text-left w-full">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md mt-3" />
        </div>
        <div className="my-6 space-y-3 w-full">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <div className="space-y-3 mt-6">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="w-full my-12 rounded-xl overflow-hidden h-96"
        >
          <img
            src={resolveImage(currentArtikel?.image_url)}
            alt={currentArtikel?.title}
            className="object-cover w-full h-full"
          />
        </motion.div>

        <div className="text-left w-full">
          <motion.h1
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-3xl font-bold"
          >
            {currentArtikel?.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.35}
            initial="hidden"
            animate="visible"
            className="text-muted-foreground text-sm md:text-base mt-3"
          >
            {currentArtikel?.writer} - {currentArtikel?.published_at}
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          custom={0.5}
          initial="hidden"
          animate="visible"
          className="text-muted-foreground my-6 leading-relaxed [&_strong]:font-bold [&_em]:italic [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{
            __html: decodeHtmlEntities(currentArtikel?.content || ''),
          }}
        />
      </div>

      <Artikel />
    </div>
  )
}