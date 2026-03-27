import TestimoniForm from '@/components/admin/testimoni/TestimoniForm'
import { createFileRoute } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { FileUpload } from '#/components/ui/file-upload'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'

export const Route = createFileRoute('/admin/testimoni')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedTestimoni, setSelectedTestimoni] = useState<typeof testimoniList[0] | null>(null)

  return (
    <div>
      <TestimoniForm />
      <div className="flex flex-col gap-4 mt-6">
        {testimoniList.map((testimoni, index) => (
          <TestimoniCard
            key={index}
            testimoni={testimoni}
            onClick={() => setSelectedTestimoni(testimoni)}
          />
        ))}
      </div>

      <Dialog open={!!selectedTestimoni} onOpenChange={(open) => !open && setSelectedTestimoni(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <form className="space-y-4">
            <Field>
              <FieldLabel>Foto</FieldLabel>
              <FileUpload label="Unggah Foto" />
            </Field>
            <Field>
              <FieldLabel>Nama</FieldLabel>
              <Input
                type="text"
                placeholder="Masukkan Nama"
                defaultValue={selectedTestimoni?.name}
              />
            </Field>
            <Field className="gap-0">
              <FieldLabel>Rating</FieldLabel>
              <RatingInput defaultValue={selectedTestimoni?.rating ?? 0} />
            </Field>
            <Field>
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea
                placeholder="Masukkan Deskripsi"
                defaultValue={selectedTestimoni?.description}
              />
            </Field>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" >Batal</Button>
              </DialogClose>
              <Button type="button" className='bg-red-400 hover:bg-red-500'>Hapus Testimoni</Button>
              <Button type="submit" className="bg-[#B9D654] text-white hover:bg-[#A8C24A]">
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RatingInput({ defaultValue = 0 }: { defaultValue?: number }) {
  const [rating, setRating] = useState(defaultValue)

  return (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => setRating(i + 1)}
        >
          <Star fill={i < rating ? 'currentColor' : 'none'} />
        </span>
      ))}
    </div>
  )
}

export function TestimoniCard({
  testimoni,
  onClick,
}: {
  testimoni: (typeof testimoniList)[0]
  onClick?: () => void
}) {
  return (
    <div onClick={onClick} className="flex border rounded-lg p-4 gap-2 cursor-pointer">
      <img
        src={testimoni.imgUrl}
        alt={testimoni.name}
        className="w-16 h-16 rounded-full object-cover shrink-0"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">{testimoni.name}</p>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className="w-4 h-4"
              color="oklch(0.905 0.182 98.244)"
              fill={i < testimoni.rating ? 'oklch(0.905 0.182 98.244)' : 'none'}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {testimoni.description}
        </p>
      </div>
    </div>
  )
}

const testimoniList = [
  {
    name: 'Budi Santoso',
    description: 'Pelayanan di Tentang Dental sangat profesional. Proses scaling giginya cepat dan tidak sakit sama sekali. Ruang tunggunya juga nyaman banget!',
    imgUrl: '/muka.svg',
    rating: 5,
  },
  {
    name: 'Siti Aminah',
    description: 'Dokternya sangat sabar menjelaskan detail kesehatan gigi saya. Fasilitasnya modern dan sangat bersih. Sangat direkomendasikan untuk keluarga.',
    imgUrl: '/muka2.svg',
    rating: 5,
  },
  {
    name: 'Rian Hidayat',
    description: 'Tempat praktik gigi terbaik di kota ini. Harganya cukup terjangkau dengan kualitas pelayanan bintang lima. Staf administrasinya juga ramah.',
    imgUrl: '/muka3.svg',
    rating: 4,
  },
  {
    name: 'Dewi Lestari',
    description: 'Baru pertama kali ke sini untuk cabut gigi bungsu dan pengalamannya luar biasa minim rasa sakit. Alat-alatnya terlihat sangat steril.',
    imgUrl: '/muka4.svg',
    rating: 5,
  },
  {
    name: 'Andi Wijaya',
    description: 'Sistem booking-nya sangat mudah via WhatsApp. Tidak perlu antre lama karena jadwalnya sangat on-time. Dokter giginya sangat berpengalaman.',
    imgUrl: '/muka5.svg',
    rating: 4,
  },
  {
    name: 'Farah Quinnisa',
    description: 'Sangat puas dengan hasil pemutihan gigi (bleaching) di sini. Hasilnya natural dan konsultasinya sangat mendalam. Sukses terus Tentang Dental!',
    imgUrl: '/muka6.svg',
    rating: 5,
  },
]