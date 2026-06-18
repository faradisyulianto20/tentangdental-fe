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
  const maxPromoImageSizeBytes = 2048 * 1024

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
    <form
      className="space-y-4"
      onSubmit={handleSubmit}
      data-testid="promo-form"
    >
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FileUpload
                label={
                  <span>
                    Unggah Gambar Promo <span className="text-red-500">*</span>
                  </span>
                }
                acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
                maxFileSizeBytes={maxPromoImageSizeBytes}
                maxFileSizeMessage="File terlalu besar, upload file kurang dari 2MB"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  setValues((prev) => ({ ...prev, imageFile: file }))
                }}
                data-testid="promo-image-upload"
              />
            </Field>

            <Field>
              <FieldLabel>
                Judul Promo <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="promo-judul"
                name="promo-judul"
                type="text"
                placeholder="Masukkan Judul Promo"
                value={values.name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
                data-testid="promo-judul-input"
              />
            </Field>

            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>
                  Harga Awal <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="promo-original-price"
                  name="promo-original-price"
                  type="number"
                  placeholder="Masukkan Harga Awal"
                  value={values.originalPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      originalPrice: event.target.value,
                    }))
                  }
                  data-testid="promo-original-price-input"
                />
              </Field>
              <Field>
                <FieldLabel>
                  Harga Diskon <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="promo-discount-price"
                  name="promo-discount-price"
                  type="number"
                  placeholder="Masukkan Harga Diskon"
                  value={values.promoPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      promoPrice: event.target.value,
                    }))
                  }
                  data-testid="promo-discount-price-input"
                />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel>
                Deskripsi Promo <span className="text-red-500">*</span>
              </FieldLabel>
              <RichTextEditor
                value={values.detail}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, detail: next }))
                }
                data-testid="promo-deskripsi-editor"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        {submitError ? (
          <p
            className="text-sm text-destructive"
            data-testid="promo-error-message"
          >
            {submitError}
          </p>
        ) : null}

        <Field orientation="horizontal" className="gap-2">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="promo-cancel-button"
            >
              Batal
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={Boolean(isSubmitting)}
            data-testid="promo-submit-button"
          >
            {isSubmitting ? 'Memproses...' : submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
