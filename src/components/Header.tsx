import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 backdrop-blur-lg flex justify-between py-6">
      <Link to="/s">TentangDental</Link>
      <div className="flex justify-center gap-4">
        <Button variant={'ghost'}>
          <Link to="/layanan">Layanan</Link>
        </Button>
        <Button variant={'ghost'}>
          <Link to="/promo">Promo</Link>
        </Button>
        <Button variant={'ghost'}>
          <Link to="/profil-dokter">Profil Dokter</Link>
        </Button>
      </div>
      <Button variant={'outline'}>
        <Link to="/reservasi/">Reservasi</Link>
      </Button>
    </header>
  )
}
