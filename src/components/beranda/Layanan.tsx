import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    transition: { duration: 5 }
}

export default function Layanan() {
    const navigate = useNavigate()

    const handleNavigate = (id: string) => {
        navigate({
            to: '/layanan',
            search: {
                id,
            },
        })
    }

    return (
        <div className="text-center max-w-6xl mx-6 mt-12">
            <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-primary text-xl md:text-3xl font-bold">Layanan</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-muted-foreground text-sm md:text-base mt-3">Kami melayani berbagai perawatan gigi esensial, aesthetic gigi, Prostodonsia, dan perawatan gigi anak.</motion.p>

            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {layanan.map((item, index) => (
                    <motion.button 
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        onClick={() => handleNavigate(item.title)}
                        key={index}
                        className="flex flex-col items-center gap-2 border p-6 border-primary rounded-lg cursor-pointer hover:shadow-md"
                    >
                        <img src={`/${item.imgPath}`} alt={item.title} className="w-12 h-12" />
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        <p className="text-muted-foreground text-center text-sm">{item.subTitle}</p>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    )
}

const layanan = [
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
    {
        imgPath: 'gigi.svg',
        title: 'Scaling',
        subTitle: 'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.'
    },
]