import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'

export default function LayananForm() {
  return (
    <div>
      <form className="space-y-4">
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Nama</FieldLabel>
                <Input type="text" placeholder="Masukkan Judul Promo" />
              </Field>
              <Field>
                <FieldLabel>Detail Layanan</FieldLabel>
                <Input type="number" placeholder="Masukkan Harga Awal" />
              </Field>
              <Field>
                <FieldLabel>Artikel</FieldLabel>
                <Textarea
                  placeholder="Masukkan Deskripsi Promo"
                  className="h-32 resize-none"
                />
              </Field>
              <FieldGroup className="grid grid-cols-2">
                <Field>
                  <FieldLabel>Gambar</FieldLabel>
                  <FileUpload label="Unggah Gambar" />
                </Field>
                <Field>
                  <FieldLabel>Icon</FieldLabel>
                  <FileUpload label="Unggah Icon" />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Tambahkan Layanan</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
