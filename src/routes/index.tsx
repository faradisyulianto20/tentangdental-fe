import { createFileRoute } from '@tanstack/react-router'
import Heroes from '../components/beranda/Heroes'
import Testimoni from '../components/beranda/Testimoni'
import Layanan from '../components/beranda/Layanan'
import Separator from '../components/beranda/Separator'
import Galeri from '../components/beranda/Galeri'
import ProfilDokter from "../components/beranda/ProfilDokter"
import Promo from "../components/beranda/Promo"
export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="max-w-7xl flex flex-col items-center justify-center mx-auto">
      <Heroes />
      <Testimoni />
      <Layanan />
      <div className='bg-gradient-to-r from-[#01C8FF] to-[#6DDFFF]  w-full mt-6 py-6'>
        <Separator />
      </div>
      <Galeri />
      <ProfilDokter />
      <Promo />
    </div>
  )
}
