import { useNavigate } from '@tanstack/react-router'

type RecentReservationItem = {
  id: string | number
  patient_name: string
  service_name: string
  doctor_name: string
  reservation_date: string
  appointment_time: string
  status: string
}

type RecentReservationsProps = {
  items: RecentReservationItem[]
}

function formatDateOnly(value: string | null | undefined) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(value: string | null | undefined) {
  if (!value) return '-'

  const trimmed = value.trim()
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    const withDate = `1970-01-01T${trimmed}`
    const date = new Date(withDate)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    }
  }

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatStatus(status: string) {
  if (status === 'pending') return 'Menunggu'
  if (status === 'validated') return 'Tervalidasi'
  if (status === 'completed') return 'Selesai'
  if (status === 'cancelled') return 'Dibatalkan'
  return status
}

function statusColor(status: string) {
  if (status === 'pending') return 'bg-amber-100 text-amber-700'
  if (status === 'validated') return 'bg-blue-100 text-blue-700'
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'cancelled') return 'bg-rose-100 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

export default function RecentReservations({ items }: RecentReservationsProps) {
  // 1. Filter out completed dan urutkan berdasarkan status (Pending -> Validated -> Cancelled)
  const baseSortedItems = items
    .filter((item) => item.status !== 'completed')
    .sort((a, b) => {
      const statusOrder: Record<string, number> = {
        pending: 1,
        validated: 2,
        cancelled: 3,
      }
      return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999)
    })

  // 2. Urutkan lagi berdasarkan TANGGAL TERBARU (cukup lakukan 1 kali di sini)
  const sortedByDateItems = [...baseSortedItems].sort((a, b) => {
    return (
      new Date(a.reservation_date).getTime() -
      new Date(b.reservation_date).getTime()
    )
  })

  // Buat pembanding waktu hari ini (di-set ke jam 00:00:00 agar murni membandingkan tanggal)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 3. Kelompokkan menggunakan .filter() dari array yang sudah rapi di atas
  const todayReservations = sortedByDateItems.filter((item) => {
    const resDate = new Date(item.reservation_date)
    resDate.setHours(0, 0, 0, 0)
    return resDate.getTime() === today.getTime()
  })

  const outdatedReservations = sortedByDateItems.filter((item) => {
    const resDate = new Date(item.reservation_date)
    resDate.setHours(0, 0, 0, 0)
    return resDate.getTime() < today.getTime() // Pasti akurat untuk tanggal sebelum hari ini
  })

  const upcomingReservations = sortedByDateItems.filter((item) => {
    const resDate = new Date(item.reservation_date)
    resDate.setHours(0, 0, 0, 0)
    return resDate.getTime() > today.getTime() // Pasti akurat untuk tanggal setelah hari ini
  })

  return (
    <div
      className="p-4 shadow-md rounded-lg"
      data-testid="recent-reservations-section"
    >
      <h2 className="text-2xl font-bold">Reservasi Terbaru</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Daftar reservasi terbaru dari pasien
      </p>

      <div className="space-y-3">
        {baseSortedItems.length === 0 ? (
          <div
            className="rounded-lg border p-4 text-sm text-muted-foreground"
            data-testid="recent-reservations-empty-state"
          >
            Belum ada reservasi terbaru.
          </div>
        ) : (
          <>
            <div data-testid="reservations-today-header">
              Reservasi Hari Ini ({todayReservations.length})
            </div>
            {todayReservations.length > 0 &&
              todayReservations.map((item) => (
                <ReservationItem item={item} key={item.id} groupKey="today" />
              ))}
            <div data-testid="reservations-upcoming-header">
              Reservasi Mendatang (
              {baseSortedItems.length - todayReservations.length})
            </div>
            {upcomingReservations.length > 0 &&
              upcomingReservations.map((item) => (
                <ReservationItem
                  item={item}
                  key={item.id}
                  groupKey="upcoming"
                />
              ))}
            <div data-testid="reservations-outdated-header">
              Reservasi Terdahulu ({outdatedReservations.length})
            </div>
            {outdatedReservations.length > 0 &&
              outdatedReservations.map((item) => (
                <ReservationItem
                  item={item}
                  key={item.id}
                  groupKey="outdated"
                />
              ))}
          </>
        )}
      </div>
    </div>
  )
}

function ReservationItem({
  item,
  groupKey,
}: {
  item: RecentReservationItem
  groupKey: string
}) {
  const navigate = useNavigate()

  return (
    <div
      key={item.id}
      className="rounded-lg border bg-[#E0F4FB] p-4 cursor-pointer hover:bg-[#D0E8F5] transition-colors"
      onClick={() => navigate({ to: '/admin/reservasi' })}
      data-testid={`reservation-item-${groupKey}-${item.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="font-semibold"
            data-testid={`reservation-patient-${item.id}`}
          >
            {item.patient_name}
          </p>
          <p
            className="text-sm text-muted-foreground"
            data-testid={`reservation-service-${item.id}`}
          >
            {item.service_name}
          </p>
          <p
            className="text-sm text-muted-foreground"
            data-testid={`reservation-doctor-${item.id}`}
          >
            {item.doctor_name}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(item.status)}`}
          data-testid={`reservation-status-${item.id}`}
        >
          {formatStatus(item.status)}
        </span>
      </div>
      <p
        className="mt-2 text-sm text-muted-foreground"
        data-testid={`reservation-datetime-${item.id}`}
      >
        {formatDateOnly(item.reservation_date)} •{' '}
        {formatTime(item.appointment_time)}
      </p>
    </div>
  )
}
