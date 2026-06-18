import { motion } from 'framer-motion'

const images = [
  '/heroes/hero5.png',
  '/heroes/hero4.png',
  '/heroes/hero3.png',
  '/heroes/hero2.png',
  '/heroes/hero1.png',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each image waits 0.1s after the previous one
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
}

export default function Heroes() {
  return (
    <section className="page-wrap flex flex-col md:flex-row items-center gap-6 md:pb-20 text-center max-w-6xl mx-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-left flex flex-col gap-3 max-w-screen mt-12 mb-6"
      >
        <h1 className="font-bold text-primary text-3xl sm:text-4xl md:text-6xl">
          Smile Makes A Lasting Impression
        </h1>
        <p className="text-muted-foreground max-w-md text-md sm:text-xl md:text-2xl">
          Senyumanmu memberikan kesan yang mendalam dan tak terlupakan.
        </p>
      </motion.div>
      <div className="flex justify-end items-end gap-2 w-full">
        {/* Mobile: grid 2 kolom, Desktop: layout custom */}

        {/* Mobile layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-2 md:hidden w-full"
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              className={`rounded-lg overflow-hidden ${i === 0 ? 'col-span-2 h-50' : 'h-30'}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <img
                src={src}
                alt={`Image ${i}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="hidden md:flex justify-end items-end gap-2"
        >
          <div className="gap-2 flex flex-col justify-end items-end">
            <div className="flex gap-2 justify-end items-end">
              <div className="flex flex-col items-end gap-2">
                <motion.div
                  variants={itemVariants}
                  className="w-16.5 h-16.75 rounded-lg overflow-hidden"
                >
                  <img
                    src={images[0]}
                    alt="Hero Image"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="w-33 h-9.75 rounded-lg overflow-hidden"
                >
                  <img
                    src={images[1]}
                    alt="Hero Image"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <motion.div
                variants={itemVariants}
                className="w-29.5 h-34.25 rounded-lg overflow-hidden"
              >
                <img
                  src={images[2]}
                  alt="Hero Image"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            <motion.div
              variants={itemVariants}
              className="w-66 h-20 rounded-lg overflow-hidden"
            >
              <img
                src={images[3]}
                alt="Hero Image"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          <motion.div
            variants={itemVariants}
            className="h-85.75 w-42.75 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={images[4]}
              alt="Hero Image"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
