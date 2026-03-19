import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
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
import { useState, useRef, useEffect } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
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

export default function FormReservasi() {
  const [checked, setChecked] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const form = useForm({
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
    onSubmit: async ({ value }) => {
      form.reset() // Reset form setelah submit
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
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="grid grid-cols-1">
              <form.Field name="namaLengkap">
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor="namaLengkap">Nama Lengkap</FieldLabel>
                    <Input
                      id="namaLengkap"
                      placeholder="Nama Lengkap"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            <FieldGroup className="grid sm:grid-cols-2">
              {/* ===== Tanggal Lahir ===== */}
              <form.Field name="tanggalLahir">
                {(field) => (
                  <Field>
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
                        form.setFieldValue('umur', age >= 0 ? String(age) : '')
                      }}
                      placeholder="Pilih tanggal lahir"
                    />
                  </Field>
                )}
              </form.Field>

              {/* ===== Umur ===== */}
              <form.Field name="umur">
                {(field) => (
                  <Field>
                    <FieldLabel>Umur</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Masukkan umur Anda"
                    />
                  </Field>
                )}
              </form.Field>

              {/* ===== Nomor Handphone ===== */}
              <form.Field name="nomorHandphone">
                {(field) => (
                  <Field>
                    <FieldLabel>Nomor Handphone</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Masukkan nomor handphone Anda"
                    />
                  </Field>
                )}
              </form.Field>

              {/* ===== Jadwal Periksa ===== */}
              <form.Field name="jadwalPeriksa">
                {(field) => (
                  <Field>
                    <FieldLabel>Jadwal Periksa</FieldLabel>
                    <DatePicker
                      value={field.state.value}
                      onChange={(date: Date) => field.handleChange(date)}
                      placeholder="Pilih jadwal periksa"
                    />
                  </Field>
                )}
              </form.Field>

              {/* ===== Jam Reservasi ===== */}
              <form.Field name="jamReservasi">
                {(field) => (
                  <Field>
                    <FieldLabel>Jam Reservasi</FieldLabel>
                    <Input
                      placeholder="Masukkan jam reservasi Anda"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              {/* ===== Pilihan Dokter ===== */}
              <form.Field name="pilihanDokter">
                {(field) => (
                  <Field>
                    <FieldLabel>Pilihan Dokter</FieldLabel>
                    <DropdownMenu
                      open={dropdownOpen}
                      onOpenChange={setDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
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
                  </Field>
                )}
              </form.Field>

              {/* ===== Layanan ===== */}
              <form.Field name="layanan">
                {(field) => (
                  <Field>
                    <FieldLabel>Layanan</FieldLabel>
                    <LayananMultiSelect
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            <FieldSeparator />

            <FieldGroup>
              <Field orientation="horizontal" className="max-w-2xl">
                <div>
                  <Checkbox
                    id="pasien-lama"
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
                  <FieldDescription>
                    Jika Anda merupakan pasien lama, silakan centang kotak ini
                    dan masukkan nomor pasien Anda pada kolom yang tersedia.
                  </FieldDescription>
                </FieldContent>
              </Field>
              {checked && (
                <form.Field name="nomorPasien">
                  {(field) => (
                    <>
                      <FieldLabel>Nomor Pasien</FieldLabel>
                      <Input
                        placeholder="Masukkan nomor pasien Anda"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </>
                  )}
                </form.Field>
              )}
            </FieldGroup>

            <FieldGroup>
              <form.Field name="keluhan">
                {(field) => (
                  <>
                    <FieldLabel>Keluhan</FieldLabel>
                    <Textarea
                      placeholder="Masukkan keluhan Anda"
                      className="resize-none"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              </form.Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

function LayananMultiSelect({
  value,
  onChange,
}: {
  value: string[]
  onChange: (val: string[]) => void
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
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
