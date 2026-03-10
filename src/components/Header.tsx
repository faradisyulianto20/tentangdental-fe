import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useState } from 'react'

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Promo', href: '/promo' },
  { name: 'Layanan', href: '/layanan' },
  { name: 'Profil Dokter', href: '/profil-dokter' },
]

export default function Header() {
  const [navItems, setNavItems] = useState('Beranda')

  return (
    <header className="sticky top-0 z-50 px-10 backdrop-blur-lg flex justify-between py-6 max-w-338 mx-auto">
      <Link to="/" className="flex font-bold min-w-38.5 items-center">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
        Tentang Dental
      </Link>
      <div className="flex justify-center">
        {navigation.map((item) => (
          <Button
            variant={'ghost'}
            key={item.name}
            data-active={navItems === item.name}
            className={`${navItems === item.name ? 'text-[#58C4EC]' : ''}`}
            onClick={() => setNavItems(item.name)}
          >
            <Link to={item.href}>{item.name}</Link>
          </Button>
        ))}
      </div>
      <div className="min-w-38.5 justify-end flex">
        <Button variant={'default'}>
          <Link to="/reservasi">Reservasi</Link>
        </Button>
      </div>
    </header>
  )
}
