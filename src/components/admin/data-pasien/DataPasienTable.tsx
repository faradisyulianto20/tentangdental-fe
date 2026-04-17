import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { CheckedState } from '@radix-ui/react-checkbox'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  Heart,
  Search,
  Smile,
  Trash2,
  User,
} from 'lucide-react'
import { ApiError } from '@/lib/api-client'
import {
  useAdminPatientById,
  useAdminPatients,
  useDeleteAdminPatient,
} from '@/hooks/usePatient'
import {
  useAdminReservationById,
  useUpdateAdminReservationPatientDetails,
} from '@/hooks/useReservasi'
import type {
  AdminPatientDetail,
  AdminPatientListItem,
  PatientGender,
} from '@/services/patientService'
import type {
  ReservationDentalHistoryForm,
  ReservationMedicalHistoryForm,
  ReservationPatientForm,
  AdminReservationDetail,
} from '@/services/reservasiService'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldTitle,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

const itemsPerPage = 10

type PatientRow = {
  id: number
  no: number
  nomorPasien: string
  namaPasien: string
  umur: string
  noTelp: string
}

type FieldErrors = Partial<Record<string, string>>

type FormState = {
  name: string
  nickname: string
  gender: '' | 'Laki-laki' | 'Perempuan'
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
  layanan: string
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

function yesNoToBool(input?: string | boolean | null) {
  if (typeof input === 'boolean') return input
  if (!input) return false
  return ['yes', 'true', '1'].includes(input.toLowerCase())
}

function toIsoDate(date: Date | null) {
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDate(value?: string | null) {
  if (!value) return null
  const next = new Date(value)
  if (Number.isNaN(next.getTime())) return null
  return next
}

function normalizeOptionalText(value?: string | null) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function normalizeSelectableValue(value?: string | null) {
  if (!value) return null

  if (value === '1-kali') return '1'
  if (value === '2-kali') return '2'
  if (value === '3-kali') return 'more_than_2'
  if (value === 'lebih-3') return 'more_than_2'

  if (value === '3-bulan') return '3_months'
  if (value === '6-bulan') return '6_months'
  if (value === '1-tahun') return '1_year'
  if (value === '2-tahun') return 'more_than_1_year'
  if (value === '3-tahun') return 'more_than_1_year'
  if (value === '2_years') return 'more_than_1_year'
  if (value === '3_years') return 'more_than_1_year'
  if (value === 'irregular') return 'more_than_1_year'
  if (value === 'jarang') return 'more_than_1_year'
  if (value === 'belum') return 'never'

  return value
}

function toId(value: string | number) {
  return typeof value === 'number' ? value : Number(value)
}

function getReadableError(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback

  if (error.status === 401) return 'Sesi habis. Silakan login kembali.'
  if (error.status === 403) return 'Akses ditolak.'

  const payload =
    typeof error.payload === 'object' && error.payload !== null
      ? (error.payload as Record<string, unknown>)
      : null

  if (payload && typeof payload.message === 'string' && payload.message) {
    return payload.message
  }

  return error.message || fallback
}

function extractFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ApiError)) return {}

  const payload =
    typeof error.payload === 'object' && error.payload !== null
      ? (error.payload as Record<string, unknown>)
      : null

  if (
    !payload ||
    typeof payload.errors !== 'object' ||
    payload.errors === null
  ) {
    return {}
  }

  const errors = payload.errors as Record<string, unknown>
  const next: FieldErrors = {}

  Object.entries(errors).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      next[key] = String(value[0])
      return
    }

    if (typeof value === 'string') {
      next[key] = value
    }
  })

  return next
}

function mapGenderLabel(gender?: PatientGender | null) {
  if (gender === 'laki-laki') return 'Laki-laki'
  if (gender === 'perempuan') return 'Perempuan'
  return ''
}

function mapGenderPayload(genderLabel: FormState['gender']) {
  if (genderLabel === 'Laki-laki') return 'male'
  if (genderLabel === 'Perempuan') return 'female'
  return null
}

function mapGenderFromReservation(gender?: string | null) {
  if (gender === 'perempuan' || gender === 'female') return 'Perempuan'
  if (gender === 'laki-laki' || gender === 'male') return 'Laki-laki'
  return ''
}

function mapPatientToForm(
  detail: AdminPatientDetail,
  reservationData?: AdminReservationDetail,
) {
  const lastReservation = detail.last_reservation
  const firstReservation =
    Array.isArray(detail.reservations) && detail.reservations.length > 0
      ? detail.reservations[0]
      : null
  const medical = { ...emptyMedical, ...(detail.medical_history || {}) }
  const dental = {
    ...emptyDental,
    ...(detail.dental_history || {}),
    brushing_frequency: normalizeSelectableValue(
      detail.dental_history?.brushing_frequency,
    ),
    dental_checkup_frequency: normalizeSelectableValue(
      detail.dental_history?.dental_checkup_frequency,
    ),
  }

  // Priority: ambil dari reservation patient_form, fallback ke detail patient data
  const patientForm = reservationData?.patient_form
  const form: FormState = {
    name: patientForm?.name || detail.name || '',
    nickname: patientForm?.nickname || detail.nickname || '',
    gender: patientForm
      ? mapGenderFromReservation(patientForm.gender)
      : mapGenderLabel(detail.gender),
    phone: patientForm?.phone || detail.phone || '',
    age: patientForm?.age || (detail.age ? String(detail.age) : ''),
    occupation: patientForm?.occupation || detail.occupation || '',
    birthDate: parseDate(patientForm?.birth_date || detail.birth_date),
    parentName: patientForm?.parent_name || detail.parent_name || '',
    city: patientForm?.city || detail.city || '',
    district: patientForm?.district || detail.district || '',
    village: patientForm?.village || detail.village || '',
    address: patientForm?.address || detail.address || '',
    height: patientForm?.height || (detail.height ? String(detail.height) : ''),
    weight: patientForm?.weight || (detail.weight ? String(detail.weight) : ''),
    complain: firstReservation?.complain || '',
    reservationDate: lastReservation?.reservation_date || '-',
    appointmentTime: lastReservation?.appointment_time || '-',
    doctor: lastReservation?.doctor_name || '-',
    layanan:
      lastReservation?.services.map((service) => service.name).join(', ') ||
      '-',
    doctorNotes: (dental.doctor_notes as string) || '',
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

  return { form, medical, dental, toggles }
}

function FormulirDialog({ pasien }: { pasien: PatientRow }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [dropdownJenisKelaminOpen, setDropdownJenisKelaminOpen] =
    useState(false)
  const isInitializedRef = useRef(false)

  const detailQuery = useAdminPatientById(pasien.id, open)
  const updatePatientDetails = useUpdateAdminReservationPatientDetails()

  // Get first/last reservation ID from patient detail
  const firstReservationId = useMemo(() => {
    if (!detailQuery.data?.reservations || detailQuery.data.reservations.length === 0) {
      return undefined
    }
    
    // Karena sudah fetch patient spesifik, semua reservasi di array ini adalah milik patient itu
    // Ambil reservation pertama (index 0)
    const firstReservation = detailQuery.data.reservations[0]
    const id = Number(firstReservation.id)
    
    return id
  }, [detailQuery.data?.reservations, pasien.id])

  // Fetch full reservation data (includes patient_form)
  const reservationQuery = useAdminReservationById(
    firstReservationId,
    open && !!firstReservationId,
  )

  const [form, setForm] = useState<FormState | null>(null)
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

  // Reset initialized flag when dialog opens with different patient or closes
  useEffect(() => {
    isInitializedRef.current = false
  }, [open, pasien.id])

  useEffect(() => {
    if (!detailQuery.data) {
      return
    }
    
    // Only initialize on first load, not on subsequent data changes
    if (!isInitializedRef.current) {
      const mapped = mapPatientToForm(detailQuery.data, reservationQuery.data)
      
      setForm(mapped.form)
      setMedical(mapped.medical)
      setDental(mapped.dental)
      setToggles(mapped.toggles)
      setSubmitError('')
      setFieldErrors({})
      isInitializedRef.current = true
    }
  }, [detailQuery.data])

  const setFormField = (key: keyof FormState, value: string | Date | null) => {
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [key]: value,
      }
    })
  }

  const setToggle = (key: keyof ToggleState, value: CheckedState) => {
    if (typeof value !== 'boolean') return
    setToggles((prev) => ({ ...prev, [key]: value }))
  }

  const save = async () => {
    if (!form) return

    setSubmitError('')
    setFieldErrors({})

    if (!firstReservationId) {
      setSubmitError('Tidak ada reservasi yang ditemukan untuk pasien ini.')
      return
    }

    try {
      await updatePatientDetails.mutateAsync({
        id: toId(firstReservationId),
        data: {
          patient_id: pasien.id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          birth_date: toIsoDate(form.birthDate),
          gender: mapGenderPayload(form.gender),
          address: form.address || null,
          age: form.age ? Number(form.age) : null,
          nickname: form.nickname || null,
          district: form.district || null,
          city: form.city || null,
          village: form.village || null,
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
            doctor_notes: normalizeOptionalText(form.doctorNotes),
          },
        },
      })

      // Invalidate queries untuk force refetch data
      await queryClient.invalidateQueries({
        queryKey: ['adminPatientById', pasien.id],
      })
      await queryClient.invalidateQueries({
        queryKey: ['adminReservationById', firstReservationId],
      })

      setOpen(false)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate({ to: '/login' })
        return
      }

      setSubmitError(getReadableError(error, 'Gagal menyimpan data pasien.'))
      setFieldErrors(extractFieldErrors(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="text-xs md:text-sm">
          Lihat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-sm p-8">
        {(() => {
          return detailQuery.isLoading || reservationQuery.isLoading || !form ? (
            <p className="text-sm text-muted-foreground">
              Memuat detail pasien...
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
                    Nomor Pasien:{' '}
                    <span className="font-medium">{pasien.nomorPasien}</span>
                  </FieldDescription>
                </div>
              </FieldLegend>
            </FieldGroup>
            <FieldGroup className="grid md:grid-cols-2 gap-x-16 gap-y-4">
              <Field>
                <FieldLabel>Nama Pasien</FieldLabel>
                <Input
                  placeholder="Masukkan nama pasien"
                  value={form.name}
                  onChange={(e) => setFormField('name', e.target.value)}
                />
                {fieldErrors.name ? (
                  <FieldDescription className="text-destructive">
                    {fieldErrors.name}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Nama Panggilan</FieldLabel>
                <Input
                  placeholder="Masukkan nama panggilan pasien"
                  value={form.nickname}
                  onChange={(e) => setFormField('nickname', e.target.value)}
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
                        className={form.gender ? '' : 'text-muted-foreground'}
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
                {fieldErrors.gender ? (
                  <FieldDescription className="text-destructive">
                    {fieldErrors.gender}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Nomor Handphone</FieldLabel>
                <Input
                  placeholder="Masukkan nomor HP pasien"
                  value={form.phone}
                  onChange={(e) => setFormField('phone', e.target.value)}
                />
                {fieldErrors.phone ? (
                  <FieldDescription className="text-destructive">
                    {fieldErrors.phone}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Umur</FieldLabel>
                <Input
                  placeholder="Masukkan umur pasien"
                  value={form.age}
                  onChange={(e) => setFormField('age', e.target.value)}
                />
                {fieldErrors.age ? (
                  <FieldDescription className="text-destructive">
                    {fieldErrors.age}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Pekerjaan</FieldLabel>
                <Input
                  placeholder="Masukkan pekerjaan pasien"
                  value={form.occupation}
                  onChange={(e) => setFormField('occupation', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Tanggal Lahir</FieldLabel>
                <DatePicker
                  value={form.birthDate}
                  onChange={(date) => setFormField('birthDate', date)}
                  placeholder="Pilih tanggal lahir"
                />
                {fieldErrors.birth_date ? (
                  <FieldDescription className="text-destructive">
                    {fieldErrors.birth_date}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Nama Orang Tua</FieldLabel>
                <Input
                  placeholder="Masukkan nama orang tua pasien"
                  value={form.parentName}
                  onChange={(e) => setFormField('parentName', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Kota/Kabupaten</FieldLabel>
                <Input
                  placeholder="Masukkan kota/kabupaten pasien"
                  value={form.city}
                  onChange={(e) => setFormField('city', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Kecamatan</FieldLabel>
                <Input
                  placeholder="Masukkan kecamatan pasien"
                  value={form.district}
                  onChange={(e) => setFormField('district', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Kelurahan</FieldLabel>
                <Input
                  placeholder="Masukkan kelurahan pasien"
                  value={form.village}
                  onChange={(e) => setFormField('village', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Alamat Lengkap</FieldLabel>
                <Input
                  placeholder="Masukkan alamat lengkap pasien"
                  value={form.address}
                  onChange={(e) => setFormField('address', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Tinggi Badan (cm)</FieldLabel>
                <Input
                  placeholder="Masukkan tinggi badan pasien"
                  value={form.height}
                  onChange={(e) => setFormField('height', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Berat Badan (kg)</FieldLabel>
                <Input
                  placeholder="Masukkan berat badan pasien"
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
            <FieldGroup className="flex">
              <YesNoFieldWithDetail
                label="Apakah ada alergi obat atau makanan?"
                checked={toggles.hasAlergi}
                onCheckedChange={(checked) => setToggle('hasAlergi', checked)}
                detailValue={String(medical.allergy_detail || '')}
                onDetailChange={(value) =>
                  setMedical((prev) => ({ ...prev, allergy_detail: value }))
                }
                placeholder="Jika ya, sebutkan alergi tersebut"
              />
              <YesNoFieldWithDetail
                label="Apakah ada riwayat penyakit sistemik? (Misalnya hipertensi, Jantung, Kanker, dll)"
                checked={toggles.hasPenyakitSistemik}
                onCheckedChange={(checked) =>
                  setToggle('hasPenyakitSistemik', checked)
                }
                detailValue={String(medical.systemic_disease_detail || '')}
                onDetailChange={(value) =>
                  setMedical((prev) => ({
                    ...prev,
                    systemic_disease_detail: value,
                  }))
                }
                placeholder="Jika ya, sebutkan penyakit sistemik tersebut"
              />
              <YesNoFieldWithDetail
                label="Apakah Anda sedang konsumsi obat, kemoterapi, atau radiasi?"
                checked={toggles.isKonsumsiObat}
                onCheckedChange={(checked) =>
                  setToggle('isKonsumsiObat', checked)
                }
                detailValue={String(medical.treatment_detail || '')}
                onDetailChange={(value) =>
                  setMedical((prev) => ({ ...prev, treatment_detail: value }))
                }
                placeholder="Jika ya, sebutkan obat, kemoterapi, atau radiasi yang sedang dikonsumsi"
              />
              <YesNoFieldWithDetail
                label="Apakah Anda pernah dirawat di rumah sakit?"
                checked={toggles.isRawatRumahSakit}
                onCheckedChange={(checked) =>
                  setToggle('isRawatRumahSakit', checked)
                }
                detailValue={String(medical.hospitalized_reason || '')}
                onDetailChange={(value) =>
                  setMedical((prev) => ({
                    ...prev,
                    hospitalized_reason: value,
                  }))
                }
                placeholder="Jika ya, sebutkan kapan dan untuk penyakit apa Anda dirawat di rumah sakit"
              />
              <YesNoField
                label="Memiliki kebiasaan merokok atau alkohol?"
                checked={toggles.isKebiasaanRokok}
                onCheckedChange={(checked) =>
                  setToggle('isKebiasaanRokok', checked)
                }
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
                onCheckedChange={(checked) => setToggle('isSakitGigi', checked)}
                detailValue={String(dental.tooth_pain_detail || '')}
                onDetailChange={(value) =>
                  setDental((prev) => ({ ...prev, tooth_pain_detail: value }))
                }
                placeholder="Jika ya, sebutkan sejak kapan dan seberapa sering Anda mengalami sakit gigi"
              />
              <YesNoField
                label="Apakah Anda pernah mengalami berdarah saat menyikat gigi?"
                checked={toggles.isBerdarahSikatGigi}
                onCheckedChange={(checked) =>
                  setToggle('isBerdarahSikatGigi', checked)
                }
              />
              <YesNoFieldWithDetail
                label="Apakah Anda pernah melakukan perawatan gigi sebelumnya?"
                checked={toggles.isPerawatanGigiSebelumnya}
                onCheckedChange={(checked) =>
                  setToggle('isPerawatanGigiSebelumnya', checked)
                }
                detailValue={String(dental.dental_treatment_detail || '')}
                onDetailChange={(value) =>
                  setDental((prev) => ({
                    ...prev,
                    dental_treatment_detail: value,
                  }))
                }
                placeholder="Jika ya, sebutkan jenis perawatan gigi yang pernah Anda lakukan sebelumnya"
              />
              <Field className="flex flex-row items-center justify-between w-full">
                <FieldLabel>
                  Seberapa sering Anda menyikat gigi dalam sehari?
                </FieldLabel>
                <Select
                  value={dental.brushing_frequency ?? undefined}
                  onValueChange={(value) =>
                    setDental((prev) => ({
                      ...prev,
                      brushing_frequency: value,
                    }))
                  }
                >
                  <SelectTrigger>
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
              {fieldErrors['dental_history.brushing_frequency'] ? (
                <FieldDescription className="text-destructive">
                  {fieldErrors['dental_history.brushing_frequency']}
                </FieldDescription>
              ) : null}
              <YesNoField
                label="Apakah Anda menggunakan benang gigi atau mouthwash secara rutin?"
                checked={toggles.isKebisaanKesehatanMulut}
                onCheckedChange={(checked) =>
                  setToggle('isKebisaanKesehatanMulut', checked)
                }
              />
              <YesNoFieldWithDetail
                label="Apakah Anda memiliki kebiasaan buruk (Misal menggertakan gigi)"
                checked={toggles.isKebiasaanBuruk}
                onCheckedChange={(checked) =>
                  setToggle('isKebiasaanBuruk', checked)
                }
                detailValue={String(dental.bad_habits_detail || '')}
                onDetailChange={(value) =>
                  setDental((prev) => ({ ...prev, bad_habits_detail: value }))
                }
                placeholder="Jika ya, sebutkan kebiasaan buruk apa yang Anda miliki"
              />
              <YesNoFieldWithDetail
                label="Apakah Anda pernah menggunakan kawat gigi atau behel? (dalam tahun)"
                checked={toggles.isKawatGigi}
                onCheckedChange={(checked) => setToggle('isKawatGigi', checked)}
                detailValue={String(dental.braces_years || '')}
                onDetailChange={(value) =>
                  setDental((prev) => ({ ...prev, braces_years: value }))
                }
                placeholder="Jika ya, sebutkan kapan dan berapa lama Anda menggunakan kawat gigi atau behel"
              />
              <YesNoFieldWithDetail
                label="Apakah Anda pernah menjalani perawatan saluran akar (PSA)?"
                checked={toggles.isPSA}
                onCheckedChange={(checked) => setToggle('isPSA', checked)}
                detailValue={String(dental.root_canal_detail || '')}
                onDetailChange={(value) =>
                  setDental((prev) => ({ ...prev, root_canal_detail: value }))
                }
                placeholder="Jika ya, sebutkan kapan dan gigi mana yang pernah menjalani perawatan saluran akar (PSA)"
              />
              <YesNoField
                label="Apakah Anda memiliki gigi palsu (lepas atau permanen)?"
                checked={toggles.isMemilikiGigiPalsu}
                onCheckedChange={(checked) =>
                  setToggle('isMemilikiGigiPalsu', checked)
                }
              />
              <YesNoField
                label="Apakah Anda rutin kontrol ke dokter gigi setiap 6 bulan?"
                checked={toggles.isRutinKontrol}
                onCheckedChange={(checked) =>
                  setToggle('isRutinKontrol', checked)
                }
              />
              <Field className="flex flex-row items-center justify-between w-full">
                <FieldLabel>
                  Berapa kali Anda checkup ke dokter gigi?
                </FieldLabel>
                <Select
                  value={dental.dental_checkup_frequency ?? undefined}
                  onValueChange={(value) =>
                    setDental((prev) => ({
                      ...prev,
                      dental_checkup_frequency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih frekuensi checkup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6_months">Setiap 6 bulan</SelectItem>
                    <SelectItem value="1_year">1 kali setahun</SelectItem>
                    <SelectItem value="more_than_1_year">
                      1 kali tiap lebih dari 1 tahun
                    </SelectItem>
                    <SelectItem value="never">Belum pernah</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {fieldErrors['dental_history.dental_checkup_frequency'] ? (
                <FieldDescription className="text-destructive">
                  {fieldErrors['dental_history.dental_checkup_frequency']}
                </FieldDescription>
              ) : null}
            </FieldGroup> 

            <FieldSeparator />

            <FieldGroup className="flex">
              <FieldLegend className="flex gap-2">
                <FileText className="w-12 h-12 text-primary" />
                <FieldTitle className="font-bold text-lg">
                  Catatan Dokter
                </FieldTitle>
              </FieldLegend>
            </FieldGroup>
            <FieldGroup className="grid md:grid-cols-1 gap-4">
              <Field>
                <FieldLabel>Catatan/Rekomendasi Dokter</FieldLabel>
                <Textarea
                  placeholder="Masukkan catatan atau rekomendasi dokter"
                  value={form.doctorNotes}
                  onChange={(e) => setFormField('doctorNotes', e.target.value)}
                />
              </Field>
            </FieldGroup>

            {submitError ? (
              <p className="text-sm text-destructive">{submitError}</p>
            ) : null}

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button
                type="button"
                className="bg-[#B9D654] text-white hover:bg-[#A8C24A]"
                onClick={save}
                disabled={updatePatientDetails.isPending}
              >
                {updatePatientDetails.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
            </>
          )
        })()}
      </DialogContent>
    </Dialog>
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
          placeholder={placeholder}
          className="mt-2"
          value={detailValue}
          onChange={(e) => onDetailChange(e.target.value)}
        />
      ) : null}
    </Field>
  )
}

function mapPatientsToRows(
  patients: AdminPatientListItem[],
  page: number,
  perPage: number,
): PatientRow[] {
  const offset = (page - 1) * perPage

  return patients.map((patient, index) => ({
    id: patient.id,
    no: offset + index + 1,
    nomorPasien: String(patient.id),
    namaPasien: patient.name,
    umur: patient.age ? String(patient.age) : '-',
    noTelp: patient.phone,
  }))
}

export default function DataPasienTable() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletePatientId, setDeletePatientId] = useState<number | null>(null)

  const patientsQuery = useAdminPatients(currentPage, itemsPerPage)
  const deletePatientMutation = useDeleteAdminPatient()


  useEffect(() => {
    if (
      patientsQuery.error instanceof ApiError &&
      patientsQuery.error.status === 401
    ) {
      navigate({ to: '/login' })
    }
  }, [navigate, patientsQuery.error])

  const rows = useMemo(
    () =>
      mapPatientsToRows(
        patientsQuery.data?.patients || [],
        currentPage,
        itemsPerPage,
      ),
    [currentPage, patientsQuery.data?.patients],
  )

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rows

    const query = searchQuery.toLowerCase()
    return rows.filter(
      (pasien) =>
        pasien.nomorPasien.toLowerCase().includes(query) ||
        pasien.namaPasien.toLowerCase().includes(query) ||
        pasien.noTelp.toLowerCase().includes(query),
    )
  }, [rows, searchQuery])

  const displayData = searchQuery.trim() ? filteredData : rows

  const totalPages = searchQuery.trim()
    ? Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
    : Math.max(1, patientsQuery.data?.pagination.last_page || 1)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleDeleteConfirm = async () => {
    if (deletePatientId) {
      try {
        await deletePatientMutation.mutateAsync(deletePatientId)
        setDeleteConfirmOpen(false)
        setDeletePatientId(null)
      } catch (error) {
        // Error is handled by mutation error state
      }
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleNavigate = (id: number) => {
    navigate({
      to: '/admin/data-pasien/rontgen',
      search: { id: String(id) },
    })
  }

  return (
    <div className="space-y-4 w-full">
      <InputGroup className="w-full md:w-1/2">
        <InputGroupInput
          placeholder="Cari berdasarkan nomor pasien, nama, atau nomor telp..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <InputGroupAddon>
          <Search size={20} className="text-gray-500" />
        </InputGroupAddon>
      </InputGroup>

      {patientsQuery.isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat data pasien...</p>
        </div>
      ) : patientsQuery.error instanceof ApiError &&
        patientsQuery.error.status === 403 ? (
        <div className="text-center py-8">
          <p className="text-destructive">Akses ditolak untuk data pasien.</p>
        </div>
      ) : displayData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Tidak ada data pasien yang sesuai dengan pencarian.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <Table className="rounded-xl">
              <TableCaption className="text-xs md:text-sm">
                Daftar data pasien Tentang Dental ({displayData.length} dari{' '}
                {patientsQuery.data?.pagination.total || displayData.length})
              </TableCaption>
              <TableHeader className="border-primary bg-[#E0F4FB] rounded-xl">
                <TableRow>
                  <TableHead className="w-8 md:w-12 text-xs md:text-sm">
                    No
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    Nomor Pasien
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    Nama Pasien
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    Umur
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    No Telp
                  </TableHead>
                  <TableHead className="text-center text-xs md:text-sm">
                    Formulir
                  </TableHead>
                  <TableHead className="text-center text-xs md:text-sm">
                    Rontgen
                  </TableHead>
                  <TableHead className="text-center text-xs md:text-sm">
                    Hapus
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((pasien) => (
                  <TableRow key={pasien.id}>
                    <TableCell className="font-medium text-xs md:text-sm">
                      {pasien.no}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.nomorPasien}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.namaPasien}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.umur}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.noTelp}
                    </TableCell>
                    <TableCell className="text-center">
                      <FormulirDialog pasien={pasien} />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs md:text-sm"
                          onClick={() => handleNavigate(pasien.id)}
                        >
                          Lihat
                        </Button>
                       
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs md:text-sm"
                          onClick={() => {
                            setDeletePatientId(pasien.id)
                            setDeleteConfirmOpen(true)
                          }}
                          disabled={deletePatientMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="text-xs md:text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || Boolean(searchQuery.trim())}
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 md:w-10 md:h-10 p-0 text-xs md:text-sm"
                      disabled={Boolean(searchQuery.trim())}
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={
                  currentPage === totalPages || Boolean(searchQuery.trim())
                }
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold">Hapus Pasien</h2>
          <p className="text-sm text-gray-600 mt-2">
            Apakah Anda yakin ingin menghapus data pasien ini? Tindakan ini tidak
            dapat diundo.
          </p>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletePatientMutation.isPending}
            >
              {deletePatientMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
