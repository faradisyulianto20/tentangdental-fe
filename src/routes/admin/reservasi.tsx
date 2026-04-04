import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Textarea } from '#/components/ui/textarea'
import {
  useAdminReservationById,
  useAdminReservations,
  useDeleteAdminReservation,
  useUpdateAdminReservationPatientDetails,
  useUpdateAdminReservationStatus,
} from '@/hooks/useReservasi'
import type {
  AdminReservationDetail,
  AdminReservationStatus,
  ReservationDentalHistoryForm,
  ReservationMedicalHistoryForm,
  ReservasiApiItem,
} from '#/services/reservasiService'
import { ApiError } from '#/lib/api-client'

export const Route = createFileRoute('/admin/reservasi')({
  component: RouteComponent,
})

type DetailForm = {
  patientId: string
  name: string
  nickname: string
  gender: string
  age: string
  birthPlace: string
  birthDate: string
  address: string
  village: string
  district: string
  city: string
  phone: string
  occupation: string
  parentName: string
  height: string
  weight: string
  complain: string
  reservationDate: string
  appointmentTime: string
  doctorNotes: string
  medicalHistory: ReservationMedicalHistoryForm
  dentalHistory: ReservationDentalHistoryForm
}

const emptyMedicalHistory: ReservationMedicalHistoryForm = {
  has_allergy: '',
  allergy_detail: '',
  has_systemic_disease: '',
  systemic_disease_detail: '',
  undergoing_treatment: '',
  treatment_detail: '',
  ever_hospitalized: '',
  hospitalized_reason: '',
  smoking_or_alcohol: '',
}

const emptyDentalHistory: ReservationDentalHistoryForm = {
  frequent_tooth_pain: '',
  tooth_pain_detail: '',
  bleeding_gums: '',
  ever_dental_treatment: '',
  dental_treatment_detail: '',
  brushing_frequency: '',
  use_floss_or_mouthwash: '',
  bad_habits: '',
  bad_habits_detail: '',
  ever_braces: '',
  braces_years: '',
  root_canal_treatment: '',
  root_canal_detail: '',
  dentures: '',
  routine_checkup: '',
  dental_checkup_frequency: '',
  doctor_notes: '',
}

function normalizeDate(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function dateTimeFromDate(value: string) {
  return value ? `${value}T00:00:00` : null
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function statusLabel(status: string) {
  if (status === 'pending') return 'Menunggu'
  if (status === 'validated') return 'Tervalidasi'
  if (status === 'completed') return 'Selesai'
  if (status === 'cancelled') return 'Dibatalkan'
  return status
}

function statusColor(status: string) {
  if (status === 'pending') return 'bg-amber-100 text-amber-700'
  if (status === 'validated') return 'bg-blue-100 text-blue-700'
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'cancelled') return 'bg-rose-100 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

function toId(value: string | number) {
  return typeof value === 'number' ? value : Number(value)
}

function readApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback
  const payload =
    typeof error.payload === 'object' && error.payload !== null
      ? (error.payload as Record<string, unknown>)
      : null
  if (payload && typeof payload.message === 'string' && payload.message) {
    return payload.message
  }
  return error.message || fallback
}

function mapDetail(detail: AdminReservationDetail): DetailForm {
  const patient = detail.patient_form
  const medical = detail.medical_history_form || emptyMedicalHistory
  const dental = detail.dental_history_form || emptyDentalHistory

  return {
    patientId: patient?.patient_id || String(detail.patient?.id || ''),
    name: patient?.name || detail.patient?.name || '',
    nickname: patient?.nickname || '',
    gender: patient?.gender || '',
    age: patient?.age || detail.age || '',
    birthPlace: patient?.birth_place || '',
    birthDate: normalizeDate(patient?.birth_date || detail.birth_date),
    address: patient?.address || '',
    village: patient?.village || '',
    district: patient?.district || '',
    city: patient?.city || '',
    phone: patient?.phone || detail.patient?.phone || '',
    occupation: patient?.occupation || '',
    parentName: patient?.parent_name || '',
    height: patient?.height || '',
    weight: patient?.weight || '',
    complain: detail.complain || '',
    reservationDate: normalizeDate(detail.reservation_date),
    appointmentTime: detail.appointment_time || '',
    doctorNotes: dental.doctor_notes || '',
    medicalHistory: { ...emptyMedicalHistory, ...medical },
    dentalHistory: { ...emptyDentalHistory, ...dental },
  }
}

function RouteComponent() {
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null)
  const [form, setForm] = useState<DetailForm | null>(null)
  const [selectedStatus, setSelectedStatus] =
    useState<AdminReservationStatus>('pending')
  const [submitError, setSubmitError] = useState('')

  const reservationsQuery = useAdminReservations()
  const detailQuery = useAdminReservationById(
    selectedReservationId ?? undefined,
  )
  const updatePatientDetails = useUpdateAdminReservationPatientDetails()
  const updateStatus = useUpdateAdminReservationStatus()
  const deleteReservation = useDeleteAdminReservation()

  const reservations = useMemo(
    () =>
      (reservationsQuery.data?.reservations || []).filter(
        (r: ReservasiApiItem) => r.status !== 'cancelled',
      ),
    [reservationsQuery.data],
  )

  useEffect(() => {
    if (!detailQuery.data) return
    setForm(mapDetail(detailQuery.data))

    const status = detailQuery.data.status
    if (
      status === 'pending' ||
      status === 'validated' ||
      status === 'completed' ||
      status === 'cancelled'
    ) {
      setSelectedStatus(status)
    }
  }, [detailQuery.data])

  const updateForm = (key: keyof DetailForm, value: unknown) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const openDetail = (item: ReservasiApiItem) => {
    setSubmitError('')
    setForm(null)
    setSelectedReservationId(toId(item.id))
  }

  const closeDetail = () => {
    setSubmitError('')
    setForm(null)
    setSelectedReservationId(null)
  }

  const saveDetail = async () => {
    if (!selectedReservationId || !form) return
    setSubmitError('')

    const patientId = Number(form.patientId)
    if (!patientId || Number.isNaN(patientId)) {
      setSubmitError('Patient ID wajib diisi dengan benar.')
      return
    }

    try {
      await updatePatientDetails.mutateAsync({
        id: selectedReservationId,
        data: {
          patient_id: patientId,
          name: form.name.trim(),
          phone: form.phone.trim(),
          nickname: form.nickname || null,
          gender:
            form.gender === 'male' || form.gender === 'female'
              ? form.gender
              : null,
          age: form.age ? Number(form.age) : null,
          birth_place: form.birthPlace || null,
          birth_date: dateTimeFromDate(form.birthDate),
          address: form.address || null,
          village: form.village || null,
          district: form.district || null,
          city: form.city || null,
          occupation: form.occupation || null,
          parent_name: form.parentName || null,
          height: form.height ? Number(form.height) : null,
          weight: form.weight ? Number(form.weight) : null,
          medical_history: form.medicalHistory,
          dental_history: {
            ...form.dentalHistory,
            doctor_notes: form.doctorNotes,
          },
        },
      })

      if (selectedStatus !== detailQuery.data?.status) {
        await updateStatus.mutateAsync({
          id: selectedReservationId,
          status: selectedStatus,
        })
      }

      if (selectedStatus === 'cancelled') {
        closeDetail()
      }
    } catch (error) {
      setSubmitError(readApiErrorMessage(error, 'Gagal menyimpan reservasi.'))
    }
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Antrian Pasien</h1>
      <div className="mt-4 flex flex-col gap-3">
        {reservations.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3 md:flex-row md:justify-between"
          >
            <div className="space-y-1">
              <p className="font-semibold">{item.patient?.name || '-'}</p>
              <p className="text-sm text-muted-foreground">
                {Array.isArray(item.services)
                  ? item.services.map((s) => s.name).join(', ')
                  : '-'}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(item.reservation_date)} •{' '}
                {item.appointment_time || '-'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(item.status)}`}
              >
                {statusLabel(item.status)}
              </span>
              <Button type="button" onClick={() => openDetail(item)}>
                Lihat Detail
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={selectedReservationId !== null}
        onOpenChange={(open) => !open && closeDetail()}
      >
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          {!form ? (
            <p className="text-sm text-muted-foreground">
              Memuat detail reservasi...
            </p>
          ) : (
            <div className="space-y-6">
              <FieldGroup className="grid md:grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Patient ID</FieldLabel>
                  <Input
                    value={form.patientId}
                    onChange={(e) => updateForm('patientId', e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Nama</FieldLabel>
                  <Input
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>No HP</FieldLabel>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Jenis Kelamin</FieldLabel>
                  <Input
                    value={form.gender}
                    onChange={(e) => updateForm('gender', e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Tanggal Lahir</FieldLabel>
                  <Input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => updateForm('birthDate', e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Kota</FieldLabel>
                  <Input
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value as AdminReservationStatus,
                      )
                    }
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="validated">Tervalidasi</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </Field>
                <Field>
                  <FieldLabel>Tanggal Reservasi</FieldLabel>
                  <Input
                    type="date"
                    value={form.reservationDate}
                    onChange={(e) =>
                      updateForm('reservationDate', e.target.value)
                    }
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Keluhan</FieldLabel>
                  <Textarea
                    value={form.complain}
                    onChange={(e) => updateForm('complain', e.target.value)}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Catatan Dokter</FieldLabel>
                  <Textarea
                    value={form.doctorNotes}
                    onChange={(e) => updateForm('doctorNotes', e.target.value)}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup className="grid md:grid-cols-2 gap-3">
                {Object.keys(emptyMedicalHistory).map((key) => (
                  <Field key={key}>
                    <FieldLabel>{key}</FieldLabel>
                    <Input
                      value={String(
                        form.medicalHistory[
                          key as keyof ReservationMedicalHistoryForm
                        ] || '',
                      )}
                      onChange={(e) =>
                        updateForm('medicalHistory', {
                          ...form.medicalHistory,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </Field>
                ))}
              </FieldGroup>

              <FieldGroup className="grid md:grid-cols-2 gap-3">
                {Object.keys(emptyDentalHistory)
                  .filter((k) => k !== 'doctor_notes')
                  .map((key) => (
                    <Field key={key}>
                      <FieldLabel>{key}</FieldLabel>
                      <Input
                        value={String(
                          form.dentalHistory[
                            key as keyof ReservationDentalHistoryForm
                          ] || '',
                        )}
                        onChange={(e) =>
                          updateForm('dentalHistory', {
                            ...form.dentalHistory,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </Field>
                  ))}
              </FieldGroup>

              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
            </div>
          )}

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              type="button"
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={async () => {
                if (!selectedReservationId) return
                try {
                  await updateStatus.mutateAsync({
                    id: selectedReservationId,
                    status: 'cancelled',
                  })
                  closeDetail()
                } catch (error) {
                  setSubmitError(
                    readApiErrorMessage(error, 'Gagal membatalkan reservasi.'),
                  )
                }
              }}
            >
              Batalkan Reservasi
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={async () => {
                if (!selectedReservationId) return
                try {
                  await deleteReservation.mutateAsync(selectedReservationId)
                  closeDetail()
                } catch (error) {
                  setSubmitError(
                    readApiErrorMessage(error, 'Gagal menghapus reservasi.'),
                  )
                }
              }}
            >
              Hapus Reservasi
            </Button>
            <Button type="button" onClick={saveDetail}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
