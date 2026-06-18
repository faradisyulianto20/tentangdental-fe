import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  Clock,
  Phone,
  User,
  Heart,
  Smile,
  FileText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { ApiError } from '@/lib/api-client'
import { useDokter } from '@/hooks/useDokter'
import { useLayanan } from '@/hooks/useLayanan'
import {
  useAdminReservationById,
  useAdminReservations,
  useUpdateAdminReservationPatientDetails,
  useUpdateAdminReservationStatus,
} from '@/hooks/useReservasi'
import type {
  AdminReservationDetail,
  AdminReservationStatus,
  ReservationDentalHistoryForm,
  ReservationMedicalHistoryForm,
  ReservasiApiItem,
} from '@/services/reservasiService'

export const Route = createFileRoute('/admin/reservasi')({
  component: RouteComponent,
})

type ReservationForm = {
  name: string
  nickname: string
  gender: 'Laki-laki' | 'Perempuan' | ''
  phone: string
  age: string
  occupation: string
  birthDate: Date | null
  parentName: string
  city: string
  district: string
  village: string
  address: string
  height: string
  weight: string
  complain: string
  reservationDate: string
  appointmentTime: string
  doctor: string
  layanan: string[]
  doctorNotes: string
}

type ToggleState = {
  hasAlergi: boolean
  hasPenyakitSistemik: boolean
  isKonsumsiObat: boolean
  isRawatRumahSakit: boolean
  isKebiasaanRokok: boolean
  isSakitGigi: boolean
  isBerdarahSikatGigi: boolean
  isPerawatanGigiSebelumnya: boolean
  isKebisaanKesehatanMulut: boolean
  isKebiasaanBuruk: boolean
  isKawatGigi: boolean
  isPSA: boolean
  isMemilikiGigiPalsu: boolean
  isRutinKontrol: boolean
}

const emptyMedical: ReservationMedicalHistoryForm = {
  has_allergy: false,
  allergy_detail: '',
  has_systemic_disease: false,
  systemic_disease_detail: '',
  undergoing_treatment: false,
  treatment_detail: '',
  ever_hospitalized: false,
  hospitalized_reason: '',
  smoking_or_alcohol: false,
}

const emptyDental: ReservationDentalHistoryForm = {
  frequent_tooth_pain: false,
  tooth_pain_detail: '',
  bleeding_gums: false,
  ever_dental_treatment: false,
  dental_treatment_detail: '',
  brushing_frequency: '',
  use_floss_or_mouthwash: false,
  bad_habits: false,
  bad_habits_detail: '',
  ever_braces: false,
  braces_years: '',
  root_canal_treatment: false,
  root_canal_detail: '',
  dentures: false,
  routine_checkup: false,
  dental_checkup_frequency: '',
  doctor_notes: '',
}

function statusLabel(status: string) {
  if (status === 'pending') return 'Menunggu'
  if (status === 'validated') return 'Tervalidasi'
  if (status === 'completed') return 'Selesai'
  if (status === 'cancelled') return 'Dibatalkan'
  return status
}

function statusColor(status: string) {
  if (status === 'pending') return 'bg-[#B7CC9B] text-white'
  if (status === 'validated') return 'bg-[#58C4EC] text-white'
  if (status === 'completed') return 'bg-emerald-500 text-white'
  if (status === 'cancelled') return 'bg-rose-500 text-white'
  return 'bg-slate-500 text-white'
}

function formatDateOnly(value: string | null | undefined) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(value: string | null | undefined) {
  if (!value) return '-'
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) return '-'
  const withDate = `1970-01-01T${value}`
  const date = new Date(withDate)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function yesNoToBool(input?: string | boolean | null) {
  if (typeof input === 'boolean') return input
  if (!input) return false
  return ['yes', 'true', '1'].includes(input.toLowerCase())
}

function normalizeOptionalText(value?: string | null) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function normalizeSelectableValue(value?: string | null) {
  if (!value) return null
  const invalidLegacyValues = new Set([
    '1-kali',
    '2-kali',
    '3-kali',
    'lebih-3',
    'jarang',
    '1-tahun',
    '2-tahun',
    '3-tahun',
    '6-bulan',
    '3-bulan',
    'belum',
  ])

  return invalidLegacyValues.has(value) ? null : value
}

function toIsoDate(date: Date | null) {
  if (!date) return null
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}T00:00:00`
}

function parseDate(input?: string | null) {
  if (!input) return null
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function getReservationSortTime(item: ReservasiApiItem) {
  const reservationDate = parseDate(item.reservation_date)?.getTime()
  if (typeof reservationDate === 'number') return reservationDate

  const createdAt = parseDate(item.created_at)?.getTime()
  if (typeof createdAt === 'number') return createdAt

  return Number.POSITIVE_INFINITY
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

function toId(value: string | number) {
  return typeof value === 'number' ? value : Number(value)
}

function mapGenderPayload(genderLabel: '' | 'Laki-laki' | 'Perempuan') {
  if (genderLabel === 'Laki-laki') return 'male'
  if (genderLabel === 'Perempuan') return 'female'
  return null
}

function parseServices(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item !== null && 'name' in item) {
          const rec = item as Record<string, unknown>
          return typeof rec.name === 'string' ? rec.name : ''
        }
        return ''
      })
      .filter(Boolean)
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
  }

  return []
}

function mapDetailToForm(detail: AdminReservationDetail): {
  form: ReservationForm
  medical: ReservationMedicalHistoryForm
  dental: ReservationDentalHistoryForm
  toggles: ToggleState
  patientId: string
} {
  const patient = detail.patient_form
  const medical = { ...emptyMedical, ...(detail.medical_history_form || {}) }
  const dental = { ...emptyDental, ...(detail.dental_history_form || {}) }

  const form: ReservationForm = {
    name: patient?.name || detail.patient?.name || '',
    nickname: patient?.nickname || '',
    gender:
      patient?.gender === 'female' || patient?.gender === 'perempuan'
        ? 'Perempuan'
        : patient?.gender === 'male' || patient?.gender === 'laki-laki'
          ? 'Laki-laki'
          : '',
    phone: patient?.phone || detail.patient?.phone || '',
    age: patient?.age || detail.age || '',
    occupation: patient?.occupation || '',
    birthDate: parseDate(patient?.birth_date || detail.birth_date),
    parentName: patient?.parent_name || '',
    city: patient?.city || '',
    district: patient?.district || '',
    village: patient?.village || '',
    address: patient?.address || '',
    height: patient?.height || '',
    weight: patient?.weight || '',
    complain: detail.complain || '',
    reservationDate: formatDateOnly(detail.reservation_date),
    appointmentTime: formatTime(detail.appointment_time),
    doctor: detail.doctor?.name || '',
    layanan: parseServices(detail.services),
    doctorNotes: dental.doctor_notes || '',
  }

  const toggles: ToggleState = {
    hasAlergi: yesNoToBool(medical.has_allergy),
    hasPenyakitSistemik: yesNoToBool(medical.has_systemic_disease),
    isKonsumsiObat: yesNoToBool(medical.undergoing_treatment),
    isRawatRumahSakit: yesNoToBool(medical.ever_hospitalized),
    isKebiasaanRokok: yesNoToBool(medical.smoking_or_alcohol),
    isSakitGigi: yesNoToBool(dental.frequent_tooth_pain),
    isBerdarahSikatGigi: yesNoToBool(dental.bleeding_gums),
    isPerawatanGigiSebelumnya: yesNoToBool(dental.ever_dental_treatment),
    isKebisaanKesehatanMulut: yesNoToBool(dental.use_floss_or_mouthwash),
    isKebiasaanBuruk: yesNoToBool(dental.bad_habits),
    isKawatGigi: yesNoToBool(dental.ever_braces),
    isPSA: yesNoToBool(dental.root_canal_treatment),
    isMemilikiGigiPalsu: yesNoToBool(dental.dentures),
    isRutinKontrol: yesNoToBool(dental.routine_checkup),
  }

  return {
    form,
    medical,
    dental,
    toggles,
    patientId: patient?.patient_id || String(detail.patient?.id || ''),
  }
}

function ReservationCard({
  item,
  onSaved,
}: {
  item: ReservasiApiItem
  onSaved?: () => void
}) {
  const detailQuery = useAdminReservationById(toId(item.id))
  const updatePatientDetails = useUpdateAdminReservationPatientDetails()
  const updateStatus = useUpdateAdminReservationStatus()
  const { data: doctorsData } = useDokter()
  const { data: servicesData } = useLayanan()

  const [submitError, setSubmitError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [selectedStatus, setSelectedStatus] =
    useState<AdminReservationStatus>('pending')
  const [patientId, setPatientId] = useState('')
  const [form, setForm] = useState<ReservationForm | null>(null)
  const [medical, setMedical] =
    useState<ReservationMedicalHistoryForm>(emptyMedical)
  const [dental, setDental] =
    useState<ReservationDentalHistoryForm>(emptyDental)
  const [toggles, setToggles] = useState<ToggleState>({
    hasAlergi: false,
    hasPenyakitSistemik: false,
    isKonsumsiObat: false,
    isRawatRumahSakit: false,
    isKebiasaanRokok: false,
    isSakitGigi: false,
    isBerdarahSikatGigi: false,
    isPerawatanGigiSebelumnya: false,
    isKebisaanKesehatanMulut: false,
    isKebiasaanBuruk: false,
    isKawatGigi: false,
    isPSA: false,
    isMemilikiGigiPalsu: false,
    isRutinKontrol: false,
  })
  const [dropdownJenisKelaminOpen, setDropdownJenisKelaminOpen] =
    useState(false)
  const [dropdownDokterOpen, setDropdownDokterOpen] = useState(false)
  const [confirmValidate, setConfirmValidate] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmComplete, setConfirmComplete] = useState(false)

  useEffect(() => {
    const detail = detailQuery.data
    if (!detail) return
    const mapped = mapDetailToForm(detail)
    setForm(mapped.form)
    setMedical(mapped.medical)
    setDental(mapped.dental)
    setToggles(mapped.toggles)
    setPatientId(mapped.patientId)

    const currentStatus = detail.status
    if (
      currentStatus === 'pending' ||
      currentStatus === 'validated' ||
      currentStatus === 'completed' ||
      currentStatus === 'cancelled'
    ) {
      setSelectedStatus(currentStatus)
    }
  }, [detailQuery.data])

  const doctorList = Array.isArray(doctorsData)
    ? doctorsData.map((d) => d.name)
    : []
  const layananList = Array.isArray(servicesData)
    ? servicesData.map((s) => s.name)
    : []

  const validatePhone = (phone: string): string => {
    if (!phone) return 'Nomor handphone harus diisi'
    if (!/^\d{10,13}$/.test(phone))
      return 'Nomor handphone harus berupa angka dengan panjang 10-13 digit'
    return ''
  }

  const setFormField = (
    key: keyof ReservationForm,
    value: string | Date | null | string[],
  ) => {
    setForm((prev) => {
      if (!prev) return prev
      return { ...prev, [key]: value }
    })
  }

  const setToggle = (key: keyof ToggleState, checked: CheckedState) => {
    if (typeof checked !== 'boolean') return
    setToggles((prev) => ({ ...prev, [key]: checked }))
  }

  // const save = async () => {
  //   if (!form) return
  //   setSubmitError('')

  //   const idNumber = Number(patientId)
  //   if (!idNumber || Number.isNaN(idNumber)) {
  //     setSubmitError('Patient ID tidak valid.')
  //     return
  //   }

  //   try {
  //     await updatePatientDetails.mutateAsync({
  //       id: toId(item.id),
  //       data: {
  //         patient_id: idNumber,
  //         name: form.name,
  //         phone: form.phone,
  //         gender: mapGenderPayload(form.gender),
  //         nickname: form.nickname || null,
  //         age: form.age ? Number(form.age) : null,
  //         birth_date: toIsoDate(form.birthDate),
  //         address: form.address || null,
  //         village: form.village || null,
  //         district: form.district || null,
  //         city: form.city || null,
  //         occupation: form.occupation || null,
  //         parent_name: form.parentName || null,
  //         height: form.height ? Number(form.height) : null,
  //         weight: form.weight ? Number(form.weight) : null,
  //         medical_history: {
  //           ...medical,
  //           has_allergy: toggles.hasAlergi,
  //           allergy_detail: toggles.hasAlergi
  //             ? normalizeOptionalText(medical.allergy_detail)
  //             : null,
  //           has_systemic_disease: toggles.hasPenyakitSistemik,
  //           systemic_disease_detail: toggles.hasPenyakitSistemik
  //             ? normalizeOptionalText(medical.systemic_disease_detail)
  //             : null,
  //           undergoing_treatment: toggles.isKonsumsiObat,
  //           treatment_detail: toggles.isKonsumsiObat
  //             ? normalizeOptionalText(medical.treatment_detail)
  //             : null,
  //           ever_hospitalized: toggles.isRawatRumahSakit,
  //           hospitalized_reason: toggles.isRawatRumahSakit
  //             ? normalizeOptionalText(medical.hospitalized_reason)
  //             : null,
  //           smoking_or_alcohol: toggles.isKebiasaanRokok,
  //         },
  //         dental_history: {
  //           ...dental,
  //           frequent_tooth_pain: toggles.isSakitGigi,
  //           tooth_pain_detail: toggles.isSakitGigi
  //             ? normalizeOptionalText(dental.tooth_pain_detail)
  //             : null,
  //           bleeding_gums: toggles.isBerdarahSikatGigi,
  //           ever_dental_treatment: toggles.isPerawatanGigiSebelumnya,
  //           dental_treatment_detail: toggles.isPerawatanGigiSebelumnya
  //             ? normalizeOptionalText(dental.dental_treatment_detail)
  //             : null,
  //           brushing_frequency: normalizeSelectableValue(
  //             dental.brushing_frequency,
  //           ),
  //           use_floss_or_mouthwash: toggles.isKebisaanKesehatanMulut,
  //           bad_habits: toggles.isKebiasaanBuruk,
  //           bad_habits_detail: toggles.isKebiasaanBuruk
  //             ? normalizeOptionalText(dental.bad_habits_detail)
  //             : null,
  //           ever_braces: toggles.isKawatGigi,
  //           braces_years: toggles.isKawatGigi
  //             ? normalizeOptionalText(dental.braces_years)
  //             : null,
  //           root_canal_treatment: toggles.isPSA,
  //           root_canal_detail: toggles.isPSA
  //             ? normalizeOptionalText(dental.root_canal_detail)
  //             : null,
  //           dentures: toggles.isMemilikiGigiPalsu,
  //           routine_checkup: toggles.isRutinKontrol,
  //           dental_checkup_frequency: normalizeSelectableValue(
  //             dental.dental_checkup_frequency,
  //           ),
  //           doctor_notes: form.doctorNotes,
  //         },
  //       },
  //     })

  //     if (selectedStatus !== item.status) {
  //       await updateStatus.mutateAsync({
  //         id: toId(item.id),
  //         status: selectedStatus,
  //       })
  //     }

  //     onSaved?.()
  //   } catch (error) {
  //     setSubmitError(readApiErrorMessage(error, 'Gagal menyimpan reservasi.'))
  //   }
  // }

  const handleValidate = async () => {
    try {
      // Save form data first
      if (!form) return
      setSubmitError('')

      const phoneErr = validatePhone(form.phone)
      if (phoneErr) {
        setPhoneError(phoneErr)
        return
      }
      setPhoneError('')

      const idNumber = Number(patientId)
      if (!idNumber || Number.isNaN(idNumber)) {
        setSubmitError('Patient ID tidak valid.')
        return
      }

      await updatePatientDetails.mutateAsync({
        id: toId(item.id),
        data: {
          patient_id: idNumber,
          name: form.name,
          phone: form.phone,
          gender: mapGenderPayload(form.gender),
          nickname: form.nickname || null,
          age: form.age ? Number(form.age) : null,
          birth_date: toIsoDate(form.birthDate),
          address: form.address || null,
          village: form.village || null,
          district: form.district || null,
          city: form.city || null,
          occupation: form.occupation || null,
          parent_name: form.parentName || null,
          height: form.height ? Number(form.height) : null,
          weight: form.weight ? Number(form.weight) : null,
          medical_history: {
            ...medical,
            has_allergy: toggles.hasAlergi,
            allergy_detail: toggles.hasAlergi
              ? normalizeOptionalText(medical.allergy_detail)
              : null,
            has_systemic_disease: toggles.hasPenyakitSistemik,
            systemic_disease_detail: toggles.hasPenyakitSistemik
              ? normalizeOptionalText(medical.systemic_disease_detail)
              : null,
            undergoing_treatment: toggles.isKonsumsiObat,
            treatment_detail: toggles.isKonsumsiObat
              ? normalizeOptionalText(medical.treatment_detail)
              : null,
            ever_hospitalized: toggles.isRawatRumahSakit,
            hospitalized_reason: toggles.isRawatRumahSakit
              ? normalizeOptionalText(medical.hospitalized_reason)
              : null,
            smoking_or_alcohol: toggles.isKebiasaanRokok,
          },
          dental_history: {
            ...dental,
            frequent_tooth_pain: toggles.isSakitGigi,
            tooth_pain_detail: toggles.isSakitGigi
              ? normalizeOptionalText(dental.tooth_pain_detail)
              : null,
            bleeding_gums: toggles.isBerdarahSikatGigi,
            ever_dental_treatment: toggles.isPerawatanGigiSebelumnya,
            dental_treatment_detail: toggles.isPerawatanGigiSebelumnya
              ? normalizeOptionalText(dental.dental_treatment_detail)
              : null,
            brushing_frequency: normalizeSelectableValue(
              dental.brushing_frequency,
            ),
            use_floss_or_mouthwash: toggles.isKebisaanKesehatanMulut,
            bad_habits: toggles.isKebiasaanBuruk,
            bad_habits_detail: toggles.isKebiasaanBuruk
              ? normalizeOptionalText(dental.bad_habits_detail)
              : null,
            ever_braces: toggles.isKawatGigi,
            braces_years: toggles.isKawatGigi
              ? normalizeOptionalText(dental.braces_years)
              : null,
            root_canal_treatment: toggles.isPSA,
            root_canal_detail: toggles.isPSA
              ? normalizeOptionalText(dental.root_canal_detail)
              : null,
            dentures: toggles.isMemilikiGigiPalsu,
            routine_checkup: toggles.isRutinKontrol,
            dental_checkup_frequency: normalizeSelectableValue(
              dental.dental_checkup_frequency,
            ),
            doctor_notes: form.doctorNotes,
          },
        },
      })

      // Then update status to validated
      await updateStatus.mutateAsync({
        id: toId(item.id),
        status: 'validated',
      })
      onSaved?.()
      setConfirmValidate(false)
    } catch (error) {
      setSubmitError(readApiErrorMessage(error, 'Gagal memvalidasi reservasi.'))
    }
  }

  const handleCancel = async () => {
    try {
      await updateStatus.mutateAsync({
        id: toId(item.id),
        status: 'cancelled',
      })
      onSaved?.()
      setConfirmCancel(false)
    } catch (error) {
      setSubmitError(readApiErrorMessage(error, 'Gagal membatalkan reservasi.'))
    }
  }

  const handleComplete = async () => {
    try {
      // Save form data first
      if (!form) return
      setSubmitError('')

      const phoneErr = validatePhone(form.phone)
      if (phoneErr) {
        setPhoneError(phoneErr)
        return
      }
      setPhoneError('')

      const idNumber = Number(patientId)
      if (!idNumber || Number.isNaN(idNumber)) {
        setSubmitError('Patient ID tidak valid.')
        return
      }

      await updatePatientDetails.mutateAsync({
        id: toId(item.id),
        data: {
          patient_id: idNumber,
          name: form.name,
          phone: form.phone,
          gender: mapGenderPayload(form.gender),
          nickname: form.nickname || null,
          age: form.age ? Number(form.age) : null,
          birth_date: toIsoDate(form.birthDate),
          address: form.address || null,
          village: form.village || null,
          district: form.district || null,
          city: form.city || null,
          occupation: form.occupation || null,
          parent_name: form.parentName || null,
          height: form.height ? Number(form.height) : null,
          weight: form.weight ? Number(form.weight) : null,
          medical_history: {
            ...medical,
            has_allergy: toggles.hasAlergi,
            allergy_detail: toggles.hasAlergi
              ? normalizeOptionalText(medical.allergy_detail)
              : null,
            has_systemic_disease: toggles.hasPenyakitSistemik,
            systemic_disease_detail: toggles.hasPenyakitSistemik
              ? normalizeOptionalText(medical.systemic_disease_detail)
              : null,
            undergoing_treatment: toggles.isKonsumsiObat,
            treatment_detail: toggles.isKonsumsiObat
              ? normalizeOptionalText(medical.treatment_detail)
              : null,
            ever_hospitalized: toggles.isRawatRumahSakit,
            hospitalized_reason: toggles.isRawatRumahSakit
              ? normalizeOptionalText(medical.hospitalized_reason)
              : null,
            smoking_or_alcohol: toggles.isKebiasaanRokok,
          },
          dental_history: {
            ...dental,
            frequent_tooth_pain: toggles.isSakitGigi,
            tooth_pain_detail: toggles.isSakitGigi
              ? normalizeOptionalText(dental.tooth_pain_detail)
              : null,
            bleeding_gums: toggles.isBerdarahSikatGigi,
            ever_dental_treatment: toggles.isPerawatanGigiSebelumnya,
            dental_treatment_detail: toggles.isPerawatanGigiSebelumnya
              ? normalizeOptionalText(dental.dental_treatment_detail)
              : null,
            brushing_frequency: normalizeSelectableValue(
              dental.brushing_frequency,
            ),
            use_floss_or_mouthwash: toggles.isKebisaanKesehatanMulut,
            bad_habits: toggles.isKebiasaanBuruk,
            bad_habits_detail: toggles.isKebiasaanBuruk
              ? normalizeOptionalText(dental.bad_habits_detail)
              : null,
            ever_braces: toggles.isKawatGigi,
            braces_years: toggles.isKawatGigi
              ? normalizeOptionalText(dental.braces_years)
              : null,
            root_canal_treatment: toggles.isPSA,
            root_canal_detail: toggles.isPSA
              ? normalizeOptionalText(dental.root_canal_detail)
              : null,
            dentures: toggles.isMemilikiGigiPalsu,
            routine_checkup: toggles.isRutinKontrol,
            dental_checkup_frequency: normalizeSelectableValue(
              dental.dental_checkup_frequency,
            ),
            doctor_notes: form.doctorNotes,
          },
        },
      })

      // Then update status to completed
      await updateStatus.mutateAsync({
        id: toId(item.id),
        status: 'completed',
      })
      onSaved?.()
      setConfirmComplete(false)
    } catch (error) {
      setSubmitError(
        readApiErrorMessage(error, 'Gagal menyelesaikan reservasi.'),
      )
    }
  }

  return (
    <div className="rounded-lg p-4 mb-4 bg-[#E0F4FB]">
      <div className="flex flex-col-reverse lg:flex-row justify-between">
        <div>
          <h2 className="text-lg font-bold">{item.patient?.name || '-'}</h2>
          <p className="text-sm text-muted-foreground">
            {parseServices(item.services).join(', ') || '-'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <Button
            variant="default"
            className={`mt-2 rounded-2xl text-sm ${statusColor(item.status)}`}
            disabled
          >
            {statusLabel(item.status)}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-[#B9D654] text-white hover:bg-[#A8C24A] mt-2 text-sm rounded-2xl"
              >
                {item.status === 'pending'
                  ? 'Validasi'
                  : item.status === 'validated'
                    ? 'Konfirmasi'
                    : 'Lihat Detail'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-sm p-8">
              {!form ? (
                <p className="text-sm text-muted-foreground">
                  Memuat detail...
                </p>
              ) : (
                <>
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      <User className="w-12 h-12 text-primary" />
                      <div>
                        <FieldTitle className="font-bold text-lg">
                          Data Pasien
                        </FieldTitle>
                        <FieldDescription>
                          Nomor Pasien:
                          <span className="font-medium"> {patientId}</span>
                        </FieldDescription>
                      </div>
                    </FieldLegend>
                  </FieldGroup>

                  <FieldGroup className="grid md:grid-cols-2 gap-x-16 gap-y-4">
                    <Field>
                      <FieldLabel>Nama Pasien</FieldLabel>
                      <Input
                        value={form.name}
                        onChange={(e) => setFormField('name', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nama Panggilan</FieldLabel>
                      <Input
                        value={form.nickname}
                        onChange={(e) =>
                          setFormField('nickname', e.target.value)
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Jenis Kelamin</FieldLabel>
                      <DropdownMenu
                        open={dropdownJenisKelaminOpen}
                        onOpenChange={setDropdownJenisKelaminOpen}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between border-primary"
                          >
                            <span
                              className={
                                form.gender ? '' : 'text-muted-foreground'
                              }
                            >
                              {form.gender || 'Pilih jenis kelamin'}
                            </span>
                            {dropdownJenisKelaminOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                          {['Laki-laki', 'Perempuan'].map((jk) => (
                            <DropdownMenuItem
                              key={jk}
                              onSelect={() => setFormField('gender', jk)}
                            >
                              {jk}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Field>
                    <Field>
                      <FieldLabel>Nomor Handphone</FieldLabel>
                      <Input
                        value={form.phone}
                        onChange={(e) => {
                          setFormField('phone', e.target.value)
                          setPhoneError('')
                        }}
                      />
                      {phoneError && (
                        <FieldDescription className="text-destructive">
                          {phoneError}
                        </FieldDescription>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel>Umur</FieldLabel>
                      <Input
                        value={form.age}
                        onChange={(e) => setFormField('age', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Pekerjaan</FieldLabel>
                      <Input
                        value={form.occupation}
                        onChange={(e) =>
                          setFormField('occupation', e.target.value)
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Tanggal Lahir</FieldLabel>
                      <DatePicker
                        value={form.birthDate}
                        onChange={(date) => setFormField('birthDate', date)}
                        placeholder="Pilih tanggal lahir"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nama Orang Tua</FieldLabel>
                      <Input
                        value={form.parentName}
                        onChange={(e) =>
                          setFormField('parentName', e.target.value)
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kota/Kabupaten</FieldLabel>
                      <Input
                        value={form.city}
                        onChange={(e) => setFormField('city', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kecamatan</FieldLabel>
                      <Input
                        value={form.district}
                        onChange={(e) =>
                          setFormField('district', e.target.value)
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kelurahan</FieldLabel>
                      <Input
                        value={form.village}
                        onChange={(e) =>
                          setFormField('village', e.target.value)
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Alamat Lengkap</FieldLabel>
                      <Input
                        value={form.address}
                        onChange={(e) =>
                          setFormField('address', e.target.value)
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Tinggi Badan (cm)</FieldLabel>
                      <Input
                        value={form.height}
                        onChange={(e) => setFormField('height', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Berat Badan (kg)</FieldLabel>
                      <Input
                        value={form.weight}
                        onChange={(e) => setFormField('weight', e.target.value)}
                      />
                    </Field>
                  </FieldGroup>

                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      <Heart className="w-12 h-12 text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Riwayat Kesehatan Umum
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>

                  <FieldGroup>
                    <YesNoFieldWithDetail
                      label="Apakah ada alergi obat atau makanan?"
                      checked={toggles.hasAlergi}
                      onCheckedChange={(c) => setToggle('hasAlergi', c)}
                      detailValue={medical.allergy_detail || ''}
                      onDetailChange={(value) =>
                        setMedical((prev) => ({
                          ...prev,
                          allergy_detail: value,
                        }))
                      }
                      placeholder="Contoh: alergi penisilin, seafood, dll"
                    />
                    <YesNoFieldWithDetail
                      label="Apakah ada riwayat penyakit sistemik? (Misalnya hipertensi, Jantung, Kanker, dll)"
                      checked={toggles.hasPenyakitSistemik}
                      onCheckedChange={(c) =>
                        setToggle('hasPenyakitSistemik', c)
                      }
                      detailValue={medical.systemic_disease_detail || ''}
                      onDetailChange={(value) =>
                        setMedical((prev) => ({
                          ...prev,
                          systemic_disease_detail: value,
                        }))
                      }
                      placeholder="Contoh: hipertensi sejak 2020"
                    />
                    <YesNoFieldWithDetail
                      label="Apakah Anda sedang konsumsi obat, kemoterapi, atau radiasi?"
                      checked={toggles.isKonsumsiObat}
                      onCheckedChange={(c) => setToggle('isKonsumsiObat', c)}
                      detailValue={medical.treatment_detail || ''}
                      onDetailChange={(value) =>
                        setMedical((prev) => ({
                          ...prev,
                          treatment_detail: value,
                        }))
                      }
                      placeholder="Tuliskan obat/terapi yang sedang dijalani"
                    />
                    <YesNoFieldWithDetail
                      label="Apakah Anda pernah dirawat di rumah sakit?"
                      checked={toggles.isRawatRumahSakit}
                      onCheckedChange={(c) => setToggle('isRawatRumahSakit', c)}
                      detailValue={medical.hospitalized_reason || ''}
                      onDetailChange={(value) =>
                        setMedical((prev) => ({
                          ...prev,
                          hospitalized_reason: value,
                        }))
                      }
                      placeholder="Tuliskan alasan/perawatan saat dirawat"
                    />
                    <YesNoField
                      label="Memiliki kebiasaan merokok atau alkohol?"
                      checked={toggles.isKebiasaanRokok}
                      onCheckedChange={(c) => setToggle('isKebiasaanRokok', c)}
                    />
                  </FieldGroup>

                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      <Smile className="w-12 h-12 text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Riwayat Kesehatan Gigi dan Mulut
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>

                  <FieldGroup>
                    <YesNoFieldWithDetail
                      label="Apakah Anda sering mengalami sakit gigi?"
                      checked={toggles.isSakitGigi}
                      onCheckedChange={(c) => setToggle('isSakitGigi', c)}
                      detailValue={dental.tooth_pain_detail || ''}
                      onDetailChange={(value) =>
                        setDental((prev) => ({
                          ...prev,
                          tooth_pain_detail: value,
                        }))
                      }
                      placeholder="Contoh: sakit saat minum dingin, 2x seminggu"
                    />
                    <YesNoField
                      label="Apakah Anda pernah mengalami berdarah saat menyikat gigi?"
                      checked={toggles.isBerdarahSikatGigi}
                      onCheckedChange={(c) =>
                        setToggle('isBerdarahSikatGigi', c)
                      }
                    />
                    <YesNoFieldWithDetail
                      label="Apakah Anda pernah melakukan perawatan gigi sebelumnya?"
                      checked={toggles.isPerawatanGigiSebelumnya}
                      onCheckedChange={(c) =>
                        setToggle('isPerawatanGigiSebelumnya', c)
                      }
                      detailValue={dental.dental_treatment_detail || ''}
                      onDetailChange={(value) =>
                        setDental((prev) => ({
                          ...prev,
                          dental_treatment_detail: value,
                        }))
                      }
                      placeholder="Contoh: scaling, tambal, cabut gigi"
                    />
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Seberapa sering Anda menyikat gigi dalam sehari?
                      </FieldLabel>
                      <Select
                        value={dental.brushing_frequency ?? undefined}
                        onValueChange={(v) =>
                          setDental((prev) => ({
                            ...prev,
                            brushing_frequency: v,
                          }))
                        }
                      >
                        <SelectTrigger className="max-w-130">
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 kali sehari</SelectItem>
                          <SelectItem value="2">2 kali sehari</SelectItem>
                          <SelectItem value="more_than_2">
                            Lebih dari 2 kali sehari
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <YesNoField
                      label="Apakah Anda menggunakan benang gigi atau moouthwash secara rutin?"
                      checked={toggles.isKebisaanKesehatanMulut}
                      onCheckedChange={(c) =>
                        setToggle('isKebisaanKesehatanMulut', c)
                      }
                    />
                    <YesNoFieldWithDetail
                      label="Apakah Anda memiliki kebiasaan buruk (Misal menggertakan gigi)"
                      checked={toggles.isKebiasaanBuruk}
                      onCheckedChange={(c) => setToggle('isKebiasaanBuruk', c)}
                      detailValue={dental.bad_habits_detail || ''}
                      onDetailChange={(value) =>
                        setDental((prev) => ({
                          ...prev,
                          bad_habits_detail: value,
                        }))
                      }
                      placeholder="Contoh: menggertakan gigi saat tidur"
                    />
                    <YesNoFieldWithDetail
                      label="Apakah Anda pernah menggunakan kawat gigi atau behel? (dalam tahun)"
                      checked={toggles.isKawatGigi}
                      onCheckedChange={(c) => setToggle('isKawatGigi', c)}
                      detailValue={dental.braces_years || ''}
                      onDetailChange={(value) =>
                        setDental((prev) => ({ ...prev, braces_years: value }))
                      }
                      placeholder="Contoh: 2 (2 tahun penggunaan kawat gigi)"
                    />
                    <YesNoFieldWithDetail
                      label="Apakah Anda pernah menjalani perawatan saluran akar (PSA)?"
                      checked={toggles.isPSA}
                      onCheckedChange={(c) => setToggle('isPSA', c)}
                      detailValue={dental.root_canal_detail || ''}
                      onDetailChange={(value) =>
                        setDental((prev) => ({
                          ...prev,
                          root_canal_detail: value,
                        }))
                      }
                      placeholder="Contoh: gigi geraham kanan bawah tahun 2023"
                    />
                    <YesNoField
                      label="Apakah Anda memiliki gigi palsu (lepas atau permanen)?"
                      checked={toggles.isMemilikiGigiPalsu}
                      onCheckedChange={(c) =>
                        setToggle('isMemilikiGigiPalsu', c)
                      }
                    />
                    <YesNoField
                      label="Apakah Anda rutin kontrol ke dokter gigi setiap 6 bulan?"
                      checked={toggles.isRutinKontrol}
                      onCheckedChange={(c) => setToggle('isRutinKontrol', c)}
                    />
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Berapa kali Anda checkup ke dokter gigi?
                      </FieldLabel>
                      <Select
                        value={dental.dental_checkup_frequency ?? undefined}
                        onValueChange={(v) =>
                          setDental((prev) => ({
                            ...prev,
                            dental_checkup_frequency: v,
                          }))
                        }
                      >
                        <SelectTrigger className="max-w-130">
                          <SelectValue placeholder="Pilih frekuensi checkup" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6_months">
                            6 bulan sekali
                          </SelectItem>
                          <SelectItem value="1_year">1 kali setahun</SelectItem>
                          <SelectItem value="more_than_1_year">
                            1 kali tiap lebih dari 1 tahun
                          </SelectItem>
                          <SelectItem value="never">Belum pernah</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>

                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      <Clock className="w-12 h-12 text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Reservasi
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>

                  <FieldGroup className="grid md:grid-cols-2 gap-x-16 gap-y-4">
                    <Field>
                      <FieldLabel>Nama Lengkap</FieldLabel>
                      <Input
                        value={form.name}
                        onChange={(e) => setFormField('name', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Tanggal Lahir</FieldLabel>
                      <DatePicker
                        value={form.birthDate}
                        onChange={(date) => setFormField('birthDate', date)}
                        placeholder="Pilih tanggal lahir"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Umur</FieldLabel>
                      <Input
                        value={form.age}
                        onChange={(e) => setFormField('age', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nomor Handphone</FieldLabel>
                      <Input
                        value={form.phone}
                        onChange={(e) => {
                          setFormField('phone', e.target.value)
                          setPhoneError('')
                        }}
                      />
                      {phoneError && (
                        <FieldDescription className="text-destructive">
                          {phoneError}
                        </FieldDescription>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel>Jadwal Periksa</FieldLabel>
                      <Input value={form.reservationDate} disabled />
                    </Field>
                    <Field>
                      <FieldLabel>Jam Reservasi</FieldLabel>
                      <Input value={form.appointmentTime} disabled />
                    </Field>
                    <Field>
                      <FieldLabel>Pilihan Dokter</FieldLabel>
                      <DropdownMenu
                        open={dropdownDokterOpen}
                        onOpenChange={setDropdownDokterOpen}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between border-primary"
                          >
                            <span
                              className={
                                form.doctor ? '' : 'text-muted-foreground'
                              }
                            >
                              {form.doctor || 'Pilih dokter'}
                            </span>
                            {dropdownDokterOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                          {doctorList.map((d) => (
                            <DropdownMenuItem
                              key={d}
                              onSelect={() => setFormField('doctor', d)}
                            >
                              {d}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Field>
                    <Field>
                      <FieldLabel>Layanan</FieldLabel>
                      <MultiSelect
                        items={layananList}
                        value={form.layanan}
                        onChange={(next) => setFormField('layanan', next)}
                        placeholder="Pilih layanan..."
                      />
                    </Field>
                    <Field className="md:col-span-2">
                      <FieldLabel>Status Reservasi</FieldLabel>
                      <Select
                        value={selectedStatus}
                        onValueChange={(v) =>
                          setSelectedStatus(v as AdminReservationStatus)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Menunggu</SelectItem>
                          <SelectItem value="validated">Tervalidasi</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                          <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>

                  <Field>
                    <FieldLabel>Keluhan</FieldLabel>
                    <Textarea
                      value={form.complain}
                      onChange={(e) => setFormField('complain', e.target.value)}
                    />
                  </Field>

                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      <FileText className="w-12 h-12 text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Catatan Dokter
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <Field>
                    <FieldLabel>Catatan/Rekomendasi Dokter</FieldLabel>
                    <Textarea
                      value={form.doctorNotes}
                      onChange={(e) =>
                        setFormField('doctorNotes', e.target.value)
                      }
                    />
                  </Field>

                  {submitError ? (
                    <p className="text-sm text-destructive">{submitError}</p>
                  ) : null}

                  <DialogFooter className="mt-6">
                    {item.status === 'pending' && (
                      <>
                        <Button
                          type="button"
                          className="bg-red-400 hover:bg-red-500 text-white"
                          onClick={() => setConfirmCancel(true)}
                          disabled={updateStatus.isPending}
                        >
                          {updateStatus.isPending
                            ? 'Membatalkan...'
                            : 'Batalkan Reservasi'}
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => setConfirmValidate(true)}
                          disabled={updateStatus.isPending}
                        >
                          {updateStatus.isPending
                            ? 'Memvalidasi...'
                            : 'Validasi'}
                        </Button>
                      </>
                    )}
                    {item.status === 'validated' && (
                      <>
                        <Button
                          type="button"
                          className="bg-red-400 hover:bg-red-500 text-white"
                          onClick={() => setConfirmCancel(true)}
                          disabled={updateStatus.isPending}
                        >
                          {updateStatus.isPending
                            ? 'Membatalkan...'
                            : 'Batalkan Reservasi'}
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => setConfirmComplete(true)}
                          disabled={updateStatus.isPending}
                        >
                          {updateStatus.isPending
                            ? 'Menyelesaikan...'
                            : 'Selesai'}
                        </Button>
                      </>
                    )}
                  </DialogFooter>

                  <AlertDialog
                    open={confirmValidate}
                    onOpenChange={setConfirmValidate}
                  >
                    <AlertDialogContent>
                      <AlertDialogTitle>Validasi Reservasi</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin memvalidasi reservasi ini?
                      </AlertDialogDescription>
                      <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleValidate}>
                          Validasi
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog
                    open={confirmCancel}
                    onOpenChange={setConfirmCancel}
                  >
                    <AlertDialogContent>
                      <AlertDialogTitle>Batalkan Reservasi</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin membatalkan reservasi ini?
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                      <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancel}
                          className="bg-red-400 hover:bg-red-500 text-white"
                        >
                          Batalkan
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog
                    open={confirmComplete}
                    onOpenChange={setConfirmComplete}
                  >
                    <AlertDialogContent>
                      <AlertDialogTitle>Selesaikan Reservasi</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menyelesaikan reservasi ini?
                      </AlertDialogDescription>
                      <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleComplete}>
                          Selesai
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 text-sm gap-2 font-bold mt-1">
        <p className="flex gap-2 items-center">
          <Calendar className="w-4 h-4" />
          {formatDateOnly(item.reservation_date)}
        </p>
        <p className="flex gap-2 items-center">
          <Phone className="w-4 h-4" />
          {item.patient?.phone || '-'}
        </p>
        <p className="flex gap-2 items-center">
          <Clock className="w-4 h-4" />
          {formatTime(item.appointment_time)}
        </p>
        <p className="flex gap-2 items-center">
          <User className="w-4 h-4" />
          {item.doctor?.name || '-'}
        </p>
      </div>
    </div>
  )
}

function YesNoField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (value: CheckedState) => void
}) {
  return (
    <Field className="flex flex-row items-center justify-between w-full">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex justify-end">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </Field>
  )
}

function YesNoFieldWithDetail({
  label,
  checked,
  onCheckedChange,
  detailValue,
  onDetailChange,
  placeholder,
}: {
  label: string
  checked: boolean
  onCheckedChange: (value: CheckedState) => void
  detailValue: string
  onDetailChange: (value: string) => void
  placeholder: string
}) {
  return (
    <Field className="flex flex-col w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <FieldLabel>{label}</FieldLabel>
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      {checked ? (
        <Input
          value={detailValue}
          onChange={(e) => onDetailChange(e.target.value)}
          placeholder={placeholder}
          className="mt-2"
        />
      ) : null}
    </Field>
  )
}

function RouteComponent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminReservations()

  const { pending, validated, completed, cancelled } = useMemo(() => {
    const all = [
      ...(data?.pages.flatMap((page) => page.reservations) || []),
    ].sort((a, b) => getReservationSortTime(a) - getReservationSortTime(b))
    return {
      pending: all.filter((r) => r.status === 'pending'),
      validated: all.filter((r) => r.status === 'validated'),
      completed: all.filter((r) => r.status === 'completed'),
      cancelled: all.filter((r) => r.status === 'cancelled'),
    }
  }, [data])

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Antrian Pasien</h1>
      <p className="text-sm text-muted-foreground">
        {new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <div className="mt-4 space-y-6">
        {/* Pending Section */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-yellow-700">
                Menunggu ({pending.length})
              </h2>
              <div className="flex-1 h-0.5 bg-yellow-200"></div>
            </div>
            <div className="space-y-4">
              {pending.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Validated Section */}
        {validated.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-blue-700">
                Tervalidasi ({validated.length})
              </h2>
              <div className="flex-1 h-0.5 bg-blue-200"></div>
            </div>
            <div className="space-y-4">
              {validated.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {completed.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-green-700">
                Selesai ({completed.length})
              </h2>
              <div className="flex-1 h-0.5 bg-green-200"></div>
            </div>
            <div className="space-y-4">
              {completed.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Section */}
        {cancelled.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-red-700">
                Dibatalkan ({cancelled.length})
              </h2>
              <div className="flex-1 h-0.5 bg-red-200"></div>
            </div>
            <div className="space-y-4">
              {cancelled.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 &&
          validated.length === 0 &&
          completed.length === 0 &&
          cancelled.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada reservasi
            </p>
          )}

        {hasNextPage && (
          <div className="flex justify-center py-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? 'Memuat...' : 'Muat Lebih Banyak'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
