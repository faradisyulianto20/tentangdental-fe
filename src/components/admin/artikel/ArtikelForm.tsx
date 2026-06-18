import { FieldSet, Field, FieldLabel } from '@/components/ui/field'
import { FileUpload } from '#/components/ui/file-upload'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'

export default function ArtikelForm() {
  return (
    <FieldSet className="" data-testid="artikel-form">
      <Field className="grid w-full items-center gap-4">
        <FieldLabel>
          Judul Artikel <span className="text-red-500">*</span>
        </FieldLabel>
        <FileUpload
          label={
            <span>
              Unggah Gambar <span className="text-red-500">*</span>
            </span>
          }
          data-testid="artikel-image-upload"
        />
      </Field>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel>
          Judul Artikel <span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          id="artikel-judul"
          name="artikel-judul"
          placeholder="Masukkan judul artikel"
          data-testid="artikel-judul-input"
        />
      </Field>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel htmlFor="artikel-penulis">
          Penulis <span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          id="artikel-penulis"
          name="artikel-penulis"
          placeholder="Masukkan nama penulis"
          data-testid="artikel-penulis-input"
        />
      </Field>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel htmlFor="artikel-konten">Konten Artikel</FieldLabel>
        <Textarea
          id="artikel-konten"
          name="artikel-konten"
          placeholder="Masukkan konten artikel"
          className="h-32 resize-none"
          data-testid="artikel-konten-textarea"
        />
      </Field>
      <Field orientation="horizontal">
        <Button type="submit" data-testid="artikel-submit-button">
          Tambahkan Artikel
        </Button>
      </Field>
    </FieldSet>
  )
}
