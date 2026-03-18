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
  FieldError,
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
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservasiSchema, type ReservasiForm } from '@/types/reservasi'

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

  const form = useForm<ReservasiForm>({
    resolver: zodResolver(reservasiSchema),
    defaultValues: {
      namaLengkap: '',
      nomorHandphone: '',
      tanggalLahir: undefined,
      umur: '',
      jadwalPeriksa: undefined,
      jamReservasi: '',
      pilihanDokter: '',
      layanan: [],
      nomorPasien: '',
      keluhan: '',
    },
  })

  async function onSubmit(data: ReservasiForm) {
    console.log('Submitting reservasi:', data)
  }

  return (
    <div className="w-full mt-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="grid grid-cols-1">
              <Field data-invalid={!!form.formState.errors.namaLengkap}>
                <FieldLabel htmlFor="namaLengkap">Nama Lengkap</FieldLabel>
                <Input
                  id="namaLengkap"
                  placeholder="Nama Lengkap"
                  aria-invalid={!!form.formState.errors.namaLengkap}
                  {...form.register('namaLengkap')}
                />
                {form.formState.errors.namaLengkap && (
                  <FieldError>
                    {form.formState.errors.namaLengkap.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup className="grid sm:grid-cols-2">
              {/* ✅ Fix #5: DatePicker dihubungkan ke field.onChange */}
              <Controller
                name="tanggalLahir"
                control={form.control}
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.tanggalLahir}>
                    <FieldLabel>Tanggal Lahir</FieldLabel>
                    <DatePicker
                      value={field.value}
                      onChange={(date: Date) => {
                        field.onChange(date)
                        // Auto-hitung umur
                        const today = new Date()
                        let age = today.getFullYear() - date.getFullYear()
                        const m = today.getMonth() - date.getMonth()
                        if (
                          m < 0 ||
                          (m === 0 && today.getDate() < date.getDate())
                        )
                          age--
                        form.setValue('umur', age >= 0 ? String(age) : '')
                      }}
                      placeholder="Pilih tanggal lahir"
                    />
                    {form.formState.errors.tanggalLahir && (
                      <FieldError>
                        {form.formState.errors.tanggalLahir.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* ✅ Fix #4: umur pakai register, auto-terisi dari tanggal lahir */}
              <Field>
                <FieldLabel>Umur</FieldLabel>
                <Input
                  placeholder="Masukkan umur Anda"
                  {...form.register('umur')}
                />
              </Field>

              {/* ✅ Fix #2: hapus duplikat, pakai register */}
              <Field data-invalid={!!form.formState.errors.nomorHandphone}>
                <FieldLabel>Nomor Handphone</FieldLabel>
                <Input
                  placeholder="Masukkan nomor handphone Anda"
                  aria-invalid={!!form.formState.errors.nomorHandphone}
                  {...form.register('nomorHandphone')}
                />
                {form.formState.errors.nomorHandphone && (
                  <FieldError>
                    {form.formState.errors.nomorHandphone.message}
                  </FieldError>
                )}
              </Field>

              {/* ✅ Fix #5: DatePicker dihubungkan ke field.onChange */}
              <Controller
                name="jadwalPeriksa"
                control={form.control}
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.jadwalPeriksa}>
                    <FieldLabel>Jadwal Periksa</FieldLabel>
                    <DatePicker
                      value={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      placeholder="Pilih jadwal periksa"
                    />
                    {form.formState.errors.jadwalPeriksa && (
                      <FieldError>
                        {form.formState.errors.jadwalPeriksa.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Field data-invalid={!!form.formState.errors.jamReservasi}>
                <FieldLabel>Jam Reservasi</FieldLabel>
                <Input
                  placeholder="Masukkan jam reservasi Anda"
                  aria-invalid={!!form.formState.errors.jamReservasi}
                  {...form.register('jamReservasi')}
                />
                {form.formState.errors.jamReservasi && (
                  <FieldError>
                    {form.formState.errors.jamReservasi.message}
                  </FieldError>
                )}
              </Field>

              {/* ✅ Fix #5: DropdownMenu dihubungkan ke field.onChange */}
              <Controller
                name="pilihanDokter"
                control={form.control}
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.pilihanDokter}>
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
                              field.value ? '' : 'text-muted-foreground'
                            }
                          >
                            {field.value || 'Pilih dokter'}
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
                            onSelect={() => field.onChange(d)}
                          >
                            {d}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {form.formState.errors.pilihanDokter && (
                      <FieldError>
                        {form.formState.errors.pilihanDokter.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* ✅ Fix #5: LayananMultiSelect dihubungkan ke field.onChange */}
              <Controller
                name="layanan"
                control={form.control}
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.layanan}>
                    <FieldLabel>Layanan</FieldLabel>
                    <LayananMultiSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {form.formState.errors.layanan && (
                      <FieldError>
                        {form.formState.errors.layanan.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />
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
                <Field>
                  <FieldLabel>Nomor Pasien</FieldLabel>
                  <Input
                    placeholder="Masukkan nomor pasien Anda"
                    {...form.register('nomorPasien')}
                  />
                </Field>
              )}
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Keluhan</FieldLabel>
                <Textarea
                  placeholder="Masukkan keluhan Anda"
                  className="resize-none"
                  {...form.register('keluhan')}
                />
              </Field>
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
