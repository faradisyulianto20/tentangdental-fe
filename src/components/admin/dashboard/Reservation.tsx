import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Phone,
  User,
  Heart,
  Smile,
  FileText,
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

const reservations = [
  {
    namaPasien: 'John Doe',
    layanan: 'Pembersihan Gigi',
    tanggalReservasi: 'Sabtu, 15 Maret 2024',
    nomorHandphone: '081234567890',
    jamReservasi: '10:00 AM',
    dokter: 'Dr. Smith',
    status: 'reservasi',
    nomorPasien: 'P001',
  },
  {
    namaPasien: 'Jane Smith',
    layanan: 'Pemeriksaan Gigi',
    tanggalReservasi: 'Minggu, 16 Maret 2024',
    nomorHandphone: '081234567891',
    jamReservasi: '11:00 AM',
    dokter: 'Dr. Johnson',
    status: 'hadir',
    nomorPasien: 'P002',
  },
  {
    namaPasien: 'Alice Johnson',
    layanan: 'Tambal Gigi',
    tanggalReservasi: 'Senin, 17 Maret 2024',
    nomorHandphone: '081234567892',
    jamReservasi: '09:00 AM',
    dokter: 'Dr. Lee',
    status: 'selesai',
    nomorPasien: 'P003',
  },
]

export function ReservationCard({ res }: { res: (typeof reservations)[0] }) {
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

  return (
    <div className="border rounded-lg p-4 mb-4 bg-[#E0F4FB]">
      <div className="flex flex-col-reverse lg:flex-row justify-between">
        <div>
          <h2 className="text-lg font-bold">{res.namaPasien}</h2>
          <p className="text-sm text-muted-foreground">{res.layanan}</p>
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
                  className="bg-[#B9D654] text-white hover:bg-[#A8C24A] mt-2 text-sm"
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
                    melakukan pemeriksaan? Pastikan semua informasi sudah benar
                    sebelum mengonfirmasi.
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
                    className="bg-[#B9D654] text-white hover:bg-[#A8C24A] mt-2 text-sm"
                  >
                    Lihat Detail
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto no-scrollbar">
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <User className="w-12 h-12  text-primary" />
                      <div>
                        <FieldTitle className="font-bold text-lg">
                          {' '}
                          Data Pasien
                        </FieldTitle>
                        <FieldDescription>
                          Nomor Pasien:{' '}
                          <span className="font-medium">{res.nomorPasien}</span>
                        </FieldDescription>
                      </div>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldSeparator />
                  <FieldGroup className="grid md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Nama Pasien</FieldLabel>
                      <Input
                        id="name-1"
                        name="name"
                        defaultValue={res.namaPasien}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nama Panggilan</FieldLabel>
                      <Input
                        id="namapanggilan-1"
                        name="namapanggilan"
                        defaultValue="Nama Panggilan Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kecamatan</FieldLabel>
                      <Input
                        id="kecamatan-1"
                        name="kecamatan"
                        defaultValue="Kecamatan Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kota/Kabupaten</FieldLabel>
                      <Input
                        id="kotakabupaten-1"
                        name="kotakabupaten"
                        defaultValue="Kota/Kabupaten Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Jenis Kelamin</FieldLabel>
                      <Input
                        id="jeniskelamin-1"
                        name="jeniskelamin"
                        defaultValue="Jenis Kelamin Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nomor Handphone</FieldLabel>
                      <Input
                        id="nomorhandphone-1"
                        name="nomorhandphone"
                        defaultValue={res.nomorHandphone}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Umur</FieldLabel>
                      <Input
                        id="umur-1"
                        name="umur"
                        defaultValue="Umur Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Pekerjaan</FieldLabel>
                      <Input
                        id="pekerjaan-1"
                        name="pekerjaan"
                        defaultValue="Pekerjaan Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Tanggal Lahir</FieldLabel>
                      <Input
                        id="tanggallahir-1"
                        name="tanggallahir"
                        defaultValue="Tanggal Lahir Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nama Orang Tua</FieldLabel>
                      <Input
                        id="namaorangtua-1"
                        name="namaorangtua"
                        defaultValue="Nama Orang Tua Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Alamat Lengkap</FieldLabel>
                      <Input
                        id="alamatlengkap-1"
                        name="alamatlengkap"
                        defaultValue="Alamat Lengkap Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Tinggi Badan (cm)</FieldLabel>
                      <Input
                        id="tinggibadan-1"
                        name="tinggibadan"
                        defaultValue="Tinggi Badan Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kelurahan</FieldLabel>
                      <Input
                        id="kelurahan-1"
                        name="kelurahan"
                        defaultValue="Kelurahan Contoh"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Berat Badan (kg)</FieldLabel>
                      <Input
                        id="beratbadan-1"
                        name="beratbadan"
                        defaultValue="Berat Badan Contoh"
                      />
                    </Field>
                  </FieldGroup>

                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <Heart className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Riwayat Kesehatan Umum
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldSeparator />
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
                            if (typeof checked === 'boolean') setHasAlergi(checked)
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
                            if (typeof checked === 'boolean') setHasPenyakitSistemik(checked)
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
                            if (typeof checked === 'boolean') setIsKonsumsiObat(checked)
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
                            if (typeof checked === 'boolean') setIsRawatRumahSakit(checked)
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
                            if (typeof checked === 'boolean') setIsKebiasaanRokok(checked)
                          }}
                        />
                      </div>
                    </Field>
                  </FieldGroup>
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <Smile className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Riwayat Kesehatan Gigi dan Mulut
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldSeparator />
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
                            if (typeof checked === 'boolean') setIsSakitGigi(checked)
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
                          if (typeof checked === 'boolean') setIsBerdarahSikatGigi(checked)
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
                            if (typeof checked === 'boolean') setIsPerawatanGigiSebelumnya(checked)
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
                          if (typeof checked === 'boolean') setIsKebisaanKesehatanMulut(checked)
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
                            if (typeof checked === 'boolean') setIsKebiasaanBuruk(checked)
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
                            if (typeof checked === 'boolean') setIsKawatGigi(checked)
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
                            if (typeof checked === 'boolean') setIsMemilikiGigiPalsu(checked)
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
                            if (typeof checked === 'boolean') setIsRutinKontrol(checked)
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
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <Clock className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Reservasi
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldSeparator />
                  <Field>
                    <FieldLabel>Nama Lengkap</FieldLabel>
                    <Input
                      id="nama-lengkap-1"
                      name="namaLengkap"
                      defaultValue={res.namaPasien}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Tanggal Lahir</FieldLabel>
                    <Input
                      id="tanggal-lahir-1"
                      name="tanggalLahir"
                      defaultValue="Tanggal Lahir Contoh"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Umur</FieldLabel>
                    <Input
                      id="umur-1"
                      name="umur"
                      defaultValue="Umur Contoh"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Nomor Handphone</FieldLabel>
                    <Input
                      id="nomor-handphone-1"
                      name="nomorHandphone"
                      defaultValue={res.nomorHandphone}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Jadwal Periksa</FieldLabel>
                    <Input
                      id="jadwal-periksa-1"
                      name="jadwalPeriksa"
                      defaultValue={`${res.tanggalReservasi} ${res.jamReservasi}`}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Jam Reservasi</FieldLabel>
                    <Input
                      id="jam-reservasi-1"
                      name="jamReservasi"
                      defaultValue={res.jamReservasi}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Pilihan Dokter</FieldLabel>
                    <Input
                      id="pilihan-dokter-1"
                      name="pilihanDokter"
                      defaultValue={res.dokter}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Layanan</FieldLabel>
                    <Input
                      id="layanan-1"
                      name="layanan"
                      defaultValue={res.layanan}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Keluhan</FieldLabel>
                    <Textarea
                      id="keluhan-1"
                      name="keluhan"
                      defaultValue="Keluhan Contoh"
                    />
                  </Field>
                  <FieldGroup className="flex">
                    <FieldLegend className="flex gap-2">
                      {' '}
                      <FileText className="w-12 h-12  text-primary" />
                      <FieldTitle className="font-bold text-lg">
                        Catatan Dokter
                      </FieldTitle>
                    </FieldLegend>
                  </FieldGroup>
                  <FieldSeparator />
                  <FieldGroup className="grid md:grid-cols-1 gap-4">
                    <Field>
                      <FieldLabel>Catatan/Rekomendasi Dokter</FieldLabel>
                      <Input
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
      <div className="grid grid-cols-2 text-sm mt-2 gap-2">
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
  const navigate = useNavigate()

  const now = new Date()
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const reservationFiltered = reservations.filter((r) => r.status !== 'selesai')

  return (
    <div className="flex flex-col p-4 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Permintaan Reservasi</h1>
      <p className="text-sm text-muted-foreground">{formattedDate}</p>
      <div className="mt-4">
        {reservationFiltered.map((res, index) => (
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
