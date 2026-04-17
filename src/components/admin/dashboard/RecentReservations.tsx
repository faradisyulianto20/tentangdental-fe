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
  const navigate = useNavigate()
  
  // Filter out completed status and sort by pending, validated, then cancelled
  const sortedItems = items
    .filter((item) => item.status !== 'completed')
    .sort((a, b) => {
      const statusOrder: Record<string, number> = {
        pending: 1,
        validated: 2,
        cancelled: 3,
      }
      return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999)
    })

  return (
    <div className="p-4 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold">Reservasi Terbaru</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Daftar reservasi terbaru dari pasien
      </p>

      <div className="space-y-3">
        {sortedItems.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            Belum ada reservasi terbaru.
          </div>
        ) : (
          sortedItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-[#E0F4FB] p-4 cursor-pointer hover:bg-[#D0E8F5] transition-colors"
              onClick={() => navigate({ to: '/admin/reservasi' })}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.patient_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.service_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.doctor_name}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(item.status)}`}
                >
                  {formatStatus(item.status)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatDateOnly(item.reservation_date)} •{' '}
                {formatTime(item.appointment_time)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
