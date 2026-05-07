import { motion } from 'framer-motion'
import { useDokter } from '@/hooks/useDokter'
import type { DoctorApiItem } from '#/services/dokterService'
import { appEnv } from '@/lib/env'
import { Skeleton } from '../ui/skeleton'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 2 },
}

export function ProfilDokterCard({
  dokter,
  index,
}: {
  dokter: DoctorApiItem
  index: number
}) {
  const decodeHtmlEntities = (input: string) => {
    return input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
  }

  const photoUrl = (() => {
    if (!dokter.photo_url) return '/dokter.png'
    if (dokter.photo_url.startsWith('http')) return dokter.photo_url

    const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
    const cleanPath = dokter.photo_url.replace(/^\/+/, '')
    return cleanBase + '/' + cleanPath
  })()

  return (
    <motion.div
      className={`${index % 2 === 0 ? 'ms-auto flex-col-reverse md:flex-row' : 'flex-col-reverse md:flex-row-reverse'} p-0.5 bg-linear-to-r from-[#01C7FE] to-[#89FBA4] flex md:w-3/4 rounded-lg shadow-md mt-6`}
      variants={itemVariants}
    >
      <div
        className={`${index % 2 === 0 ? 'flex-col-reverse md:flex-row' : 'flex-col-reverse md:flex-row-reverse'} flex w-full rounded-[6px] bg-white dark:bg-zinc-950`}
      >
        <div className="p-4 flex-1 flex flex-col-reverse md:flex-col justify-center">
          <div
            className="text-muted-foreground text-sm leading-relaxed [&_strong]:font-bold [&_em]:italic [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{
              __html: decodeHtmlEntities(String(dokter?.statement || '')),
            }}
          />
          <p className="font-bold text-lg md:mt-6">{dokter?.name}</p>
          <p className="font-bold text-muted-foreground">
            {dokter.specialization}
          </p>
        </div>
        <div className="w-full md:relative h-fit md:h-auto flex justify-center md:w-72">
          <img
            src={photoUrl}
            className={`object-cover md:absolute ${index % 2 === 0 ? 'md:right-0' : 'md:left-0'} z-10 bottom-0 max-h-100`}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function ProfilDokter() {
  const { data: doctors, isLoading } = useDokter()

  if (isLoading) {
    return (
      <div className="max-w-6xl relative mx-6 mt-12">
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-14 w-72 rounded-md mt-2" />
        <div className="flex flex-col gap-4 mt-6 justify-center w-full">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="max-w-6xl relative mx-6 mt-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary text-xl md:text-3xl font-bold"
        >
          Profil Dokter
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground mb-12 text-sm md:text-base"
        >
          Temukan dokter-dokter profesional
        </motion.p>
        <p className="text-muted-foreground mt-6">Data dokter belum tersedia.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl relative mx-6 mt-12">
      <img
        className="absolute -right-100 -top-175 -z-10 w-3/4 pointer-events-none"
        src="bgblue.png"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-primary text-xl md:text-3xl font-bold"
      >
        Profil Dokter
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground mb-12 text-sm md:text-base"
      >
        Temukan dokter-dokter profesional
      </motion.p>
      <motion.div
        className="flex flex-col gap-4 mt-6 justify-center w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {doctors?.map((dokter, index) => (
          <ProfilDokterCard key={index} dokter={dokter} index={index} />
        ))}
      </motion.div>
    </div>
  )
}
