import { createFileRoute } from '@tanstack/react-router'

import { PromoCard } from "@/components/beranda/Promo"
import PromoForm from '@/components/admin/promo/PromoForm'

export const Route = createFileRoute('/admin/promo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <PromoForm />
    <div className='grid grid-cols-4 space-y-6'>
      {
        promos.map((promo, index) => (
          <PromoCard key={index} promo={promo} variants={null} />
        ))
      }
    </div>
  </div>
}

type Promo = {
  judul: string
  imgUrl: string
  hargaAwal: number
  hargaDiskon: number
  description: string
}

const promos: Promo[] = [
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
]
