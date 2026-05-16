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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Nama</FieldLabel>
              <Input
                type="text"
                placeholder="Masukkan Nama Dokter"
                value={values.name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </Field>
            <Field>
              <FieldLabel>Spesialis</FieldLabel>
              <Input
                type="text"
                placeholder="Masukkan Spesialis Dokter"
                value={values.specialization}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    specialization: event.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <FieldLabel>Pernyataan</FieldLabel>
              <RichTextEditor
                value={values.statement}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, statement: next }))
                }
              />
            </Field>
            <Field>
              <FieldLabel>Jadwal</FieldLabel>
              <MultiSelect
                items={finalScheduleOptions}
                value={values.schedule}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, schedule: next }))
                }
                placeholder="Pilih jadwal..."
              />
            </Field>
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
