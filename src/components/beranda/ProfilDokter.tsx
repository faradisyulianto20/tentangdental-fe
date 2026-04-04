import { motion } from 'framer-motion'
import { useDokter } from '@/hooks/useDokter'
import type { DoctorApiItem } from '#/services/dokterService'
import { appEnv } from '@/lib/env'

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
        <div className="p-4">
          <p className="text-muted-foreground text-sm">{dokter?.statement}</p>
          <p className="font-bold text-lg mt-6">{dokter?.name}</p>
          <p className="font-bold text-muted-foreground">
            {dokter.specialization}
          </p>
        </div>
        <div className="w-full md:relative h-fit md:h-auto flex justify-center">
          <img
            src={photoUrl}
            className="md:w-92 object-cover md:absolute md:right-0 z-10 -bottom-4 max-h-100"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function ProfilDokter() {
  const { data: doctors } = useDokter()

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
