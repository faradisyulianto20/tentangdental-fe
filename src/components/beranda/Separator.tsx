import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

export default function Separator() {
  return (
    <div className="bg-linear-to-r from-[#01C8FF] to-[#6DDFFF] p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6  max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center md:text-left">
          Konsultasi kesehatan dan mulutmu
        </h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Link to="/reservasi">
            <Button
              variant={'default'}
              className="bg-white hover:bg-white text-primary shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              Reservasi Sekarang
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
