import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Promo() {
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mt-6"
      >
        {promo.map((promo, index) => (
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="p-4 rounded-lg border border-primary w-59 flex flex-col gap-2 text-[#1682B1] shadow-md"
            key={index}
          >
            <div className="text-xl font-bold text-primary">{promo.judul}</div>
            <img
              src={promo.imgUrl}
              className="w-52 h-24 object-cover rounded-md"
            ></img>
            <div className="flex flex-col mx-auto text-left">
              <div className="text-primary text-xs line-through opacity-70">
                Rp {promo.hargaAwal.toLocaleString('id-ID')}
              </div>
              <div className="text-2xl font-bold text-primary">
                Rp {promo.hargaDiskon.toLocaleString('id-ID')}
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: promo.description }} className='font-bold text-primary text-xs text-left' />
            <Link to="/reservasi">
              <Button className="bg-linear-to-r from-[#01C7FE] to-[#89FBA4] hover:shadow-md">
                Pesan Sekarang
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <Link to={'/promo'} className="mt-6 inline-block">
        <Button>Lihat Semua Promo</Button>
      </Link>
    </div>
  )
}
const promo = [
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
  <div class="text-xs text-left">
    <p class="mb-1">
      Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.
    </p>
    <ul class="list-disc pl-4 space-y-1">
      <li>Pembersihan Saluran Akar</li>
      <li>Pengisian Saluran Akar</li>
      <li>Tambalan Sementara</li>
      <li>Konsultasi Dokter</li>
    </ul>
  </div>
`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
  <div class="text-xs text-left">
    <p class="mb-1">
      Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.
    </p>
    <ul class="list-disc pl-4 space-y-1">
      <li>Pembersihan Saluran Akar</li>
      <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>
    `,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
  <div>
    <p class="mb-1">
      Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.
    </p>
    <ul class="list-disc pl-4 space-y-1">
      <li>Pembersihan Saluran Akar</li>
      <li>Pengisian Saluran Akar</li>
      <li>Tambalan Sementara</li>
      <li>Konsultasi Dokter</li>
    </ul>
  </div>
`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
  <div class="text-xs text-left text-muted-foreground">
    <p class="mb-1">
      Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.
    </p>
    <ul class="list-disc pl-4 space-y-1">
      <li>Pembersihan Saluran Akar</li>
      <li>Pengisian Saluran Akar</li>
      <li>Tambalan Sementara</li>
      <li>Konsultasi Dokter</li>
    </ul>
  </div>
`,
  },
]
