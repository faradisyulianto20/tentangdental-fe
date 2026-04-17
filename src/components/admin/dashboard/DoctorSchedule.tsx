import { useDokter } from '@/hooks/useDokter'

export default function DoctorSchedule() {
  const { data: doctors, isLoading, isError } = useDokter()

  const now = new Date()
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="p-4 shadow-md rounded-lg">
      <div>
        <h1 className="text-2xl font-bold">Jadwal Dokter</h1>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
      <div className="mt-4">
        {isLoading && <p className="text-muted-foreground">Memuat jadwal dokter...</p>}
        {isError && (
          <p className="text-red-500">Gagal memuat jadwal dokter</p>
        )}
        {doctors?.map((doctor) => (
          <div
            key={doctor.id}
            className="border rounded-lg p-4 mb-4 bg-[#E0F4FB] flex gap-2"
          >
            <img
              src={doctor.photo_url}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-bold">{doctor.name}</h2>
              <p className="text-sm text-muted-foreground">
                {doctor.schedule?.join(', ') || 'Jadwal tidak tersedia'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
