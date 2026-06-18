import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="text-center max-w-6xl mx-6 md:mx-auto my-12">
      <motion.img
        src="/logo.svg"
        alt="Not Found"
        className="mx-auto w-24 h-24 object-cover"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-primary text-xl md:text-3xl font-bold mt-6"
      >
        404 - Halaman Tidak Ditemukan
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground text-sm md:text-base mt-3"
      >
        Maaf, halaman yang Anda cari tidak ditemukan.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </motion.div>
    </div>
  )
}
