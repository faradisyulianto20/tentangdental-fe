import { useEffect, useState } from 'react'
import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { FileUpload } from '#/components/ui/file-upload'
import RichTextEditor from '#/components/admin/RichTextEditor'

export type PromoFormValues = {
  name: string
  originalPrice: string
  promoPrice: string
  detail: string
  imageFile: File | null
}

type PromoFormProps = {
  initialValues?: Partial<PromoFormValues>
  submitLabel: string
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: PromoFormValues) => Promise<void> | void
  onCancel?: () => void
}

export default function PromoForm({
  initialValues,
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: PromoFormProps) {
  const [values, setValues] = useState<PromoFormValues>({
    name: initialValues?.name || '',
    originalPrice: initialValues?.originalPrice || '',
    promoPrice: initialValues?.promoPrice || '',
    detail: initialValues?.detail || '<p></p>',
    imageFile: initialValues?.imageFile || null,
  })

  useEffect(() => {
    setValues({
      name: initialValues?.name || '',
      originalPrice: initialValues?.originalPrice || '',
      promoPrice: initialValues?.promoPrice || '',
      detail: initialValues?.detail || '<p></p>',
      imageFile: initialValues?.imageFile || null,
    })
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FileUpload
                label="Unggah Gambar Promo"
                acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  setValues((prev) => ({ ...prev, imageFile: file }))
                }}
              />
            </Field>

            <Field>
              <FieldLabel>Judul Promo</FieldLabel>
              <Input
                type="text"
                placeholder="Masukkan Judul Promo"
                value={values.name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </Field>

            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Harga Awal</FieldLabel>
                <Input
                  type="number"
                  placeholder="Masukkan Harga Awal"
                  value={values.originalPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      originalPrice: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Harga Diskon</FieldLabel>
                <Input
                  type="number"
                  placeholder="Masukkan Harga Diskon"
                  value={values.promoPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      promoPrice: event.target.value,
                    }))
                  }
                />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel>Deskripsi Promo</FieldLabel>
              <RichTextEditor
                value={values.detail}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, detail: next }))
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>

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
      </FieldGroup>
    </form>
  )
}
