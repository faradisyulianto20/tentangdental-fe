import { ProfilDokterCard } from '@/components/beranda/ProfilDokter'
import ProfilDokterForm from '@/components/admin/profil-dokter/ProfilDokterForm'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { MultiSelect } from '@/components/ui/multi-select'

export const Route = createFileRoute('/admin/profil-dokter')({
  component: RouteComponent,
})

const jadwal = [
  'Senin 08.00 - 16.00',
  'Selasa 08.00 - 16.00',
  'Rabu 08.00 - 16.00',
  'Kamis 08.00 - 16.00',
  'Jumat 08.00 - 16.00',
]

function RouteComponent() {
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null)
  const [selectedJadwal, setSelectedJadwal] = useState<string[]>([])

  const handleOpen = (dokter: Dokter) => {
    setSelectedDokter(dokter)
    setSelectedJadwal(dokter.jadwal ?? [])
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelectedDokter(null)
      setSelectedJadwal([])
    }
  }

  return (
    <div>
      <ProfilDokterForm />
      <div className="flex flex-col gap-4 mt-12 justify-center w-full">
        {listDokter.map((dokter, index) => (
          <div key={index} onClick={() => handleOpen(dokter)} className="cursor-pointer">
            <ProfilDokterCard dokter={dokter} index={index} />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedDokter} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <form className="space-y-4">
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Nama</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Masukkan Nama Dokter"
                      defaultValue={selectedDokter?.nama}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Spesialitas</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Masukkan Spesialitas Dokter"
                      defaultValue={selectedDokter?.spesialis}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Deskripsi</FieldLabel>
                    <Textarea
                      placeholder="Masukkan Deskripsi Dokter"
                      className="h-32 resize-none"
                      defaultValue={selectedDokter?.deskripsi}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Jadwal</FieldLabel>
                    <MultiSelect
                      items={jadwal}
                      value={selectedJadwal}
                      onChange={setSelectedJadwal}
                      placeholder="Pilih jadwal..."
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Gambar</FieldLabel>
                    <FileUpload label="Unggah Gambar" />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
                </DialogClose>
                <Button type="button" className='bg-red-400 hover:bg-red-500'>Hapus Dokter</Button>
                <Button type="submit" className="bg-[#B9D654] text-white hover:bg-[#A8C24A]">
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type Dokter = {
  imgUrl: string
  nama: string
  spesialis: string
  deskripsi: string
  jadwal?: string[]
}

const listDokter: Dokter[] = [
  {
    imgUrl: '/dokter.png',
    nama: 'Drg. Sania Dara Afiati, Sp.KG',
    spesialis: 'Spesialis Konversi Gigi',
    deskripsi: 'Sebagai spesialis konservasi gigi, perhatian utama saya adalah menjaga serta merawat gigi alami Anda agar tetap sehat dan berfungsi optimal dalam jangka panjang, melalui perawatan yang tepat, modern, dan berstandar tinggi.',
    jadwal: ['Senin 08.00 - 16.00', 'Rabu 08.00 - 16.00'],
  },
  {
    imgUrl: '/dokter.png',
    nama: 'Drg. Sania Dara Afiati, Sp.KG',
    spesialis: 'Spesialis Konversi Gigi',
    deskripsi: 'Sebagai spesialis konservasi gigi, perhatian utama saya adalah menjaga serta merawat gigi alami Anda agar tetap sehat dan berfungsi optimal dalam jangka panjang, melalui perawatan yang tepat, modern, dan berstandar tinggi.',
    jadwal: ['Selasa 08.00 - 16.00', 'Kamis 08.00 - 16.00'],
  },
]