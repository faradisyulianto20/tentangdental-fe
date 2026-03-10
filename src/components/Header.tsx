import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Promo', href: '/promo' },
  { name: 'Layanan', href: '/layanan' },
  { name: 'Profil Dokter', href: '/profil-dokter' },
]

export default function Header() {
  const { location } = useRouterState()
  const currentPath = location.pathname
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg max-w-338 mx-auto w-full">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        <Link to="/" className="flex font-bold items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span>Tentang Dental</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex justify-center">
          {navigation.map((item) => {
            const isActive = currentPath === item.href
            return (
              <Button
                variant="ghost"
                key={item.name}
                className={isActive ? 'text-[#58C4EC]' : ''}
                asChild
              >
                <Link to={item.href}>{item.name}</Link>
              </Button>
            )
          })}
        </nav>

        <div className="hidden md:flex">
          <Button variant="default" asChild>
            <Link to="/reservasi">Reservasi</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 pb-4 gap-1 border-t border-gray-100">
          {navigation.map((item) => {
            const isActive = currentPath === item.href
            return (
              <Button
                variant="ghost"
                key={item.name}
                className={`justify-start ${isActive ? 'text-[#58C4EC]' : ''}`}
                asChild
                onClick={() => setMenuOpen(false)}
              >
                <Link to={item.href}>{item.name}</Link>
              </Button>
            )
          })}
          <Button variant="default" className="mt-2" asChild onClick={() => setMenuOpen(false)}>
            <Link to="/reservasi">Reservasi</Link>
          </Button>
        </div>
      )}
    </header>
  )
}