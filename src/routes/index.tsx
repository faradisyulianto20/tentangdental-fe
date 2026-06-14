import { createFileRoute } from '@tanstack/react-router'
import Heroes from '../components/beranda/Heroes'
import Testimoni from '../components/beranda/Testimoni'
import Layanan from '../components/beranda/Layanan'
import Separator from '../components/beranda/Separator'
import Galeri from '../components/beranda/Galeri'
import ProfilDokter from '../components/beranda/ProfilDokter'
import Promo from '../components/beranda/Promo'
import Berita from '../components/beranda/Artikel'
import FAQ from '../components/beranda/FAQ'
export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="overflow-hidden w-full ">
      <div className="flex flex-col items-center justify-center mx-auto relative">
        <img
          className="absolute -top-10 -right-100 -z-10 w-3/4 pointer-events-none"
          src="bggradient.png"
        />
        <Heroes />
        <Testimoni />
        <Promo />
        <div id='layanan'>
          <Layanan />
        </div>
        <div className="bg-linear-to-r from-[#01C8FF] to-[#6DDFFF] w-full mt-16 py-6">
          <Separator />
        </div>
        <Galeri />
        <ProfilDokter />
        <Berita />
        <FAQ />
      </div>
    </div>
  )
}
