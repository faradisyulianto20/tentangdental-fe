import { useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { ChevronLeft, User, MapPin, Activity, Stethoscope } from 'lucide-react'

interface DetailPasienProps {
  id: string
}

// Simulasi pencarian data (Nanti ganti dengan dataPasien.find)
const pasien = {
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
  kecamatan: 'Kasihan',
  kelurahan: 'Tirtonirmolo',
  alamatLengkap: 'Jl. Bantul No. 22',
  tinggiBadan: '158',
  beratBadan: '50',
  keluhan: 'Gigi berlubang di bagian belakang dan terasa ngilu.',
}

export default function DetailPasien({ id }: DetailPasienProps) {
  const navigate = useNavigate()

  //  Nanti id buat filter ke data asli
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header & Tombol Kembali */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              navigate({ to: '/admin/data-pasien', search: { id: undefined } })
            }
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {pasien.namaPasien} ({pasien.namaPanggilan})
            </h1>
            <p className="text-sm text-gray-500">
              ID Pasien: {pasien.nomorPasien}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-success/20 text-success-foreground px-4 py-1.5 rounded-full text-sm font-semibold capitalize">
            Status: {pasien.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Profil Utama */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Data Diri */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold">
              <User size={18} />
              <h2>Informasi Pribadi</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 text-sm">
              <InfoItem label="Jenis Kelamin" value={pasien.jenisKelamin} />
              <InfoItem label="Umur" value={`${pasien.umur} Tahun`} />
              <InfoItem label="Pekerjaan" value={pasien.pekerjaan} />
              <InfoItem label="Tanggal Lahir" value={pasien.tanggalLahir} />
              <InfoItem label="Orang Tua/Wali" value={pasien.namaOrangTua} />
              <InfoItem label="No. Handphone" value={pasien.nomorHandphone} />
            </div>
          </div>

          {/* Section 2: Alamat */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-info-foreground font-bold">
              <MapPin size={18} />
              <h2>Alamat & Lokasi</h2>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <InfoItem label="Kota/Kabupaten" value={pasien.kotaKabupaten} />
              <InfoItem label="Kecamatan" value={pasien.kecamatan} />
              <InfoItem label="Kelurahan" value={pasien.kelurahan} />
              <div className="col-span-2">
                <InfoItem label="Alamat Lengkap" value={pasien.alamatLengkap} />
              </div>
            </div>
          </div>

          {/* Section 3: Keluhan Utama */}
          <div className="bg-danger/5 p-6 rounded-2xl border border-danger/20">
            <div className="flex items-center gap-2 mb-2 text-danger-foreground font-bold">
              <Stethoscope size={18} />
              <h2>Keluhan Utama</h2>
            </div>
            <p className="text-gray-700 italic">"{pasien.keluhan}"</p>
          </div>
        </div>

        {/* Kolom Kanan: Detail Reservasi & Fisik */}
        <div className="space-y-6">
          {/* Section 4: Data Fisik */}
          <div className="bg-info/10 p-6 rounded-2xl border border-info/20">
            <div className="flex items-center gap-2 mb-4 text-info-foreground font-bold">
              <Activity size={18} />
              <h2>Data Fisik</h2>
            </div>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">Tinggi</p>
                <p className="text-xl font-bold text-slate-800">
                  {pasien.tinggiBadan} cm
                </p>
              </div>
              <div className="w-px h-10 bg-info/30"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">Berat</p>
                <p className="text-xl font-bold text-slate-800">
                  {pasien.beratBadan} kg
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Info Kunjungan */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-slate-800 mb-4">Detail Reservasi</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Layanan:</span>
                <span className="font-medium text-primary">
                  {pasien.layanan}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal:</span>
                <span className="font-medium">{pasien.tanggalReservasi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jam:</span>
                <span className="font-medium">{pasien.jamReservasi}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-500">Dokter:</span>
                <span className="font-bold">{pasien.dokter}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Komponen Helper untuk tampilan label-value agar rapi
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
        {label}
      </span>
      <span className="text-slate-700 font-medium wrap-break-words">
        {value || '-'}
      </span>
    </div>
  )
}
