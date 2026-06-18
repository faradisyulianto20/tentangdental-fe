import { useDokter } from '@/hooks/useDokter'

const DAY_NAMES: Record<string, number> = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
}

function getTodayDayName(): string {
  const dayIndex = new Date().getDay()
  return Object.keys(DAY_NAMES).find((key) => DAY_NAMES[key] === dayIndex) ?? ''
}

function filterAndMergeTodaySchedule(schedule: string[]): string[] {
  const today = getTodayDayName()

  // Filter hanya jadwal hari ini dan ambil jam mulai & selesai
  const todaySlots = schedule
    .filter((s) => s.startsWith(today + ' '))
    .map((s) => {
      const timePart = s.replace(today + ' ', '')
      const [start, end] = timePart.split(' - ')
      return { start, end }
    })
    .sort((a, b) => a.start.localeCompare(b.start))

  if (todaySlots.length === 0) return []

  // Gabungkan slot yang berkelanjutan
  const merged: { start: string; end: string }[] = []
  let current = { ...todaySlots[0] }

  for (let i = 1; i < todaySlots.length; i++) {
    if (todaySlots[i].start === current.end) {
      // Lanjutkan penggabungan
      current.end = todaySlots[i].end
    } else {
      merged.push(current)
      current = { ...todaySlots[i] }
    }
  }
  merged.push(current)

  return merged.map((slot) => `${slot.start} - ${slot.end}`)
}

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
        {isLoading && (
          <p className="text-muted-foreground">Memuat jadwal dokter...</p>
        )}
        {isError && <p className="text-red-500">Gagal memuat jadwal dokter</p>}
        {doctors?.map((doctor) => {
          const todaySchedule = filterAndMergeTodaySchedule(
            doctor.schedule ?? [],
          )
          return (
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
                {todaySchedule.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {todaySchedule.map((slot, i) => {
                      return (
                        <span
                          key={i}
                          className="text-xs bg-white border border-blue-200 text-blue-700 rounded-full px-2 py-0.5"
                        >
                          {slot}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada jadwal hari ini
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
