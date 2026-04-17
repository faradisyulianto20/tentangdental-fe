import { useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { ChevronLeft, User, MapPin, Activity, Stethoscope } from 'lucide-react'
import { useAdminPatientById } from '@/hooks/usePatient'
import { Skeleton } from '#/components/ui/skeleton'

interface DetailPasienProps {
  id: string
}

export default function DetailPasien({ id }: DetailPasienProps) {
  const navigate = useNavigate()
  const patientId = id ? Number(id) : undefined
  const { data: pasien, isLoading } = useAdminPatientById(patientId)
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-14 w-72 rounded-md mt-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!pasien) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-destructive">Data pasien tidak ditemukan</p>
      </div>
    )
  }

  console.log('DetailPasien ID:', id)

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
              {pasien.name} {pasien.nickname ? `(${pasien.nickname})` : ''}
            </h1>
            <p className="text-sm text-gray-500">
              ID Pasien: {pasien.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-success/20 text-success-foreground px-4 py-1.5 rounded-full text-sm font-semibold capitalize">
            Status: {pasien.last_reservation?.status || 'no-reservation'}
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
              <InfoItem label="Jenis Kelamin" value={pasien.gender === 'laki-laki' ? 'Laki-laki' : pasien.gender === 'perempuan' ? 'Perempuan' : '-'} />
              <InfoItem label="Umur" value={pasien.age ? `${pasien.age} Tahun` : '-'} />
              <InfoItem label="Pekerjaan" value={pasien.occupation || '-'} />
              <InfoItem label="Tanggal Lahir" value={pasien.birth_date ? new Date(pasien.birth_date).toLocaleDateString('id-ID') : '-'} />
              <InfoItem label="Orang Tua/Wali" value={pasien.parent_name || '-'} />
              <InfoItem label="No. Handphone" value={pasien.phone || '-'} />
            </div>
          </div>

          {/* Section 2: Alamat */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-info-foreground font-bold">
              <MapPin size={18} />
              <h2>Alamat & Lokasi</h2>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <InfoItem label="Kota/Kabupaten" value={pasien.city || '-'} />
              <InfoItem label="Kecamatan" value={pasien.district || '-'} />
              <InfoItem label="Kelurahan" value={pasien.village || '-'} />
              <div className="col-span-2">
                <InfoItem label="Alamat Lengkap" value={pasien.address || '-'} />
              </div>
            </div>
          </div>

          {/* Section 3: Keluhan Utama */}
          <div className="bg-danger/5 p-6 rounded-2xl border border-danger/20">
            <div className="flex items-center gap-2 mb-2 text-danger-foreground font-bold">
              <Stethoscope size={18} />
              <h2>Keluhan Utama</h2>
            </div>
            <p className="text-gray-700 italic">"{ pasien.reservations?.[0]?.complain || '-'}"</p>
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
                  {pasien.height || '-'} cm
                </p>
              </div>
              <div className="w-px h-10 bg-info/30"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">Berat</p>
                <p className="text-xl font-bold text-slate-800">
                  {pasien.weight || '-'} kg
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
                  {pasien.last_reservation?.services?.map((s) => s.name).join(', ') || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal:</span>
                <span className="font-medium">
                  {pasien.last_reservation?.reservation_date
                    ? new Date(pasien.last_reservation.reservation_date).toLocaleDateString('id-ID')
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jam:</span>
                <span className="font-medium">{pasien.last_reservation?.appointment_time || '-'}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-500">Dokter:</span>
                <span className="font-bold">{pasien.last_reservation?.doctor_name || '-'}</span>
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
