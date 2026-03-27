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

const dokter = ['Dr. Andi', 'Dr. Budi', 'Dr. Citra']

const layanan = [
  'Scaling',
  'Oral Profilaksis',
  'Tambal Gigi',
  'Desensitasi Gigi',
  'Perawatan Saluran Akar',
  'Cabut Gigi',
  'Perawatan Gigi Anak',
  'Bleaching',
  'Veneer',
  'Aligner Gigi',
  'Crown',
  'Gigi Tiruan',
]

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
  tanggalLahir: z
    .date({ required_error: 'Tanggal lahir harus diisi' })
    .nullable()
    .refine((val) => val !== null, { message: 'Tanggal lahir harus diisi' }),
  umur: z.string().min(1, 'Umur harus diisi'),
  jadwalPeriksa: z
    .date({ required_error: 'Jadwal periksa harus diisi' })
    .nullable()
    .refine((val) => val !== null, { message: 'Jadwal periksa harus diisi' }),
  jamReservasi: z.string().min(1, 'Jam reservasi harus diisi'),
  pilihanDokter: z.string().min(1, 'Pilihan dokter harus diisi'),
  layanan: z.array(z.string()).min(1, 'Layanan harus dipilih'),
  nomorPasien: z.string().optional(),
  keluhan: z.string().min(1, 'Keluhan harus diisi'),
})

export default function FormReservasi() {
  const [checked, setChecked] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
    // Validasi menggunakan Zod, jika submit dan ada error, akan mengembalikan object dengan field yang error beserta pesan errornya
    validators: {
      onSubmit: ({ value }) => {
        const result = formSchema.safeParse(value)
        if (!result.success) {
          return {
            fields: Object.fromEntries(
              Object.entries(result.error.flatten().fieldErrors).map(
                ([key, val]) => [key, val?.[0]], // ambil error pertama per field
              ),
            ),
          }
        }
        return undefined
      },
      // Validasi real-time saat field berubah, bisa diaktifkan jika ingin langsung validasi saat user input, tapi bisa jadi mengganggu UX kalau terlalu sensitif
      onBlur: ({ value }) => {
        const result = formSchema.safeParse(value)
        if (!result.success) {
          return {
            fields: Object.fromEntries(
              Object.entries(result.error.flatten().fieldErrors).map(
                ([key, val]) => [key, val?.[0]], // ambil error pertama per field
              ),
            ),
          }
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      reset()
      console.log('Submitting reservasi:', value)
    },
  })

  return (
    <div className="w-full mt-6">
      <form
        onSubmit={(e) => {
          // Pastikan onSubmit dari react-hook-form terpanggil dengan benar
          e.preventDefault()
          // Otomatis punya handleSubmit()
          handleSubmit()
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
                  />
                )}
              </Field>
            </FieldGroup>

            <FieldGroup className="grid sm:grid-cols-2">
              {/* ===== Tanggal Lahir ===== */}
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
                      {errors.length > 0 && isTouched && (
                        <FieldDescription className="text-destructive">
                          {String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>

              {/* ===== Umur ===== */}
              <Field name="umur">
                {(field) => (
                  <TextField
                    id="umur"
                    label="Umur"
                    placeholder="Masukkan umur Anda"
                    field={field}
                  />
                )}
              </Field>

              {/* ===== Nomor Handphone ===== */}
              <Field name="nomorHandphone">
                {(field) => (
                  <TextField
                    id="nomorHandphone"
                    label="Nomor Handphone"
                    placeholder="Masukkan nomor handphone Anda"
                    field={field}
                  />
                )}
              </Field>

              {/* ===== Jadwal Periksa ===== */}
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
                      {errors.length > 0 && isTouched && (
                        <FieldDescription className="text-destructive">
                          {String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>

              {/* ===== Jam Reservasi ===== */}
              <Field name="jamReservasi">
                {(field) => (
                  <TextField
                    id="jamReservasi"
                    label="Jam Reservasi"
                    placeholder="Masukkan jam reservasi (misal: 14:30)"
                    field={field}
                  />
                )}
              </Field>

              {/* ===== Pilihan Dokter ===== */}
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
                          {dokter.map((d) => (
                            <DropdownMenuItem
                              key={d}
                              onSelect={() => field.handleChange(d)}
                            >
                              {d}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {errors.length > 0 && isTouched && (
                        <FieldDescription className="text-destructive">
                          {String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>

              {/* ===== Layanan ===== */}
              <Field name="layanan">
                {(field) => {
                  const { errors, isTouched } = field.state.meta

                  return (
                    <div className="space-y-4">
                      <FieldLabel>Layanan</FieldLabel>
                      <LayananMultiSelect
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val)}
                        onBlur={field.handleBlur}
                      />
                      {errors.length > 0 && isTouched && (
                        <FieldDescription className="text-destructive">
                          {String(errors[0])}
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
                      {errors.length > 0 && isTouched && (
                        <FieldDescription className="text-destructive">
                          {String(errors[0])}
                        </FieldDescription>
                      )}
                    </div>
                  )
                }}
              </Field>
            </FieldGroup>
          </FieldSet>

          <div>
            <Button type="submit">Submit</Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

function LayananMultiSelect({
  value,
  onChange,
  onBlur,
}: {
  value: string[]
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
        {value.map((item, i) => (
          <span
            key={item}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${badgeColors[i % badgeColors.length]}`}
          >
            {item}
            <X
              className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100"
              onClick={(e) => remove(item, e)}
            />
          </span>
        ))}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-md max-h-52 overflow-y-auto">
          {layanan.map((item) => (
            <div
              key={item}
              onMouseDown={(e) => {
                e.preventDefault()
                toggle(item)
              }}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                value.includes(item) ? 'bg-accent/40 font-medium' : ''
              }`}
            >
              {item}
              {value.includes(item) && (
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
  field: {
    state: { value: string; meta: { errors: unknown[]; isTouched: boolean } }
    handleChange: (val: string) => void
    handleBlur: () => void
  }
}

function TextField({ id, label, placeholder, field }: TextFieldProps) {
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
      {errors.length > 0 && isTouched && (
        <FieldDescription className="text-destructive">
          {String(errors[0])}
        </FieldDescription>
      )}
    </div>
  )
}
