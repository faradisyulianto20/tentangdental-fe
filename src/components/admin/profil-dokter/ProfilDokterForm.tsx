import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { FileUpload } from '@/components/ui/file-upload'
import { useEffect, useMemo, useState } from 'react'
import { MultiSelect } from '@/components/ui/multi-select'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { useScheduleOptions } from '@/hooks/useSchedule'

export type ProfilDokterFormValues = {
  name: string
  specialization: string
  statement: string
  schedule: string[]
  photoFile: File | null
}

type ProfilDokterFormProps = {
  initialValues?: Partial<ProfilDokterFormValues>
  submitLabel: string
  scheduleOptions?: string[]
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: ProfilDokterFormValues) => Promise<void> | void
  onCancel?: () => void
}

export default function ProfilDokterForm({
  initialValues,
  submitLabel,
  scheduleOptions,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: ProfilDokterFormProps) {
  // Fetch schedule options dari hook jika tidak disediakan dari props
  const scheduleOptionsQuery = useScheduleOptions()
  const maxDoctorImageSizeBytes = 2048 * 1024

  // Gunakan scheduleOptions dari props atau dari hook
  const finalScheduleOptions = useMemo(() => {
    if (scheduleOptions && scheduleOptions.length > 0) {
      return scheduleOptions
    }
    return scheduleOptionsQuery.data?.dropdown_options || []
  }, [scheduleOptions, scheduleOptionsQuery.data])

  const [values, setValues] = useState<ProfilDokterFormValues>({
    name: initialValues?.name || '',
    specialization: initialValues?.specialization || '',
    statement: initialValues?.statement || '<p></p>',
    schedule: initialValues?.schedule || [],
    photoFile: initialValues?.photoFile || null,
  })

  useEffect(() => {
    setValues({
      name: initialValues?.name || '',
      specialization: initialValues?.specialization || '',
      statement: initialValues?.statement || '<p></p>',
      schedule: initialValues?.schedule || [],
      photoFile: initialValues?.photoFile || null,
    })
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} data-testid="dokter-form">
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Nama <span className="text-red-500">*</span></FieldLabel>
              <Input
                id="dokter-nama"
                name="dokter-nama"
                type="text"
                required
                placeholder="Masukkan Nama Dokter"
                value={values.name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
                data-testid="dokter-nama-input"
              />
            </Field>
            <Field>
              <FieldLabel>Spesialis <span className="text-red-500">*</span></FieldLabel>
              <Input
                id="dokter-spesialis"
                name="dokter-spesialis"
                type="text"
                required
                placeholder="Masukkan Spesialis Dokter"
                value={values.specialization}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    specialization: event.target.value,
                  }))
                }
                data-testid="dokter-spesialis-input"
              />
            </Field>
            <Field>
              <FieldLabel>Pernyataan <span className="text-red-500">*</span></FieldLabel>
              <RichTextEditor
                value={values.statement}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, statement: next }))
                }
                data-testid="dokter-pernyataan-editor"
              />
            </Field>
            <Field>
              <FieldLabel>Jadwal <span className="text-red-500">*</span></FieldLabel>
              <MultiSelect
                items={finalScheduleOptions}
                value={values.schedule}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, schedule: next }))
                }
                placeholder="Pilih jadwal..."
                data-testid="dokter-jadwal-multiselect"
              />
            </Field>
            <Field>
              <FieldLabel>Foto <span className="text-red-500">*</span></FieldLabel>
              <FileUpload
                label="Unggah Foto"
                acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
                maxFileSizeBytes={maxDoctorImageSizeBytes}
                maxFileSizeMessage="File terlalu besar, upload file kurang dari 2MB"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  setValues((prev) => ({ ...prev, photoFile: file }))
                }}
                data-testid="dokter-foto-upload"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        {submitError ? (
          <p className="text-sm text-destructive" data-testid="dokter-error-message">{submitError}</p>
        ) : null}

        <Field orientation="horizontal" className="gap-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} data-testid="dokter-cancel-button">
              Batal
            </Button>
          ) : null}
          <Button type="submit" disabled={Boolean(isSubmitting)} data-testid="dokter-submit-button">
            {isSubmitting ? 'Memproses...' : submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
