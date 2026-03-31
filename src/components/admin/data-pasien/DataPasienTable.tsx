import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldLegend,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DatePicker } from '@/components/ui/date-picker'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  User,
  Heart,
  Smile,
  Clock,
  FileText,
} from 'lucide-react'
import type { CheckedState } from '@radix-ui/react-checkbox'

const dataPasien = [
  {
    no: 1,
    nomorPasien: 'P001',
    namaPasien: 'Budi Santoso',
    layanan: 'Scaling',
    tanggal: '2026-03-15',
    noTelp: '08123456789',
  },
  {
    no: 2,
    nomorPasien: 'P002',
    namaPasien: 'Siti Nurhaliza',
    layanan: 'Tambal Gigi',
    tanggal: '2026-03-14',
    noTelp: '08234567890',
  },
  {
    no: 3,
    nomorPasien: 'P003',
    namaPasien: 'Ahmad Wijaya',
    layanan: 'Cabut Gigi',
    tanggal: '2026-03-13',
    noTelp: '08345678901',
  },
  {
    no: 4,
    nomorPasien: 'P004',
    namaPasien: 'Rini Kusuma',
    layanan: 'Bleaching',
    tanggal: '2026-03-12',
    noTelp: '08456789012',
  },
  {
    no: 5,
    nomorPasien: 'P005',
    namaPasien: 'Hendra Gunawan',
    layanan: 'Crown',
    tanggal: '2026-03-11',
    noTelp: '08567890123',
  },
  {
    no: 6,
    nomorPasien: 'P006',
    namaPasien: 'Dita Rahmawati',
    layanan: 'Perawatan Saluran Akar',
    tanggal: '2026-03-10',
    noTelp: '08678901234',
  },
  {
    no: 7,
    nomorPasien: 'P007',
    namaPasien: 'Bambang Irawan',
    layanan: 'Veneer',
    tanggal: '2026-03-09',
    noTelp: '08789012345',
  },
  {
    no: 8,
    nomorPasien: 'P008',
    namaPasien: 'Lina Pertiwi',
    layanan: 'Aligner',
    tanggal: '2026-03-08',
    noTelp: '08890123456',
  },
  {
    no: 9,
    nomorPasien: 'P009',
    namaPasien: 'Agus Prasetyo',
    layanan: 'Gigi Tiruan',
    tanggal: '2026-03-07',
    noTelp: '08901234567',
  },
  {
    no: 10,
    nomorPasien: 'P010',
    namaPasien: 'Sari Dewi',
    layanan: 'Desensitasi Gigi',
    tanggal: '2026-03-06',
    noTelp: '08012345678',
  },
  {
    no: 11,
    nomorPasien: 'P011',
    namaPasien: 'Rizky Maulana',
    layanan: 'Perawatan Gigi Anak',
    tanggal: '2026-03-05',
    noTelp: '08123456780',
  },
]

// --- FormulirDialog Component ---
interface FormulirDialogProps {
  pasien: (typeof dataPasien)[0]
}

function FormulirDialog({ pasien }: FormulirDialogProps) {
  const [hasAlergi, setHasAlergi] = useState(false)
  const [hasPenyakitSistemik, setHasPenyakitSistemik] = useState(false)
  const [isKonsumsiObat, setIsKonsumsiObat] = useState(false)
  const [isRawatRumahSakit, setIsRawatRumahSakit] = useState(false)
  const [isSakitGigi, setIsSakitGigi] = useState(false)
  const [isPerawatanGigiSebelumnya, setIsPerawatanGigiSebelumnya] = useState(false)
  const [isKebiasaanBuruk, setIsKebiasaanBuruk] = useState(false)
  const [isKawatGigi, setIsKawatGigi] = useState(false)
  const [isPSA, setIsPSA] = useState(false)
  const [isKebiasaanRokok, setIsKebiasaanRokok] = useState(false)
  const [isBerdarahSikatGigi, setIsBerdarahSikatGigi] = useState(false)
  const [isKebisaanKesehatanMulut, setIsKebisaanKesehatanMulut] = useState(false)
  const [isMemilikiGigiPalsu, setIsMemilikiGigiPalsu] = useState(false)
  const [isRutinKontrol, setIsRutinKontrol] = useState(false)
  const [frekuensiSikatGigi, setFrekuensiSikatGigi] = useState('')
  const [frekuensiCheckup, setFrekuensiCheckup] = useState('')
  const [dropdownJenisKelaminOpen, setDropdownJenisKelaminOpen] = useState(false)
  const [selectedJenisKelamin, setSelectedJenisKelamin] = useState<string | null>(null)
  const [tanggalLahir, setTanggalLahir] = useState<Date | null>(null)
  const [dropdownDokterOpen, setDropdownDokterOpen] = useState(false)
  const [selectedDokter, setSelectedDokter] = useState<string | null>(null)
  const [selectedLayanan, setSelectedLayanan] = useState<string[]>(
    pasien.layanan ? [pasien.layanan] : [],
  )

  const dokterList = [
    'Dr. Smith',
    'Dr. Johnson',
    'Dr. Lee',
    'Dr. Andi',
    'Dr. Budi',
    'Dr. Citra',
  ]

  const layananList = [
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
    'Pembersihan Gigi',
    'Pemeriksaan Gigi',
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="text-xs md:text-sm"
        >
          Lihat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-sm p-8">
        {/* Data Pasien */}
        <FieldGroup className="flex">
          <FieldLegend className="flex gap-2">
            <User className="w-12 h-12 text-primary" />
            <div>
              <FieldTitle className="font-bold text-lg">Data Pasien</FieldTitle>
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
              defaultValue={pasien.namaPasien}
            />
          </Field>
          <Field>
            <FieldLabel>Nama Panggilan</FieldLabel>
            <Input
              placeholder="Masukkan nama panggilan pasien"
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
                  <span className={selectedJenisKelamin ? '' : 'text-muted-foreground'}>
                    {selectedJenisKelamin ?? 'Pilih jenis kelamin'}
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
                  <DropdownMenuItem key={jk} onSelect={() => setSelectedJenisKelamin(jk)}>
                    {jk}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Field>
          <Field>
            <FieldLabel>Nomor Handphone</FieldLabel>
            <Input
              placeholder="Masukkan nomor HP pasien"
              defaultValue={pasien.noTelp}
            />
          </Field>
          <Field>
            <FieldLabel>Umur</FieldLabel>
            <Input placeholder="Masukkan umur pasien" />
          </Field>
          <Field>
            <FieldLabel>Pekerjaan</FieldLabel>
            <Input placeholder="Masukkan pekerjaan pasien" />
          </Field>
          <Field>
            <FieldLabel>Tanggal Lahir</FieldLabel>
            <DatePicker
              value={tanggalLahir}
              onChange={setTanggalLahir}
              placeholder="Pilih tanggal lahir"
            />
          </Field>
          <Field>
            <FieldLabel>Nama Orang Tua</FieldLabel>
            <Input placeholder="Masukkan nama orang tua pasien" />
          </Field>
          <Field>
            <FieldLabel>Kota/Kabupaten</FieldLabel>
            <Input placeholder="Masukkan kota/kabupaten pasien" />
          </Field>
          <Field>
            <FieldLabel>Kecamatan</FieldLabel>
            <Input placeholder="Masukkan kecamatan pasien" />
          </Field>
          <Field>
            <FieldLabel>Kelurahan</FieldLabel>
            <Input placeholder="Masukkan kelurahan pasien" />
          </Field>
          <Field>
            <FieldLabel>Alamat Lengkap</FieldLabel>
            <Input placeholder="Masukkan alamat lengkap pasien" />
          </Field>
          <Field>
            <FieldLabel>Tinggi Badan (cm)</FieldLabel>
            <Input placeholder="Masukkan tinggi badan pasien" />
          </Field>
          <Field>
            <FieldLabel>Berat Badan (kg)</FieldLabel>
            <Input placeholder="Masukkan berat badan pasien" />
          </Field>
        </FieldGroup>

        <FieldSeparator />

        {/* Riwayat Kesehatan Umum */}
        <FieldGroup className="flex">
          <FieldLegend className="flex gap-2">
            <Heart className="w-12 h-12 text-primary" />
            <FieldTitle className="font-bold text-lg">
              Riwayat Kesehatan Umum
            </FieldTitle>
          </FieldLegend>
        </FieldGroup>
        <FieldGroup className="flex">
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>Apakah ada alergi obat atau makanan?</FieldLabel>
              <Checkbox
                checked={hasAlergi}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setHasAlergi(checked)
                }}
              />
            </div>
            {hasAlergi && (
              <Input placeholder="Jika ya, sebutkan alergi tersebut" className="mt-2" />
            )}
          </Field>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>
                Apakah ada riwayat penyakit sistemik? (Misalnya hipertensi, Jantung, Kanker, dll)
              </FieldLabel>
              <Checkbox
                checked={hasPenyakitSistemik}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setHasPenyakitSistemik(checked)
                }}
              />
            </div>
            {hasPenyakitSistemik && (
              <Input
                placeholder="Jika ya, sebutkan penyakit sistemik tersebut"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>
                Apakah Anda sedang konsumsi obat, kemoterapi, atau radiasi?
              </FieldLabel>
              <Checkbox
                checked={isKonsumsiObat}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsKonsumsiObat(checked)
                }}
              />
            </div>
            {isKonsumsiObat && (
              <Input
                placeholder="Jika ya, sebutkan obat, kemoterapi, atau radiasi yang sedang dikonsumsi"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>Apakah Anda pernah dirawat di rumah sakit?</FieldLabel>
              <Checkbox
                checked={isRawatRumahSakit}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsRawatRumahSakit(checked)
                }}
              />
            </div>
            {isRawatRumahSakit && (
              <Input
                placeholder="Jika ya, sebutkan kapan dan untuk penyakit apa Anda dirawat di rumah sakit"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-row items-center justify-between w-full">
            <FieldLabel>Memiliki kebiasaan merokok atau alkohol?</FieldLabel>
            <div className="flex justify-end">
              <Checkbox
                checked={isKebiasaanRokok}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsKebiasaanRokok(checked)
                }}
              />
            </div>
          </Field>
        </FieldGroup>

        <FieldSeparator />

        {/* Riwayat Kesehatan Gigi dan Mulut */}
        <FieldGroup className="flex">
          <FieldLegend className="flex gap-2">
            <Smile className="w-12 h-12 text-primary" />
            <FieldTitle className="font-bold text-lg">
              Riwayat Kesehatan Gigi dan Mulut
            </FieldTitle>
          </FieldLegend>
        </FieldGroup>
        <FieldGroup>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>Apakah Anda sering mengalami sakit gigi?</FieldLabel>
              <Checkbox
                checked={isSakitGigi}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsSakitGigi(checked)
                }}
              />
            </div>
            {isSakitGigi && (
              <Input
                placeholder="Jika ya, sebutkan sejak kapan dan seberapa sering Anda mengalami sakit gigi"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-row items-center justify-between w-full">
            <FieldLabel>
              Apakah Anda pernah mengalami berdarah saat menyikat gigi?
            </FieldLabel>
            <div className="flex justify-end">
              <Checkbox
                checked={isBerdarahSikatGigi}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsBerdarahSikatGigi(checked)
                }}
              />
            </div>
          </Field>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>
                Apakah Anda pernah melakukan perawatan gigi sebelumnya?
              </FieldLabel>
              <Checkbox
                checked={isPerawatanGigiSebelumnya}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsPerawatanGigiSebelumnya(checked)
                }}
              />
            </div>
            {isPerawatanGigiSebelumnya && (
              <Input
                placeholder="Jika ya, sebutkan jenis perawatan gigi yang pernah Anda lakukan sebelumnya"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-row items-center justify-between w-full">
            <FieldLabel>Seberapa sering Anda menyikat gigi dalam sehari?</FieldLabel>
            <Select value={frekuensiSikatGigi} onValueChange={setFrekuensiSikatGigi}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih frekuensi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-kali">1 kali sehari</SelectItem>
                <SelectItem value="2-kali">2 kali sehari</SelectItem>
                <SelectItem value="3-kali">3 kali sehari</SelectItem>
                <SelectItem value="lebih-3">Lebih dari 3 kali</SelectItem>
                <SelectItem value="jarang">Jarang</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field className="flex flex-row items-center justify-between w-full">
            <FieldLabel>
              Apakah Anda menggunakan benang gigi atau mouthwash secara rutin?
            </FieldLabel>
            <div className="flex justify-end">
              <Checkbox
                checked={isKebisaanKesehatanMulut}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsKebisaanKesehatanMulut(checked)
                }}
              />
            </div>
          </Field>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>
                Apakah Anda memiliki kebiasaan buruk (Misal menggertakan gigi)
              </FieldLabel>
              <Checkbox
                checked={isKebiasaanBuruk}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsKebiasaanBuruk(checked)
                }}
              />
            </div>
            {isKebiasaanBuruk && (
              <Input
                placeholder="Jika ya, sebutkan kebiasaan buruk apa yang Anda miliki"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>
                Apakah Anda pernah menggunakan kawat gigi atau behel?
              </FieldLabel>
              <Checkbox
                checked={isKawatGigi}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsKawatGigi(checked)
                }}
              />
            </div>
            {isKawatGigi && (
              <Input
                placeholder="Jika ya, sebutkan kapan dan berapa lama Anda menggunakan kawat gigi atau behel"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <FieldLabel>
                Apakah Anda pernah menjalani perawatan saluran akar (PSA)?
              </FieldLabel>
              <Checkbox
                checked={isPSA}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsPSA(checked)
                }}
              />
            </div>
            {isPSA && (
              <Input
                placeholder="Jika ya, sebutkan kapan dan gigi mana yang pernah menjalani perawatan saluran akar (PSA)"
                className="mt-2"
              />
            )}
          </Field>
          <Field className="flex flex-row items-center justify-between w-full">
            <FieldLabel>Apakah Anda memiliki gigi palsu (lepas atau permanen)?</FieldLabel>
            <div className="flex justify-end">
              <Checkbox
                checked={isMemilikiGigiPalsu}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsMemilikiGigiPalsu(checked)
                }}
              />
            </div>
          </Field>
          <Field className="flex flex-row items-center justify-between w-full">
            <FieldLabel>Apakah Anda rutin kontrol ke dokter gigi setiap 6 bulan?</FieldLabel>
            <div className="flex justify-end">
              <Checkbox
                checked={isRutinKontrol}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') setIsRutinKontrol(checked)
                }}
              />
            </div>
          </Field>
          <Field className="flex flex-row items-center justify-between w-full">
            <FieldLabel>Berapa kali Anda checkup ke dokter gigi?</FieldLabel>
            <Select value={frekuensiCheckup} onValueChange={setFrekuensiCheckup}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih frekuensi checkup" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-tahun">1 kali setahun</SelectItem>
                <SelectItem value="2-tahun">2 kali setahun</SelectItem>
                <SelectItem value="3-tahun">3 kali setahun</SelectItem>
                <SelectItem value="6-bulan">Setiap 6 bulan</SelectItem>
                <SelectItem value="3-bulan">Setiap 3 bulan</SelectItem>
                <SelectItem value="jarang">Jarang</SelectItem>
                <SelectItem value="belum">Belum pernah</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <FieldSeparator />

        {/* Reservasi */}
        <FieldGroup className="flex">
          <FieldLegend className="flex gap-2">
            <Clock className="w-12 h-12 text-primary" />
            <FieldTitle className="font-bold text-lg">Reservasi</FieldTitle>
          </FieldLegend>
        </FieldGroup>
        <FieldGroup className="grid md:grid-cols-2 gap-x-16 gap-y-4">
          <Field>
            <FieldLabel>Nama Lengkap</FieldLabel>
            <Input
              placeholder="Masukkan nama pasien"
              defaultValue={pasien.namaPasien}
            />
          </Field>
          <Field>
            <FieldLabel>Tanggal Lahir</FieldLabel>
            <DatePicker
              value={tanggalLahir}
              onChange={setTanggalLahir}
              placeholder="Pilih tanggal lahir"
            />
          </Field>
          <Field>
            <FieldLabel>Umur</FieldLabel>
            <Input placeholder="Masukkan umur pasien" />
          </Field>
          <Field>
            <FieldLabel>Nomor Handphone</FieldLabel>
            <Input
              placeholder="Masukkan nomor HP pasien"
              defaultValue={pasien.noTelp}
            />
          </Field>
          <Field>
            <FieldLabel>Tanggal Kunjungan</FieldLabel>
            <Input
              placeholder="Masukkan tanggal kunjungan"
              defaultValue={pasien.tanggal}
            />
          </Field>
          <Field>
            <FieldLabel>Pilihan Dokter</FieldLabel>
            <DropdownMenu open={dropdownDokterOpen} onOpenChange={setDropdownDokterOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-primary"
                >
                  <span className={selectedDokter ? '' : 'text-muted-foreground'}>
                    {selectedDokter ?? 'Pilih dokter'}
                  </span>
                  {dropdownDokterOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                {dokterList.map((d) => (
                  <DropdownMenuItem key={d} onSelect={() => setSelectedDokter(d)}>
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
              value={selectedLayanan}
              onChange={setSelectedLayanan}
              placeholder="Pilih layanan..."
            />
          </Field>
        </FieldGroup>

        <FieldSeparator />

        {/* Catatan Dokter */}
        <FieldGroup className="flex">
          <FieldLegend className="flex gap-2">
            <FileText className="w-12 h-12 text-primary" />
            <FieldTitle className="font-bold text-lg">Catatan Dokter</FieldTitle>
          </FieldLegend>
        </FieldGroup>
        <FieldGroup className="grid md:grid-cols-1 gap-4">
          <Field>
            <FieldLabel>Catatan/Rekomendasi Dokter</FieldLabel>
            <Textarea placeholder="Masukkan catatan atau rekomendasi dokter" />
          </Field>
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            type="submit"
            className="bg-[#B9D654] text-white hover:bg-[#A8C24A]"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Component ---
export default function DataPasienTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const navigate = useNavigate()

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return dataPasien
    const query = searchQuery.toLowerCase()
    return dataPasien.filter(
      (pasien) =>
        pasien.nomorPasien.toLowerCase().includes(query) ||
        pasien.namaPasien.toLowerCase().includes(query) ||
        pasien.layanan.toLowerCase().includes(query) ||
        pasien.noTelp.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleNavigate = (id: string) => {
    navigate({
      to: '/admin/data-pasien/rontgen',
      search: { id },
    })
  }

  return (
    <div className="space-y-4 w-full">
      <InputGroup className="w-full md:w-1/2">
        <InputGroupInput
          placeholder="Cari berdasarkan nomor pasien, nama, layanan, atau nomor telp..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <InputGroupAddon>
          <Search size={20} className="text-gray-500" />
        </InputGroupAddon>
      </InputGroup>

      {filteredData.length === 0 ? (
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
                Daftar data pasien Tentang Dental ({filteredData.length} dari{' '}
                {dataPasien.length})
              </TableCaption>
              <TableHeader className="border-primary bg-[#E0F4FB] rounded-xl">
                <TableRow>
                  <TableHead className="w-8 md:w-12 text-xs md:text-sm">No</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Nomor Pasien</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Nama Pasien</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Layanan</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Tanggal Kunjungan</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">No Telp</TableHead>
                  <TableHead className="text-center text-xs md:text-sm">Formulir</TableHead>
                  <TableHead className="text-center text-xs md:text-sm">Rontgen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((pasien) => (
                  <TableRow key={pasien.nomorPasien}>
                    <TableCell className="font-medium text-xs md:text-sm">{pasien.no}</TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{pasien.nomorPasien}</TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{pasien.namaPasien}</TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{pasien.layanan}</TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{pasien.tanggal}</TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{pasien.noTelp}</TableCell>
                    <TableCell className="text-center">
                      {/* Formulir button now opens a Dialog popup */}
                      <FormulirDialog pasien={pasien} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs md:text-sm"
                        onClick={() => handleNavigate(pasien.nomorPasien)}
                      >
                        Lihat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="text-xs md:text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages || 1}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-8 h-8 md:w-10 md:h-10 p-0 text-xs md:text-sm"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}