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

  useEffect(() => {
    setValues({
      name: initialValues?.name || '',
      rating: initialValues?.rating || 5,
      testimoni: initialValues?.testimoni || '<p></p>',
      photoFile: initialValues?.photoFile || null,
    })
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Field>
        <FieldLabel>Foto</FieldLabel>
        <FileUpload
          label="Unggah Foto"
          acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0] || null
            setValues((prev) => ({ ...prev, photoFile: file }))
          }}
        />
      </Field>
      <Field>
        <FieldLabel>Nama</FieldLabel>
        <Input
          type="text"
          placeholder="Masukkan Nama"
          value={values.name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
      </Field>
      <Field className="gap-0">
        <FieldLabel>Rating</FieldLabel>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i: number) => (
            <span
              key={i}
              className={`cursor-pointer ${i < values.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setValues((prev) => ({ ...prev, rating: i + 1 }))}
            >
              <Star fill={i < values.rating ? 'currentColor' : 'none'} />
            </span>
          ))}
        </div>
      </Field>
      <Field>
        <FieldLabel>Testimoni</FieldLabel>
        <RichTextEditor
          value={values.testimoni}
          onChange={(next) =>
            setValues((prev) => ({ ...prev, testimoni: next }))
          }
        />
      </Field>

      {submitError ? (
        <p className="text-sm text-destructive">{submitError}</p>
      ) : null}

      <Field orientation="horizontal" className="gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        ) : null}
        <Button type="submit" disabled={Boolean(isSubmitting)}>
          {isSubmitting ? 'Memproses...' : submitLabel}
        </Button>
      </Field>
    </form>
  )
}
