import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { FileUpload } from '#/components/ui/file-upload'
import { Input } from '#/components/ui/input'
import { Star } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'

export type TestimoniFormValues = {
  name: string
  rating: number
  testimoni: string
  photoFile: File | null
}

type TestimoniFormProps = {
  initialValues?: Partial<TestimoniFormValues>
  submitLabel: string
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: TestimoniFormValues) => Promise<void> | void
  onCancel?: () => void
}

export default function TestimoniForm({
  initialValues,
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: TestimoniFormProps) {
  const [values, setValues] = useState<TestimoniFormValues>({
    name: initialValues?.name || '',
    rating: initialValues?.rating || 5,
    testimoni: initialValues?.testimoni || '<p></p>',
    photoFile: initialValues?.photoFile || null,
  })

  const maxPromoImageSizeBytes = 2048 * 1024

  useEffect(() => {
    setValues({
      name: initialValues?.name || '',
      rating: initialValues?.rating || 5,
      testimoni: initialValues?.testimoni || '<p></p>',
      photoFile: initialValues?.photoFile || null,
    }) // ✨ Memperbaiki kurung penutup setValues di sini
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} data-testid="testimoni-form">
      {/* FIELD NAMA */}
      <Field>
        <FieldLabel>Nama <span className="text-red-500">*</span></FieldLabel>
        <Input
          id="testimoni-nama"
          name="testimoni-nama"
          required
          value={values.name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
          data-testid="testimoni-nama-input"
        />
      </Field>

      {/* FIELD RATING */}
      <Field className="gap-1">
        <FieldLabel>Rating <span className="text-red-500">*</span></FieldLabel>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i: number) => (
            <span
              key={i}
              className={`cursor-pointer ${i < values.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setValues((prev) => ({ ...prev, rating: i + 1 }))}
              data-testid={`testimoni-star-${i + 1}`}
            >
              <Star fill={i < values.rating ? 'currentColor' : 'none'} />
            </span>
          ))}
        </div>
      </Field>

      {/* FIELD FOTO */}
      <Field>
        <FieldLabel>Foto <span className="text-red-500">*</span></FieldLabel>
        <FileUpload
           maxFileSizeBytes={maxPromoImageSizeBytes}
           maxFileSizeMessage="File terlalu besar, upload file kurang dari 2MB"
          label="Unggah Foto"
          acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0] || null
            setValues((prev) => ({ ...prev, photoFile: file }))
          }}
          data-testid="testimoni-foto-upload"
        />
      </Field>

      {/* FIELD TESTIMONI (RICH TEXT EDITOR) */}
      <Field>
        <FieldLabel>Testimoni <span className="text-red-500">*</span></FieldLabel>
        <RichTextEditor
          value={values.testimoni}
          onChange={(next) =>
            setValues((prev) => ({ ...prev, testimoni: next }))
          }
          data-testid="testimoni-konten-editor"
        />
      </Field>

      {/* ERROR MESSAGE */}
      {submitError ? (
        <p className="text-sm text-destructive font-medium" data-testid="testimoni-error-message">{submitError}</p>
      ) : null}

      {/* TOMBOL AKSI */}
      <div className="flex items-center gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} data-testid="testimoni-cancel-button">
            Batal
          </Button>
        ) : null}
        <Button type="submit" disabled={Boolean(isSubmitting)} data-testid="testimoni-submit-button">
          {isSubmitting ? 'Memproses...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}