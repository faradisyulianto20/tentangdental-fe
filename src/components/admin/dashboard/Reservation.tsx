import { Button } from '@/components/ui/button'
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
import { useNavigate } from '@tanstack/react-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
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
import { useState } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DatePicker } from '@/components/ui/date-picker'
import { MultiSelect } from '@/components/ui/multi-select'
import { useReservasi } from '@/hooks/useReservasi'
import type { ReservasiApiItem } from '@/services/reservasiService'

interface Reservation {
  namaPasien: string
  namaPanggilan: string
  layanan: string
  tanggalReservasi: string
  nomorHandphone: string
  jamReservasi: string
  dokter: string
  status: string
  nomorPasien: string
  jenisKelamin: string
  umur: string
  pekerjaan: string
  tanggalLahir: string
  namaOrangTua: string
  kotaKabupaten: string
  kecamatan: string
  kelurahan: string
  alamatLengkap: string
  tinggiBadan: string
  beratBadan: string
  keluhan: string
}

const reservations: Reservation[] = [
  {
    namaPasien: 'John Doe',
    namaPanggilan: 'John',
    layanan: 'Pembersihan Gigi',
    tanggalReservasi: 'Sabtu, 15 Maret 2024',
    nomorHandphone: '081234567890',
    jamReservasi: '10:00 AM',
    dokter: 'Dr. Smith',
    status: 'reservasi',
    nomorPasien: 'P001',
    jenisKelamin: 'Laki-laki',
    umur: '28',
    pekerjaan: 'Software Engineer',
    tanggalLahir: '1996-03-15',
    namaOrangTua: 'Robert Doe',
    kotaKabupaten: 'Sleman',
    kecamatan: 'Depok',
    kelurahan: 'Caturtunggal',
    alamatLengkap: 'Jl. Kaliurang No. 10',
    tinggiBadan: '175',
    beratBadan: '70',
    keluhan: 'Gigi berlubang dan sering sakit saat makan manis.',
  },
  {
    namaPasien: 'Jane Smith',
    namaPanggilan: 'Jane',
    layanan: 'Pemeriksaan Gigi',
    tanggalReservasi: 'Minggu, 16 Maret 2024',
    nomorHandphone: '081234567891',
    jamReservasi: '11:00 AM',
    dokter: 'Dr. Johnson',
    status: 'hadir',
    nomorPasien: 'P002',
    jenisKelamin: 'Perempuan',
    umur: '32',
    pekerjaan: 'Dokter',
    tanggalLahir: '1992-06-20',
    namaOrangTua: 'Michael Smith',
    kotaKabupaten: 'Yogyakarta',
    kecamatan: 'Gondokusuman',
    kelurahan: 'Demangan',
    alamatLengkap: 'Jl. Suroto No. 5',
    tinggiBadan: '162',
    beratBadan: '55',
    keluhan: 'Gusi berdarah saat menyikat gigi dan bau mulut.',
  },
  {
    namaPasien: 'Alice Johnson',
    namaPanggilan: 'Alice',
    layanan: 'Tambal Gigi',
    tanggalReservasi: 'Senin, 17 Maret 2024',
    nomorHandphone: '081234567892',
    jamReservasi: '09:00 AM',
    dokter: 'Dr. Lee',
    status: 'selesai',
    nomorPasien: 'P003',
    jenisKelamin: 'Perempuan',
    umur: '25',
    pekerjaan: 'Mahasiswa',
    tanggalLahir: '1999-11-03',
    namaOrangTua: 'David Johnson',
    kotaKabupaten: 'Bantul',
    kecamatan:KasihanTirtonirmolo    kelurahan: '',
    alamatLengkap: 'Jl. Bantul No. 22',
    tinggiBadan: '158',
    beratBadan: '50',
    keluhan: 'Gigi berlubang di bagian belakang dan terasa ngilu.',
  },
]

export function ReservationCard({ res }: { res: ReservasiApiItem }) {
  const [hasAlergi, setHasAlergi] = useState(false)
  const [hasPenyakitSistemik, setHasPenyakitSistemik] = useState(false)
  const [isKonsumsiObat, setIsKonsumsiObat] = useState(false)
  const [isRawatRumahSakit, setIsRawatRumahSakit] = useState(false)
  const [isSakitGigi, setIsSakitGigi] = useState(false)
  const [isPerawatanGigiSebelumnya, setIsPerawatanGigiSebelumnya] =
    useState(false)
  const [isKebiasaanBuruk, setIsKebiasaanBuruk] = useState(false)
  const [isKawatGigi, setIsKawatGigi] = useState(false)
  const [isPSA, setIsPSA] = useState(false)
  const [isKebiasaanRokok, setIsKebiasaanRokok] = useState(false)
  const [isBerdarahSikatGigi, setIsBerdarahSikatGigi] = useState(false)
  const [isKebisaanKesehatanMulut, setIsKebisaanKesehatanMulut] =
    useState(false)
  const [isMemilikiGigiPalsu, setIsMemilikiGigiPalsu] = useState(false)
  const [isRutinKontrol, setIsRutinKontrol] = useState(false)
  const [frekuensiSikatGigi, setFrekuensiSikatGigi] = useState('')
  const [frekuensiCheckup, setFrekuensiCheckup] = useState('')
  const [dropdownJenisKelaminOpen, setDropdownJenisKelaminOpen] =
    useState(false)
  const [selectedJenisKelamin, setSelectedJenisKelamin] = useState<
    string | null
  >(null)
  const [tanggalLahir, setTanggalLahir] = useState<Date | null>(
    res.tanggalLahir ? new Date(res.tanggalLahir) : null,
  )
  const [dropdownDokterOpen, setDropdownDokterOpen] = useState(false)
  const [selectedDokter, setSelectedDokter] = useState<string | null>(
    res.dokter ?? null,
  )
  const [selectedLayanan, setSelectedLayanan] = useState<string[]>(
    res.layanan ? [res.layanan] : [],
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
    <div className="rounded-lg p-4 mb-4 bg-[#E0F4FB]">
      <div className="flex flex-col-reverse lg:flex-row justify-between">
        <div>
          <h2 className="text-lg font-bold">{res?.patient?.name}</h2>
          <p className="text-sm text-muted-foreground">{res.services?.[0]?.name}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <Button
            variant={'default'}
            className=" text-white bg-[#A8C24A] mt-2 rounded-2xl text-sm"
            disabled
          >
            {res.status === 'reservasi'
              ? 'Menunggu'
              : res.status === 'hadir'
                ? 'Hadir'
                : 'Selesai'}
          </Button>
          {res.status === 'hadir' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={'default'}
                  className="bg-[#B9D654] text-white hover:bg-[#A8C24A] mt-2 text-sm rounded-2xl"
                >
                  Konfirmasi Pemeriksaan
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Pemeriksaan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Pasien{' '}
                    <span className="font-bold">{res.namaPasien}</span> sudah
                    melakukan pemeriksaan?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction>Benar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {res.status === 'reservasi' && (
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button
                    variant={'default'}
                    className="bg-[#B9D654] text-white hover:bg-[#A8C24A] mt-2 text-sm rounded-2xl"
                  >
                    Lihat Detail
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-sm p-8">
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      <User className="w-12 h-12  text-primary" />
                      <div>
                        <FieldTitle className="font-bold text-lg">
                          Data Pasien
                        </FieldTitle>
                        <FieldDescription>
                          Nomor Pasien:
                          <span className="font-medium">{res.nomorPasien}</span>
                        </FieldDescription>
                      </div>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldGroup className="grid md:grid-cols-2 gap-x-16 gap-y-4">
                    <Field>
                      <FieldLabel>Nama Pasien</FieldLabel>
                      <Input
                        id="name-1"
                        name="name"
                        placeholder="Masukkan nama pasien"
                        defaultValue={res.namaPasien}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nama Panggilan</FieldLabel>
                      <Input
                        id="namapanggilan-1"
                        name="namapanggilan"
                        className="text-muted-foreground"
                        placeholder="Masukkan nama panggilan pasien"
                        defaultValue={res.namaPanggilan}
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
                                selectedJenisKelamin
                                  ? ''
                                  : 'text-muted-foreground'
                              }
                            >
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
                            <DropdownMenuItem
                              key={jk}
                              onSelect={() => setSelectedJenisKelamin(jk)}
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
                        id="nomorhandphone-1"
                        name="nomorhandphone"
                        placeholder="Masukkan nomor HP pasien"
                        defaultValue={res.nomorHandphone}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Umur</FieldLabel>
                      <Input
                        id="umur-1"
                        name="umur"
                        placeholder="Masukkan Umur Pasien"
                        defaultValue={res.umur || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Pekerjaan</FieldLabel>
                      <Input
                        id="pekerjaan-1"
                        name="pekerjaan"
                        placeholder="Masukkan Pekerjaan Pasien"
                        defaultValue={res.pekerjaan || ''}
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
                      <FieldLabel>Nama Orang Tua</FieldLabel>
                      <Input
                        id="namaorangtua-1"
                        name="namaorangtua"
                        placeholder="Masukkan nama orang tua pasien"
                        defaultValue={res.namaOrangTua || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kota/Kabupaten</FieldLabel>
                      <Input
                        id="kotakabupaten-1"
                        name="kotakabupaten"
                        placeholder="Masukkan Kota/Kabupaten pasien"
                        defaultValue={res.kotaKabupaten || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kecamatan</FieldLabel>
                      <Input
                        id="kecamatan-1"
                        name="kecamatan"
                        placeholder="Masukkan Kecamatan pasien"
                        defaultValue={res.kecamatan || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kelurahan</FieldLabel>
                      <Input
                        id="kelurahan-1"
                        name="kelurahan"
                        placeholder="Masukkan Kelurahan pasien"
                        defaultValue={res.kelurahan || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Alamat Lengkap</FieldLabel>
                      <Input
                        id="alamatlengkap-1"
                        name="alamatlengkap"
                        placeholder="Masukkan alamat lengkap pasien"
                        defaultValue={res.alamatLengkap || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Tinggi Badan (cm)</FieldLabel>
                      <Input
                        id="tinggibadan-1"
                        name="tinggibadan"
                        placeholder="Masukkan tinggi badan pasien"
                        defaultValue={res.tinggiBadan || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Berat Badan (kg)</FieldLabel>
                      <Input
                        id="beratbadan-1"
                        name="beratbadan"
                        placeholder="Masukkan berat badan pasien"
                        defaultValue={res.beratBadan || ''}
                      />
                    </Field>
                  </FieldGroup>

                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      <Heart className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Riwayat Kesehatan Umum
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldGroup className="flex">
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah ada alergi obat atau makanan?
                        </FieldLabel>
                        <Checkbox
                          id="alergi-1"
                          checked={hasAlergi}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setHasAlergi(checked)
                          }}
                        />
                      </div>
                      {hasAlergi && (
                        <Input
                          id="alergi-detail-1"
                          name="alergiDetail"
                          placeholder="Jika ya, sebutkan alergi tersebut"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah ada riwayat penyakit sistemik? (Misalnya
                          hipertensi, Jantung, Kanker, dll)
                        </FieldLabel>
                        <Checkbox
                          id="penyakit-sistemik-1"
                          checked={hasPenyakitSistemik}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setHasPenyakitSistemik(checked)
                          }}
                        />
                      </div>
                      {hasPenyakitSistemik && (
                        <Input
                          id="penyakit-sistemik-detail-1"
                          name="penyakitSistemikDetail"
                          placeholder="Jika ya, sebutkan penyakit sistemik tersebut"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah Anda sedang konsumsi obat, kemoterapi, atau
                          radiasi?
                        </FieldLabel>
                        <Checkbox
                          id="konsumsi-obat-1"
                          checked={isKonsumsiObat}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsKonsumsiObat(checked)
                          }}
                        />
                      </div>
                      {isKonsumsiObat && (
                        <Input
                          id="konsumsi-obat-detail-1"
                          name="konsumsiObatDetail"
                          placeholder="Jika ya, sebutkan obat, kemoterapi, atau radiasi yang sedang dikonsumsi"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah Anda pernah dirawat di rumah sakit?
                        </FieldLabel>
                        <Checkbox
                          id="rawat-rumah-sakit-1"
                          checked={isRawatRumahSakit}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsRawatRumahSakit(checked)
                          }}
                        />
                      </div>
                      {isRawatRumahSakit && (
                        <Input
                          id="rawat-rumah-sakit-detail-1"
                          name="rawatRumahSakitDetail"
                          placeholder="Jika ya, sebutkan kapan dan untuk penyakit apa Anda dirawat di rumah sakit"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Memiliki kebiasaan merokok atau alkohol?
                      </FieldLabel>
                      <div className="flex justify-end">
                        <Checkbox
                          id="kebiasaan-1"
                          checked={isKebiasaanRokok}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsKebiasaanRokok(checked)
                          }}
                        />
                      </div>
                    </Field>
                  </FieldGroup>
                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <Smile className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Riwayat Kesehatan Gigi dan Mulut
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldGroup>
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah Anda sering mengalami sakit gigi?
                        </FieldLabel>
                        <Checkbox
                          id="sakit-gigi-1"
                          checked={isSakitGigi}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsSakitGigi(checked)
                          }}
                        />
                      </div>
                      {isSakitGigi && (
                        <Input
                          id="sakit-gigi-detail-1"
                          name="sakitGigiDetail"
                          placeholder="Jika ya, sebutkan sejak kapan dan seberapa sering Anda mengalami sakit gigi"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Apakah Anda pernah mengalami berdarah saat menyikat
                        gigi?
                      </FieldLabel>
                      <div className="flex justify-end">
                        <Checkbox
                          id="berdarah-saat-sikat-gigi-1"
                          checked={isBerdarahSikatGigi}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsBerdarahSikatGigi(checked)
                          }}
                        />
                      </div>
                    </Field>
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah Anda pernah melakukan perawatan gigi
                          sebelumnya?
                        </FieldLabel>
                        <Checkbox
                          id="perawatan-gigi-sebelumnya-1"
                          checked={isPerawatanGigiSebelumnya}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsPerawatanGigiSebelumnya(checked)
                          }}
                        />
                      </div>
                      {isPerawatanGigiSebelumnya && (
                        <Input
                          id="perawatan-gigi-sebelumnya-detail-1"
                          name="perawatanGigiSebelumnyaDetail"
                          placeholder="Jika ya, sebutkan jenis perawatan gigi yang pernah Anda lakukan sebelumnya"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Seberapa sering Anda menyikat gigi dalam sehari?
                      </FieldLabel>
                      <Select
                        value={frekuensiSikatGigi}
                        onValueChange={setFrekuensiSikatGigi}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-kali">1 kali sehari</SelectItem>
                          <SelectItem value="2-kali">2 kali sehari</SelectItem>
                          <SelectItem value="3-kali">3 kali sehari</SelectItem>
                          <SelectItem value="lebih-3">
                            Lebih dari 3 kali
                          </SelectItem>
                          <SelectItem value="jarang">Jarang</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Apakah Anda menggunakan benang gigi atau moouthwash
                        secara rutin?
                      </FieldLabel>
                      <div className="flex justify-end">
                        <Checkbox
                          id="kebiasaan-kesehatan-mulut-1"
                          checked={isKebisaanKesehatanMulut}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsKebisaanKesehatanMulut(checked)
                          }}
                        />
                      </div>
                    </Field>
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah Anda memiliki kebiasaan buruk (Misal
                          menggertakan gigi)
                        </FieldLabel>
                        <Checkbox
                          id="kebiasaan-buruk-1"
                          checked={isKebiasaanBuruk}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsKebiasaanBuruk(checked)
                          }}
                        />
                      </div>
                      {isKebiasaanBuruk && (
                        <Input
                          id="kebiasaan-buruk-detail-1"
                          name="kebiasaanBurukDetail"
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
                          id="kawat-gigi-1"
                          checked={isKawatGigi}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsKawatGigi(checked)
                          }}
                        />
                      </div>
                      {isKawatGigi && (
                        <Input
                          id="kawat-gigi-detail-1"
                          name="kawatGigiDetail"
                          placeholder="Jika ya, sebutkan kapan dan berapa lama Anda menggunakan kawat gigi atau behel"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-col w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FieldLabel>
                          Apakah Anda pernah menjalani perawatan saluran akar
                          (PSA)?
                        </FieldLabel>
                        <Checkbox
                          id="psa-1"
                          checked={isPSA}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean') setIsPSA(checked)
                          }}
                        />
                      </div>
                      {isPSA && (
                        <Input
                          id="psa-detail-1"
                          name="psaDetail"
                          placeholder="Jika ya, sebutkan kapan dan gigi mana yang pernah menjalani perawatan saluran akar (PSA)"
                          className="mt-2"
                        />
                      )}
                    </Field>
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Apakah Anda memiliki gigi palsu (lepas atau permanen)?
                      </FieldLabel>
                      <div className="flex justify-end">
                        <Checkbox
                          id="gigi-palsu-1"
                          checked={isMemilikiGigiPalsu}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsMemilikiGigiPalsu(checked)
                          }}
                        />
                      </div>
                    </Field>
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Apakah Anda rutin kontrol ke dokter gigi setiap 6 bulan?
                      </FieldLabel>
                      <div className="flex justify-end">
                        <Checkbox
                          id="kontrol-1"
                          checked={isRutinKontrol}
                          onCheckedChange={(checked: CheckedState) => {
                            if (typeof checked === 'boolean')
                              setIsRutinKontrol(checked)
                          }}
                        />
                      </div>
                    </Field>
                    <Field className="flex flex-row items-center justify-between w-full">
                      <FieldLabel>
                        Berapa kali Anda checkup ke dokter gigi?
                      </FieldLabel>
                      <Select
                        value={frekuensiCheckup}
                        onValueChange={setFrekuensiCheckup}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih frekuensi checkup" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-tahun">
                            1 kali setahun
                          </SelectItem>
                          <SelectItem value="2-tahun">
                            2 kali setahun
                          </SelectItem>
                          <SelectItem value="3-tahun">
                            3 kali setahun
                          </SelectItem>
                          <SelectItem value="6-bulan">
                            Setiap 6 bulan
                          </SelectItem>
                          <SelectItem value="3-bulan">
                            Setiap 3 bulan
                          </SelectItem>
                          <SelectItem value="jarang">Jarang</SelectItem>
                          <SelectItem value="belum">Belum pernah</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <Clock className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Reservasi
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldGroup className="grid md:grid-cols-2 gap-x-16 gap-y-4">
                    <Field>
                      <FieldLabel>Nama Lengkap</FieldLabel>
                      <Input
                        id="nama-lengkap-1"
                        name="namaLengkap"
                        placeholder="Masukkan nama pasien"
                        defaultValue={res.namaPasien}
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
                      <Input
                        id="umur-1"
                        name="umur"
                        placeholder="Masukkan umur pasien"
                        defaultValue={res.umur || ''}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nomor Handphone</FieldLabel>
                      <Input
                        id="nomor-handphone-1"
                        name="nomorHandphone"
                        placeholder="Masukkan nomor HP pasien"
                        defaultValue={res.nomorHandphone}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Jadwal Periksa</FieldLabel>
                      <Input
                        id="jadwal-periksa-1"
                        name="jadwalPeriksa"
                        placeholder="Masukkan jadwal periksa pasien"
                        defaultValue={`${res.tanggalReservasi} ${res.jamReservasi}`}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Jam Reservasi</FieldLabel>
                      <Input
                        id="jam-reservasi-1"
                        name="jamReservasi"
                        placeholder="Masukkan jam reservasi"
                        defaultValue={res.jamReservasi}
                      />
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
                                selectedDokter ? '' : 'text-muted-foreground'
                              }
                            >
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
                        items={layananList}
                        value={selectedLayanan}
                        onChange={setSelectedLayanan}
                        placeholder="Pilih layanan..."
                      />
                    </Field>
                  </FieldGroup>
                  <Field>
                    <FieldLabel>Keluhan</FieldLabel>
                    <Textarea
                      id="keluhan-1"
                      name="keluhan"
                      placeholder="Masukkan keluhan pasien"
                      defaultValue={res.keluhan}
                    />
                  </Field>
                  <FieldSeparator />
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <FileText className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Catatan Dokter
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldGroup className="grid md:grid-cols-1 gap-4">
                    <Field>
                      <FieldLabel>Catatan/Rekomendasi Dokter</FieldLabel>
                      <Textarea
                        id="catatan-dokter-1"
                        name="catatanDokter"
                        placeholder="Masukkan catatan atau rekomendasi dokter"
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button className="bg-red-400 hover:bg-red-500">
                      Batalkan Reservasi
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#B9D654] text-white hover:bg-[#A8C24A]"
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 text-sm gap-2 font-bold mt-1">
        <p className="flex gap-2 items-center">
          <Calendar className="w-4 h-4" />
          {res.tanggalReservasi}
        </p>
        <p className="flex gap-2 items-center">
          <Phone className="w-4 h-4" />
          {res.nomorHandphone}
        </p>
        <p className="flex gap-2 items-center">
          <Clock className="w-4 h-4" />
          {res.jamReservasi}
        </p>
        <p className="flex gap-2 items-center">
          <User className="w-4 h-4" />
          {res.dokter}
        </p>
      </div>
    </div>
  )
}

export default function Reservation() {
  const { data: reservasiData, isLoading, isError } = useReservasi()
  console.log(reservasiData)

  const navigate = useNavigate()

  const now = new Date()
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const reservationFiltered = reservasiData?.filter((r) => r.status !== 'completed')

  return (
    <div className="flex flex-col p-4 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Permintaan Reservasi</h1>
      <p className="text-sm text-muted-foreground">{formattedDate}</p>
      <div className="mt-4">
        {reservationFiltered?.map((res, index) => (
          <ReservationCard key={index} res={res} />
        ))}
      </div>
      <Button
        variant="default"
        className="bg-[#B9D654] hover:bg-[#A8C24A] text-white"
        onClick={() => navigate({ to: '/admin/reservasi' })}
      >
        Lihat Semua Reservasi
      </Button>
    </div>
  )
}
