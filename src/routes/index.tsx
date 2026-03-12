import { createFileRoute } from '@tanstack/react-router'
import Heroes from '../components/beranda/Heroes'
import Testimoni from '../components/beranda/Testimoni'
import Layanan from '../components/beranda/Layanan'
import Separator from '../components/beranda/Separator'
import Galeri from '../components/beranda/Galeri'
import ProfilDokter from '../components/beranda/ProfilDokter'
import Promo from '../components/beranda/Promo'
import Berita from '../components/beranda/Berita'
import FAQ from '../components/beranda/FAQ'
export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="overflow-hidden w-full">
      <div className="flex flex-col items-center justify-center mx-auto relative">
        <img
          className="absolute -top-10 -right-[400px] -z-10 w-3/4 pointer-events-none"
          src="bggradient.png"
        />
        <Heroes />
        <Testimoni />
        <Promo />
        <Layanan />
        <div className="bg-gradient-to-r from-[#01C8FF] to-[#6DDFFF] w-full mt-6 py-6">
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
