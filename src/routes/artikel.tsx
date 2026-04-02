import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import Artikel from '../components/beranda/Artikel'
import { useArticles, useArticleBySlug } from '@/hooks/useArticles'

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
  const { data: artikel} = useArticles()
  const lastArticleId = artikel?.length ? artikel[artikel.length - 1].id : null
  if (!id) {
    id = String(lastArticleId)
  }
  const currentArticle = artikel?.find((item) => String(item.id) === String(id))
  const slug = currentArticle?.slug || ''
  console.log(slug)
  const { data: currentArtikel} = useArticleBySlug(slug)
  console.log(currentArtikel)

  return (
    <div className='mx-6 max-w-6xl flex flex-col justify-center items-center xl:mx-auto'>
      <div className="mx-6 max-w-6xl flex justify-center flex-col items-center xl:mx-auto">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="w-full my-12 rounded-xl max-w-290.65 h-111.75 overflow-hidden"
        >
          <img
            src={currentArtikel?.image_url || 'placeholder.png'}
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
          className="prose prose-sm md:prose-base max-w-none text-muted-foreground my-6"
          dangerouslySetInnerHTML={{ __html: currentArtikel?.content || '' }}
        />
      </div>
      <Artikel />
    </div>
  )
}
