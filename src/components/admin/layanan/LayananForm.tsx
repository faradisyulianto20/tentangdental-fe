import { useEffect, useState } from 'react'
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import RichTextEditor from '@/components/admin/RichTextEditor'

export type LayananFormValues = {
  name: string
  detail: string
  articleContent: string
  iconFile: File | null
  supportImageFile: File | null
}

type LayananFormProps = {
  initialValues?: Partial<LayananFormValues>
  submitLabel: string
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: LayananFormValues) => Promise<void> | void
  onCancel?: () => void
}

export default function LayananForm({
  initialValues,
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: LayananFormProps) {
  const maxSupportImageSizeBytes = 2048 * 1024
  const maxIconSizeBytes = 1024 * 1024

  const [values, setValues] = useState<LayananFormValues>({
    name: initialValues?.name || '',
    detail: initialValues?.detail || '',
    articleContent: initialValues?.articleContent || '<p></p>',
    iconFile: initialValues?.iconFile || null,
    supportImageFile: initialValues?.supportImageFile || null,
  })

  useEffect(() => {
    setValues({
      name: initialValues?.name || '',
      detail: initialValues?.detail || '',
      articleContent: initialValues?.articleContent || '<p></p>',
      iconFile: initialValues?.iconFile || null,
      supportImageFile: initialValues?.supportImageFile || null,
    })
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} data-testid="layanan-form">
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Nama <span className="text-red-500">*</span></FieldLabel>
              <Input
                id="layanan-nama"
                name="layanan-nama"
                type="text"
                required
                placeholder="Masukkan Nama Layanan"
                value={values.name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
                data-testid="layanan-nama-input"
              />
            </Field>
            <Field>
              <FieldLabel>Detail Layanan <span className="text-red-500">*</span></FieldLabel>
              <Input
                id="layanan-detail"
                name="layanan-detail"
                type="text"
                required
                placeholder="Masukkan Detail Layanan"
                value={values.detail}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, detail: event.target.value }))
                }
                data-testid="layanan-detail-input"
              />
            </Field>
            <Field>
              <FieldLabel>Artikel </FieldLabel>
              <RichTextEditor
                value={values.articleContent}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, articleContent: next }))
                }
                data-testid="layanan-artikel-editor"
              />
            </Field>
            <FieldGroup className="grid md:grid-cols-2">
              <Field>
                <FieldLabel>Gambar Pendukung <span className="text-red-500">*</span></FieldLabel>
                <FileUpload
                  label="Unggah Gambar"
                  acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  maxFileSizeBytes={maxSupportImageSizeBytes}
                  maxFileSizeMessage="File terlalu besar, upload file kurang dari 2MB"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setValues((prev) => ({ ...prev, supportImageFile: file }))
                  }}
                  data-testid="layanan-support-image-upload"
                />
              </Field>
              <Field>
                <FieldLabel>Icon <span className="text-red-500">*</span></FieldLabel>
                <FileUpload
                  label="Unggah Icon"
                  acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  maxFileSizeBytes={maxIconSizeBytes}
                  maxFileSizeMessage="File terlalu besar, upload file kurang dari 1MB"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setValues((prev) => ({ ...prev, iconFile: file }))
                  }}
                  data-testid="layanan-icon-upload"
                />
              </Field>
            </FieldGroup>
          </FieldGroup>
        </FieldSet>

        {submitError ? (
          <p className="text-sm text-destructive" data-testid="layanan-error-message">{submitError}</p>
        ) : null}

        <Field orientation="horizontal" className="gap-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} data-testid="layanan-cancel-button">
              Batal
            </Button>
          ) : null}
          <Button type="submit" disabled={Boolean(isSubmitting)} data-testid="layanan-submit-button">
            {isSubmitting ? 'Memproses...' : submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
