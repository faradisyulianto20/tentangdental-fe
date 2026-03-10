import { Link } from '@tanstack/react-router'

export default function Layanan() {
    return (
        <div className="text-center">
            <h1 className="text-primary text-3xl font-bold">Layanan</h1>
            <p className="text-muted-foreground">Kami melayani berbagai perawatan gigi esensial, aesthetic gigi, Prostodonsia, dan perawatan gigi anak.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {layanan.map((item, index) => (
                    <Link to={`Artikel?id=${item.title}`} key={index} className="flex flex-col items-center gap-2 border p-6 border-primary rounded-lg cursor-pointer hover:shadow-md">
                        <img src={`/${item.imgPath}`} alt={item.title} className="w-12 h-12" />
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        <p className="text-muted-foreground text-center text-sm">{item.subTitle}</p>
                    </Link>
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