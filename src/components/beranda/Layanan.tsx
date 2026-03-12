import { useNavigate } from '@tanstack/react-router'

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
            <h1 className="text-primary text-xl md:text-3xl font-bold">Layanan</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-3">Kami melayani berbagai perawatan gigi esensial, aesthetic gigi, Prostodonsia, dan perawatan gigi anak.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {layanan.map((item, index) => (
                    <button onClick={() => handleNavigate(item.title)} key={index} className="flex flex-col items-center gap-2 border p-6 border-primary rounded-lg cursor-pointer hover:shadow-md">
                        <img src={`/${item.imgPath}`} alt={item.title} className="w-12 h-12" />
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        <p className="text-muted-foreground text-center text-sm">{item.subTitle}</p>
                    </button>
                ))}
            </div>
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