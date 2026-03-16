import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/ui/file-upload'
import { useState } from 'react'
import { MultiSelect } from '@/components/ui/multi-select'

export default function ProfilDokterForm() {
  const [selectedJadwal, setSelectedJadwal] = useState<string[]>([])
  return (
    <div>
      <form className="space-y-4">
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Nama</FieldLabel>
                <Input type="text" placeholder="Masukkan Nama Dokter" />
              </Field>
              <Field>
                <FieldLabel>Spesalitas</FieldLabel>
                <Input type="text" placeholder="Masukkan Spesialitas Dokter" />
              </Field>
              <Field>
                <FieldLabel>Deskripsi</FieldLabel>
                <Textarea
                  placeholder="Masukkan Deskripsi Dokter"
                  className="h-32 resize-none"
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
          <Field orientation="horizontal">
            <Button type="submit">Tambahkan Dokter</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

const jadwal = [
  'Senin 08.00 - 16.00',
  'Selasa 08.00 - 16.00',
  'Rabu 08.00 - 16.00',
  'Kamis 08.00 - 16.00',
  'Jumat 08.00 - 16.00',
]
