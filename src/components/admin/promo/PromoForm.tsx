import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import { FileUpload } from '#/components/ui/file-upload'

export default function PromoForm() {
  return (
    <div className="mb-6">
      <form className="space-y-4">
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Gambar Promo</FieldLabel>
                <FileUpload label="Unggah Gambar Promo" />
              </Field>
              <Field>
                <FieldLabel>Judul Promo</FieldLabel>
                <Input type='text' placeholder='Masukkan Judul Promo'/>
              </Field>
              <Field>
                <FieldLabel>Harga Awal</FieldLabel>
                <Input type="number" placeholder='Masukkan Harga Awal'/>
              </Field>
              <Field>
                <FieldLabel>Harga Diskon</FieldLabel>
                <Input type="number" placeholder='Masukkan Harga Diskon' />
              </Field>
              <Field>
                <FieldLabel>Deskripsi Promo</FieldLabel>
                <Textarea placeholder='Masukkan Deskripsi Promo' className='h-32 resize-none' />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Tambahkan Promo</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
