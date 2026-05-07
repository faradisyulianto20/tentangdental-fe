import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useLayanan } from '#/hooks/useLayanan'

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Promo', href: '/promo' },
  { name: 'Layanan', href: '/layanan', hasDropdown: true },
  { name: 'Artikel', href: '/artikel' },
  { name: 'Profil Dokter', href: '/profil-dokter' },
] as const

export default function Header() {
  const { data: layananData = [] } = useLayanan()
  const { location } = useRouterState()
  const currentPath = location.pathname
  const [menuOpen, setMenuOpen] = useState(false)
  const [layananOpen, setLayananOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileLayananRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const insideDesktop = dropdownRef.current?.contains(e.target as Node)
      const insideMobile = mobileLayananRef.current?.contains(e.target as Node)
      if (!insideDesktop && !insideMobile) {
        setLayananOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  console.log('Layanan data:', layananData.length, layananData)

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 max-w-screen ${
        scrolled ? 'px-4 pt-3' : 'px-0 pt-0'
      }`}
    >
      <header
        className={`bg-white w-full shadow-sm transition-all duration-300 ${
          scrolled ? 'rounded-2xl shadow-md' : 'rounded-none shadow-sm'
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-10 py-4">
          <Link to="/" className="flex font-bold items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span>Tentang Dental</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex justify-center items-center">
            {navigation.map((item) => {
              const isActive =
                currentPath === item.href ||
                currentPath.startsWith(item.href + '/')

              if ('hasDropdown' in item && item.hasDropdown) {
                return (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <Button
                      variant="ghost"
                      className={`gap-1 ${isActive ? 'text-[#58C4EC]' : ''}`}
                      onClick={() => setLayananOpen((prev) => !prev)}
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${layananOpen ? 'rotate-180' : ''}`}
                      />
                    </Button>
                    {layananOpen && (
                      layananData.length === 0 ? (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-105 bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center z-50">
                          <p className="text-sm text-gray-700">Data layanan belum tersedia.</p>
                        </div>
                      ) : (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-105 bg-white rounded-xl shadow-lg border border-gray-100 p-4 grid grid-cols-3 gap-2 z-50">
                          {layananData.map((item) => (
                            <Link
                              key={item.name}
                              to="/layanan"
                              search={{ id: String(item.id) }}
                              onClick={() => setLayananOpen(false)}
                              className="text-sm text-gray-700 hover:text-[#58C4EC] hover:bg-blue-50 rounded-lg p-2 transition"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )
              }

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

              if ('hasDropdown' in item && item.hasDropdown) {
                return (
                  <div key={item.name} ref={mobileLayananRef}>
                    <Button
                      variant="ghost"
                      className={`justify-start w-full gap-1 mx-1 ${isActive ? 'text-[#58C4EC]' : ''}`}
                      onClick={() => setLayananOpen((prev) => !prev)}
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${layananOpen ? 'rotate-180' : ''}`}
                      />
                    </Button>

                    {layananOpen && (
                      layananData.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-100 p-4 mt-2 text-center">
                          <p className="text-sm text-gray-700">Data layanan belum tersedia.</p>
                        </div>
                      ) : (
                      <div className="grid grid-cols-2 gap-1 pl-4 pb-2">
                        {layananData.map((item) => (
                          <Link
                            key={item.name}
                            to="/layanan"
                            search={{ id: String(item.id) }}
                            onClick={() => {
                              setLayananOpen(false)
                              setMenuOpen(false)
                            }}
                            className="text-sm text-gray-700 hover:text-[#58C4EC] rounded-lg py-2 transition"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              }

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
            <Button
              variant="default"
              className="mt-2"
              asChild
              onClick={() => setMenuOpen(false)}
            >
              <Link to="/reservasi">Reservasi</Link>
            </Button>
          </div>
        )}
      </header>
    </div>
  )
}