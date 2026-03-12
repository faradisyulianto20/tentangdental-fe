import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-(--footer-bg) text-center text-sm text-(--text-muted) border mt-6">
      <div className="page-wrap py-10 flex justify-evenly md:flex-row flex-col gap-2 mx-6">
        <div className="flex flex-col gap-2">
          <div className="flex">
            <img src="logo.svg" alt="Logo" className="w-24" />
            <div className="flex flex-col text-left justify-center">
              <p className="font-bold text-2xl">Tentang Dental</p>
              <p className="text-muted-foreground">
                Praktik Dokter Gigi Spesialis Konservasi
              </p>
            </div>
          </div>
          <div className="text-left font-medium text-muted-foreground">
            Sab, Min, Sen, Kam:{' '}
            <span className="text-primary">08:00 - 21:00</span> (dg reservasi){' '}
            <br></br>
            Rab & Jum: <span className="text-primary">14:00 - 21:00 </span>(dg reservasi) <br></br>
            Sel : <span className="text-primary">Libur</span>
          </div>
          <div className="flex gap-1">
            {socialMedia.map((item, index) => {
              const Icon = item.icon
              return (
                <>
                  <a
                    href={item.url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black border border-black rounded-full p-1.5 hover:text-primary hover:border-primary"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                </>
              )
            })}
          </div>
        </div>
        <div className="text-left">
          <p className="font-bold text-xl mb-2">Menu</p>
          <ul className="text-left text-muted-foreground ">
            {menu.map((menu, index) => (
              <li key={index}>
                <Link
                  to={menu.url}
                  className={'font-semibold text-sm hover:text-primary'}
                >
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <p className="font-bold text-xl mb-2">Alamat</p>
          <div className="w-37.5 md:w-75 h-37.5 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.7!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPuri+Permata+Cipondoh!5e0!3m2!1sen!2sid!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <p className="m-0">&copy; {year} Tentang Dental. All rights reserved.</p>
    </footer>
  )
}

const socialMedia = [
  {
    name: 'WhatsApp',
    url: 'https://api.whatsapp.com/send/?phone=628132059835&text=Halo+Tentang+Dental%21&type=phone_number&app_absent=0',
    icon: MessageCircle,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/tentangdental.id?igsh=bXZmMWtwdTM3eG8z',
    icon: Instagram,
  },
  {
    name: 'Gmail',
    url: 'mailto:tentangdental@gmail.com',
    icon: Mail,
  },
  {
    name: 'Maps',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.7!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPuri+Permata+Cipondoh!5e0!3m2!1sen!2sid!4v1',
    icon: MapPin,
  },
]

const menu = [
  {
    title: 'Promo',
    url: '/promo',
  },
  {
    title: 'Layanan',
    url: '/layanan',
  },
  {
    title: 'Profil Dokter',
    url: '/profildokter',
  },
  {
    title: 'Reservasi',
    url: '/reservasi',
  },
]
