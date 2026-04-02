import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import { MultiSelect } from '@/components/ui/multi-select'
import { useState, useEffect, useRef } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useDokter } from '@/hooks/useDokter'
import { useLayanan } from '@/hooks/useLayanan'
import { useCreatePublicReservation } from '#/hooks/useReservasi'
import { ApiError } from '@/lib/api-client'

type ServerFieldErrors = Partial<Record<string, string>>

const badgeColors = [
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-teal-100 text-teal-700 border-teal-200',
]

// Zod Validation
const formSchema = z.object({
  namaLengkap: z.string().min(1, 'Nama lengkap harus diisi'),
  nomorHandphone: z.string().min(1, 'Nomor handphone harus diisi'),
  tanggalLahir: z.date().nullable(),
  umur: z.string().optional(),
  jadwalPeriksa: z
    .date({ required_error: 'Jadwal periksa harus diisi' })
    .nullable()
    .refine((val) => val !== null, { message: 'Jadwal periksa harus diisi' }),
  jamReservasi: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format jam harus HH:MM'),
  pilihanDokter: z.string().min(1, 'Pilihan dokter harus diisi'),
  layanan: z
    .array(z.string())
    .min(1, 'Layanan harus dipilih')
    .max(3, 'Maksimal 3 layanan'),
  nomorPasien: z.string().optional(),
  keluhan: z.string().min(1, 'Keluhan harus diisi'),
})

export default function FormReservasi() {
  const navigate = useNavigate()
  const { data: doctorsData } = useDokter()
  const { data: servicesData } = useLayanan()
  const createReservation = useCreatePublicReservation()
  const [checked, setChecked] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [serverErrors, setServerErrors] = useState<ServerFieldErrors>({})
  const [successOpen, setSuccessOpen] = useState(false)
  const [createdPatientId, setCreatedPatientId] = useState<string>('')

  const doctors = Array.isArray(doctorsData)
    ? doctorsData.map((doctor) => ({
        id: String(doctor.id),
        name: doctor.name,
      }))
    : []

  const services = Array.isArray(servicesData)
    ? servicesData.map((service) => ({
        id: String(service.id),
        name: service.name,
      }))
    : []

  const mapServerFieldErrors = (
    input: Record<string, unknown>,
  ): ServerFieldErrors => {
    const mapped: ServerFieldErrors = {}
    const mappings: Record<string, string> = {
      name: 'namaLengkap',
      phone: 'nomorHandphone',
      birth_date: 'tanggalLahir',
      age: 'umur',
      doctor_id: 'pilihanDokter',
      complain: 'keluhan',
      reservation_date: 'jadwalPeriksa',
      appointment_time: 'jamReservasi',
      service_ids: 'layanan',
      patient_category: 'nomorPasien',
    }

    Object.entries(input).forEach(([key, value]) => {
      const mappedKey = mappings[key]
      const messages = Array.isArray(value)
        ? value
        : typeof value === 'string'
          ? [value]
          : []

      if (mappedKey && messages.length > 0) {
        mapped[mappedKey] = String(messages[0])
      }
    })

    return mapped
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const { Field, handleSubmit, reset, setFieldValue } = useForm({
    defaultValues: {
      namaLengkap: '' as string,
      nomorHandphone: '' as string,
      tanggalLahir: null as Date | null,
      umur: '' as string,
      jadwalPeriksa: null as Date | null,
      jamReservasi: '' as string,
      pilihanDokter: '' as string,
      layanan: [] as string[],
      nomorPasien: '' as string,
      keluhan: '' as string,
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = formSchema.safeParse(value)
        if (!result.success) {
          return {
            fields: Object.fromEntries(
              Object.entries(result.error.flatten().fieldErrors).map(
                ([key, val]) => [key, val?.[0]],
              ),
            ),
          }
        }
        return undefined
      },
      onBlur: ({ value }) => {
        const result = formSchema.safeParse(value)
        if (!result.success) {
          return {
            fields: Object.fromEntries(
              Object.entries(result.error.flatten().fieldErrors).map(
                ([key, val]) => [key, val?.[0]],
              ),
            ),
          }
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitError('')
      setServerErrors({})

      try {
        const payload = {
          patient_category: checked ? 'existing' : 'new',
          name: value.namaLengkap,
          phone: value.nomorHandphone,
          gender: 'male' as const,
          address: '-',
          birth_date: value.tanggalLahir
            ? formatDate(value.tanggalLahir)
            : undefined,
          age: value.umur ? Number(value.umur) : undefined,
          doctor_id: Number(value.pilihanDokter),
          complain: value.keluhan,
          reservation_date:
            value.jadwalPeriksa !== null
              ? formatDate(value.jadwalPeriksa)
              : formatDate(new Date()),
          appointment_time: value.jamReservasi,
          service_ids: value.layanan.map((item) => Number(item)),
        }

        const result = await createReservation.mutateAsync(payload)
        setCreatedPatientId(String(result.patient.id))
        setSuccessOpen(true)
        reset()
        setChecked(false)
      } catch (error) {
        if (error instanceof ApiError) {
          const payload =
            typeof error.payload === 'object' && error.payload !== null
              ? (error.payload as Record<string, unknown>)
              : null

          const message =
            payload && typeof payload.message === 'string'
              ? payload.message
              : error.message

          setSubmitError(message)

          if (payload && typeof payload.errors === 'object' && payload.errors) {
            setServerErrors(
              mapServerFieldErrors(payload.errors as Record<string, unknown>),
            )
          }

          return
        }

        setSubmitError('Terjadi kesalahan jaringan. Silakan coba lagi.')
      }
    },
  })

  return (
    <div className="w-full mt-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit()
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="grid grid-cols-1">
              <Field name="namaLengkap">
                {(field) => (
                  <TextField
                    id="namaLengkap"
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap Anda"
                    field={field}
                    serverError={serverErrors.namaLengkap}
                  />
                )}
              </Field>
            </FieldGroup>

            <FieldGroup className="grid sm:grid-cols-2">
              <Field name="tanggalLahir">
                {(field) => {
                  const { errors, isTouched } = field.state.meta

                  return (
                    <div className="space-y-4">
                      <FieldLabel>Tanggal Lahir</FieldLabel>
                      <DatePicker
                        value={field.state.value}
                        onChange={(date: Date) => {
                          field.handleChange(date)
                          const today = new Date()
                          let age = today.getFullYear() - date.getFullYear()
                          const m = today.getMonth() - date.getMonth()
                          if (
                            m < 0 ||
                            (m === 0 && today.getDate() < date.getDate())
                          )
                            age--
                          setFieldValue('umur', age >= 0 ? String(age) : '')
                        }}
                        onBlur={field.handleBlur}
                        placeholder="Pilih tanggal lahir"
                      />
                      {((errors.length > 0 && isTouched) ||
                        serverErrors.tanggalLahir) && (
                        <FieldDescription className="text-destructive">
                          {serverErrors.tanggalLahir || String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>

              <Field name="umur">
                {(field) => (
                  <TextField
                    id="umur"
                    label="Umur"
                    placeholder="Masukkan umur Anda"
                    field={field}
                    serverError={serverErrors.umur}
                  />
                )}
              </Field>

              <Field name="nomorHandphone">
                {(field) => (
                  <TextField
                    id="nomorHandphone"
                    label="Nomor Handphone"
                    placeholder="Masukkan nomor handphone Anda"
                    field={field}
                    serverError={serverErrors.nomorHandphone}
                  />
                )}
              </Field>

              <Field name="jadwalPeriksa">
                {(field) => {
                  const { errors, isTouched } = field.state.meta

                  return (
                    <div className="space-y-4">
                      <FieldLabel>Jadwal Periksa</FieldLabel>
                      <DatePicker
                        value={field.state.value}
                        onChange={(date: Date) => field.handleChange(date)}
                        onBlur={field.handleBlur}
                        placeholder="Pilih jadwal periksa"
                      />
                      {((errors.length > 0 && isTouched) ||
                        serverErrors.jadwalPeriksa) && (
                        <FieldDescription className="text-destructive">
                          {serverErrors.jadwalPeriksa || String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>

              <Field name="jamReservasi">
                {(field) => (
                  <TextField
                    id="jamReservasi"
                    label="Jam Reservasi"
                    placeholder="Masukkan jam reservasi (misal: 14:30)"
                    field={field}
                    serverError={serverErrors.jamReservasi}
                  />
                )}
              </Field>

              <Field name="pilihanDokter">
                {(field) => {
                  const { errors, isTouched } = field.state.meta

                  return (
                    <div className="space-y-4">
                      <FieldLabel>Pilihan Dokter</FieldLabel>
                      <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                            onBlur={field.handleBlur}
                          >
                            <span
                              className={
                                field.state.value ? '' : 'text-muted-foreground'
                              }
                            >
                              {field.state.value || 'Pilih dokter'}{' '}
                            </span>
                            {dropdownOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                          {doctors.map((doctor) => (
                            <DropdownMenuItem
                              key={doctor.id}
                              onSelect={() => field.handleChange(doctor.id)}
                            >
                              {doctor.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {((errors.length > 0 && isTouched) ||
                        serverErrors.pilihanDokter) && (
                        <FieldDescription className="text-destructive">
                          {serverErrors.pilihanDokter || String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>

              <Field name="layanan">
                {(field) => {
                  const { errors, isTouched } = field.state.meta

                  return (
                    <div className="space-y-4">
                      <FieldLabel>Layanan</FieldLabel>
                      <LayananMultiSelect
                        value={field.state.value}
                        items={services}
                        onChange={(val) => field.handleChange(val)}
                        onBlur={field.handleBlur}
                      />
                      {((errors.length > 0 && isTouched) ||
                        serverErrors.layanan) && (
                        <FieldDescription className="text-destructive">
                          {serverErrors.layanan || String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>
            </FieldGroup>

            <FieldSeparator />

            <FieldGroup>
              <div className="flex items-center gap-2 max-w-2xl">
                <div>
                  <Checkbox
                    id="pasien-lama"
                    className="cursor-pointer"
                    checked={checked}
                    onCheckedChange={(state: CheckedState) => {
                      if (typeof state === 'boolean') setChecked(state)
                    }}
                  />
                </div>
                <FieldContent>
                  <FieldLabel htmlFor="pasien-lama" className="font-bold">
                    Saya merupakan pasien lama dan ingin menggunakan nomor
                    pasien saya untuk reservasi ini.
                  </FieldLabel>
                </FieldContent>
              </div>
              {checked && (
                <Field name="nomorPasien">
                  {(field) => (
                    <TextField
                      id="nomorPasien"
                      label="Nomor Pasien"
                      placeholder="Masukkan nomor pasien Anda"
                      field={field}
                      serverError={serverErrors.nomorPasien}
                    />
                  )}
                </Field>
              )}
            </FieldGroup>

            <FieldGroup>
              <Field name="keluhan">
                {(field) => {
                  const { errors, isTouched } = field.state.meta

                  return (
                    <div className="space-y-4">
                      <FieldLabel>Keluhan</FieldLabel>
                      <Textarea
                        placeholder="Masukkan keluhan Anda"
                        className="resize-none"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {((errors.length > 0 && isTouched) ||
                        serverErrors.keluhan) && (
                        <FieldDescription className="text-destructive">
                          {serverErrors.keluhan || String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>
            </FieldGroup>
          </FieldSet>

          {submitError && (
            <FieldDescription className="text-destructive">
              {submitError}
            </FieldDescription>
          )}

          <div>
            <Button type="submit" disabled={createReservation.isPending}>
              {createReservation.isPending ? 'Mengirim...' : 'Submit'}
            </Button>
          </div>
        </FieldGroup>
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reservasi Berhasil</DialogTitle>
            <DialogDescription>
              Data reservasi Anda berhasil dikirim dan sedang menunggu
              konfirmasi admin.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-sm text-muted-foreground">Nomor Pasien</p>
            <p className="text-lg font-bold text-primary">{createdPatientId}</p>
          </div>

          <DialogFooter>
            <Button
              onClick={async () => {
                setSuccessOpen(false)
                await navigate({ to: '/reservasi' })
              }}
              className="bg-linear-to-r from-[#01C7FE] to-[#89FBA4]"
            >
              Kembali ke Reservasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LayananMultiSelect({
  value,
  items,
  onChange,
  onBlur,
}: {
  value: string[]
  items: Array<{ id: string; name: string }>
  onChange: (val: string[]) => void
  onBlur: () => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = (item: string) => {
    onChange(
      value.includes(item) ? value.filter((v) => v !== item) : [...value, item],
    )
  }

  const remove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== item))
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
        onBlur()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onBlur])

  return (
    <div ref={containerRef} className="relative">
      <div
        className="min-h-9 w-full flex flex-wrap gap-1 items-center px-3 py-1.5 border border-input rounded-md bg-background cursor-pointer text-sm hover:bg-accent/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {value.length === 0 && (
          <span className="text-muted-foreground">Pilih layanan...</span>
        )}
        {value.map((item, i) => {
          const label =
            items.find((service) => service.id === item)?.name || item
          return (
            <span
              key={item}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${badgeColors[i % badgeColors.length]}`}
            >
              {label}
              <X
                className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100"
                onClick={(e) => remove(item, e)}
              />
            </span>
          )
        })}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-md max-h-52 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              onMouseDown={(e) => {
                e.preventDefault()
                toggle(item.id)
              }}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                value.includes(item.id) ? 'bg-accent/40 font-medium' : ''
              }`}
            >
              {item.name}
              {value.includes(item.id) && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type TextFieldProps = {
  id?: string
  label: string
  placeholder: string
  serverError?: string
  field: {
    state: { value: string; meta: { errors: unknown[]; isTouched: boolean } }
    handleChange: (val: string) => void
    handleBlur: () => void
  }
}

function TextField({
  id,
  label,
  placeholder,
  field,
  serverError,
}: TextFieldProps) {
  const { errors, isTouched } = field.state.meta
  return (
    <div className="space-y-4">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {((errors.length > 0 && isTouched) || serverError) && (
        <FieldDescription className="text-destructive">
          {serverError || String(errors[0])}
        </FieldDescription>
      )}
    </div>
  )
}
