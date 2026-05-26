import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ProfilDokterCard } from '@/components/beranda/ProfilDokter'
import ProfilDokterForm from '@/components/admin/profil-dokter/ProfilDokterForm'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  useAdminDoctors,
  useCreateAdminDoctor,
  useDeleteAdminDoctor,
  useUpdateAdminDoctor,
} from '@/hooks/useDokter'
import { useScheduleOptions } from '@/hooks/useSchedule'
import type { DoctorApiItem } from '@/services/dokterService'
import { ApiError } from '@/lib/api-client'

export const Route = createFileRoute('/admin/profil-dokter')({
  component: RouteComponent,
})

function readApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) {
    return error instanceof Error && error.message ? error.message : fallback
  }

  const payload =
    typeof error.payload === 'object' && error.payload !== null
      ? (error.payload as Record<string, unknown>)
      : null

  const fieldErrors = payload?.errors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const queue: unknown[] = [fieldErrors]

    while (queue.length > 0) {
      const current = queue.shift()

      if (typeof current === 'string' && current.trim().length > 0) {
        return current
      }

      if (Array.isArray(current)) {
        queue.push(...current)
        continue
      }

      if (current && typeof current === 'object') {
        queue.push(...Object.values(current as Record<string, unknown>))
      }
    }
  }

  if (
    payload &&
    typeof payload.message === 'string' &&
    payload.message.length > 0
  ) {
    return payload.message
  }

  return error.message || fallback
}

const dayLookup: Record<string, string> = {
  senin: 'senin',
  selasa: 'selasa',
  rabu: 'rabu',
  kamis: 'kamis',
  jumat: 'jumat',
  sabtu: 'sabtu',
  minggu: 'minggu',
}

function toScheduleMap(labels: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {
    senin: [],
    selasa: [],
    rabu: [],
    kamis: [],
    jumat: [],
    sabtu: [],
    minggu: [],
  }

  labels.forEach((label) => {
    const parts = label.trim().split(' ')
    if (parts.length < 2) return

    const dayRaw = parts[0].toLowerCase()
    const day = dayLookup[dayRaw]
    if (!day) return

    const slot = parts
      .slice(1)
      .join(' ')
      .replace(/\s*-\s*/g, '-')
    if (slot.length > 0) {
      result[day].push(slot)
    }
  })

  return result
}

function RouteComponent() {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorApiItem | null>(
    null,
  )
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [createFormKey, setCreateFormKey] = useState(0)

  const doctorsQuery = useAdminDoctors()
  const createDoctor = useCreateAdminDoctor()
  const updateDoctor = useUpdateAdminDoctor()
  const deleteDoctor = useDeleteAdminDoctor()

  const doctorList = useMemo(
    () => doctorsQuery.data?.doctors || [],
    [doctorsQuery.data],
  )

  const scheduleOptionsQuery = useScheduleOptions()

  const handleCreate = async (values: {
    name: string
    specialization: string
    statement: string
    schedule: string[]
    photoFile: File | null
  }) => {
    setCreateError('')

    if (!values.photoFile) {
      setCreateError('Foto dokter wajib diunggah.')
      return
    }

    if (values.schedule.length === 0) {
      setCreateError('Minimal satu jadwal dokter harus dipilih.')
      return
    }

    await createDoctor.mutateAsync({
      name: values.name,
      specialization: values.specialization || null,
      statement: values.statement || null,
      schedule: toScheduleMap(values.schedule),
      photo: values.photoFile,
    })

    setCreateFormKey((prev) => prev + 1)
  }

  const handleUpdate = async (values: {
    name: string
    specialization: string
    statement: string
    schedule: string[]
    photoFile: File | null
  }) => {
    if (!selectedDoctor) return

    setUpdateError('')

    await updateDoctor.mutateAsync({
      id: selectedDoctor.id,
      name: values.name,
      specialization: values.specialization || null,
      statement: values.statement || null,
      schedule: toScheduleMap(values.schedule),
      photo: values.photoFile,
    })

    setSelectedDoctor(null)
  }

  const handleDelete = async () => {
    if (!selectedDoctor) return
    await deleteDoctor.mutateAsync(selectedDoctor.id)
    setSelectedDoctor(null)
  }

  return (
    <div>
      <div className="mb-6">
        <ProfilDokterForm
          key={createFormKey}
          submitLabel="Tambahkan Dokter"
          isSubmitting={createDoctor.isPending}
          submitError={createError}
          onSubmit={async (values) => {
            try {
              await handleCreate(values)
            } catch (error) {
              setCreateError(
                readApiErrorMessage(error, 'Gagal menambahkan dokter.'),
              )
            }
          }}
        />
      </div>

      {doctorsQuery.isError ? (
        <p className="text-sm text-destructive mb-4">
          Gagal memuat daftar dokter.
        </p>
      ) : null}

      <div className="flex flex-col gap-4 mt-12 justify-center w-full">
        {doctorList.map((doctor, index) => (
          <div
            key={doctor.id}
            onClick={() => {
              setUpdateError('')
              setSelectedDoctor(doctor)
            }}
            className="cursor-pointer"
          >
            <ProfilDokterCard dokter={doctor} index={index} />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedDoctor}
        onOpenChange={(open) => !open && setSelectedDoctor(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDoctor ? (
            <ProfilDokterForm
              submitLabel="Simpan Perubahan"
              isSubmitting={updateDoctor.isPending}
              submitError={updateError}
              initialValues={{
                name: selectedDoctor.name,
                specialization: selectedDoctor.specialization || '',
                statement: selectedDoctor.statement || '',
                schedule: selectedDoctor.schedule,
              }}
              onSubmit={async (values) => {
                try {
                  await handleUpdate(values)
                } catch (error) {
                  setUpdateError(
                    readApiErrorMessage(error, 'Gagal memperbarui dokter.'),
                  )
                }
              }}
            />
          ) : null}

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              type="button"
              className="bg-red-400 hover:bg-red-500"
              disabled={deleteDoctor.isPending}
              onClick={async () => {
                try {
                  await handleDelete()
                } catch {
                  setUpdateError('Gagal menghapus dokter.')
                }
              }}
            >
              {deleteDoctor.isPending ? 'Menghapus...' : 'Hapus Dokter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
