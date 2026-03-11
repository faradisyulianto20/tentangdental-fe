import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { Triangle } from 'lucide-react'

export default function Promo() {
  return (
    <div className="text-center max-w-6xl">
      <h1 className="text-primary text-3xl font-bold mt-6">Promo</h1>
      <p className="text-muted-foreground">
        Temukan promo terbaik untuk harga terbaik
      </p>
      <div className="flex justify-center gap-4 mt-6">
        {promo.map((promo, index) => (
          <div className="p-4 rounded-lg border border-primary w-[236px] flex flex-col gap-2 text-[#1682B1]">
            <div className="text-xl font-bold text-primary">{promo.judul}</div>
            <img
              src={promo.imgUrl}
              className="w-52 h-24 object-cover rounded-md"
            ></img>
            <div className="flex flex-col mx-auto text-left">
              <div className="text-primary text-xs">
                Rp {promo.hargaAwal.toLocaleString('id-ID')}
              </div>
              <div className="text-2xl font-bold text-primary">
                Rp {promo.hargaDiskon.toLocaleString('id-ID')}
              </div>
            </div>
            <ul className="text-left text-primary leading-5 min-h-32">
              {promo.benefit.map((benefit, index) => (
                <li key={index} className="flex gap-1 items-center text-sm">
                  <Triangle className="w-2 h-2 rotate-180 " /> {benefit}
                </li>
              ))}
            </ul>
            <Link to={`reservasi?id=${promo.judul}`}>
              <Button>Pesan Sekarang</Button>
            </Link>
          </div>
        ))}
      </div>
      <Link to={'/promo'} className="mt-6 inline-block">
        <Button>Lihat Semua Promo</Button>
      </Link>
    </div>
  )
}

const promo = [
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    benefit: [
      'Pembersihan Saluran Akar',
      'Pengisian Saluran Akar',
      'Tambalan Sementara',
      'Konsultasi',
    ],
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    benefit: [
      'Pembersihan Saluran Akar',
      'Pengisian Saluran Akar',
      'Tambalan Sementara',
      'Konsultasi',
    ],
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    benefit: [
      'Pembersihan Saluran Akar',
      'Pengisian Saluran Akar',
      'Tambalan Sementara',
      'Konsultasi',
    ],
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: 'hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    benefit: [
      'Pembersihan Saluran Akar',
      'Pengisian Saluran Akar',
      'Tambalan Sementara',
      'Konsultasi',
    ],
  },
]
