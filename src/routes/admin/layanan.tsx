import { LayananCard } from '@/components/beranda/Layanan'
import LayananForm from '@/components/admin/layanan/LayananForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/layanan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <LayananForm />
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
      {
        layananList.map((layanan, index) => (
          <LayananCard key={index} layanan={layanan} />
        ))
      }
    </div>
  </div>
}


type LayananItem = {
  imgPath: string
  title: string
  subTitle: string
}

const layananList: LayananItem[] = [
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
  {
    imgPath: 'gigi.svg',
    title: 'Scaling',
    subTitle:
      'Scaling gigi adalah prosedur untuk membersihkan plak dan karang  gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  },
]
