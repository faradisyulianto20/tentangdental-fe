import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/berita')({
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
  const { id } = Route.useSearch()

  console.log(id)

  return (
    <div className="mx-6 max-w-6xl flex justify-center flex-col items-center xl:mx-auto">
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="w-full my-12 rounded-xl max-w-290.65 h-111.75 overflow-hidden"
      >
        <img
          src={berita.imgPath}
          alt={berita.title}
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
          {berita.title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={0.35}
          initial="hidden"
          animate="visible"
          className="text-muted-foreground text-sm md:text-base mt-3"
        >
          {berita.penulis} - {berita.tanggal}
        </motion.p>
      </div>

      <motion.div
        variants={fadeUp}
        custom={0.5}
        initial="hidden"
        animate="visible"
        className="prose prose-sm md:prose-base max-w-none text-muted-foreground my-6"
        dangerouslySetInnerHTML={{ __html: berita.content }}
      />
    </div>
  )
}

const berita = {
  title: 'Apa Pentingnya Menjaga Kesehatan Gigi?',
  penulis: 'Dr. John Doe',
  tanggal: '12 Oktober 2023',
  subtitle:
    'Menjaga kesehatan gigi sangat penting untuk kesehatan secara keseluruhan. Gigi yang sehat tidak hanya membantu dalam mengunyah makanan dengan baik, tetapi juga berperan dalam menjaga kesehatan mulut dan mencegah berbagai masalah kesehatan lainnya.',
  imgPath: 'berita1.png',
  content: `
    <p>Menjaga kesehatan gigi melibatkan beberapa langkah penting, seperti menyikat gigi secara teratur, menggunakan benang gigi, dan rutin memeriksakan gigi ke dokter gigi. Dengan melakukan perawatan yang tepat, kita dapat mencegah kerusakan gigi, infeksi, dan masalah kesehatan mulut lainnya.</p>
    <p>Selain itu, menjaga kesehatan gigi juga dapat meningkatkan kepercayaan diri dan kualitas hidup. Gigi yang sehat dapat memberikan senyuman yang indah dan membantu dalam berkomunikasi dengan lebih baik.</p>
    <p>Oleh karena itu, penting bagi kita untuk memberikan perhatian khusus pada kesehatan gigi dan mulut kita. Dengan menjaga kebersihan gigi dan rutin memeriksakan gigi, kita dapat memastikan bahwa gigi kita tetap sehat dan kuat sepanjang hidup.</p>
  `,
}