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
import { MultiSelect } from '@/components/ui/multi-select'
import { useState } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronUp } from 'lucide-react'

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
                <MultiSelect
                  items={layanan}
                  value={selectedLayanan}
                  onChange={setSelectedLayanan}
                  placeholder="Pilih layanan..."
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
