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

// Warna badge per index agar variatif seperti di gambar
const badgeColors = [
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-teal-100 text-teal-700 border-teal-200',
]

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
      {/* Trigger box */}
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

      {/* Dropdown options */}
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

export default function FormReservasi() {
  const [checked, setChecked] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedDokter, setSelectedDokter] = useState<string | null>(null)
  const [selectedLayanan, setSelectedLayanan] = useState<string[]>([])
  const [tanggalLahir, setTanggalLahir] = useState<Date | null>(null)
  const [jadwalPeriksa, setJadwalPeriksa] = useState<Date | null>(null)
  const [umur, setUmur] = useState('')

  const handleTanggalLahir = (date: Date) => {
    setTanggalLahir(date)
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const m = today.getMonth() - date.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--
    setUmur(age >= 0 ? String(age) : '')
  }

  return (
    <div className="w-full mt-6">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="grid grid-cols-1">
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Nama Lengkap
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Nama Lengkap"
                  required
                />
              </Field>
            </FieldGroup>
            <FieldGroup className="grid sm:grid-cols-2">
              <Field>
                <FieldLabel>Tanggal Lahir</FieldLabel>
                <DatePicker
                  value={tanggalLahir}
                  onChange={handleTanggalLahir}
                  placeholder="Pilih tanggal lahir"
                />
              </Field>
              <Field>
                <FieldLabel>Umur</FieldLabel>
                <Input
                  value={umur}
                  onChange={(e) => setUmur(e.target.value)}
                  placeholder="Masukkan umur Anda"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Nomor Handphone</FieldLabel>
                <Input placeholder="Masukkan nomor handphone Anda" required />
              </Field>
              <Field>
                <FieldLabel>Jadwal Periksa</FieldLabel>
                <DatePicker
                  value={jadwalPeriksa}
                  onChange={setJadwalPeriksa}
                  placeholder="Pilih jadwal periksa"
                />
              </Field>
              <Field>
                <FieldLabel>Jam Reservasi</FieldLabel>
                <Input placeholder="Masukkan jam reservasi Anda" required />
              </Field>
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
                          selectedDokter ? '' : 'text-muted-foreground'
                        }
                      >
                        {selectedDokter ?? 'Pilih dokter'}
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
                        onSelect={() => setSelectedDokter(d)}
                      >
                        {d}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>
              <Field>
                <FieldLabel>Layanan</FieldLabel>
                <LayananMultiSelect
                  value={selectedLayanan}
                  onChange={setSelectedLayanan}
                />
              </Field>
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
                  <Input placeholder="Masukkan nomor pasien Anda" />
                </Field>
              )}
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Keluhan</FieldLabel>
                <Textarea
                  placeholder="Masukkan keluhan Anda"
                  className="resize-none"
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
