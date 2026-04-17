import { useRef, useState, useEffect } from 'react'
import {
  CalendarIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Input } from './input'

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  onBlur?: () => void
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = 'Pilih tanggal',
  disabled = false,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const ref = useRef<HTMLDivElement>(null)

  const prevYear = () => setViewYear((y) => y - 1)
  const nextYear = () => setViewYear((y) => y + 1)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate()
  const today = new Date()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else setViewMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else setViewMonth((m) => m + 1)
  }

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    onChange(d)
    setOpen(false)
  }

  const displayValue = value
    ? `${String(value.getDate()).padStart(2, '0')} ${MONTHS[value.getMonth()]} ${value.getFullYear()}`
    : ''

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Input
          readOnly
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          className="cursor-pointer pr-9"
          onClick={() => !disabled && setOpen((o) => !o)}
          onBlur={onBlur}
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 bg-white border rounded-xl shadow-lg p-3 min-w-65">
          {/* Header Navigation */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <button
              onClick={prevYear}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Tahun sebelumnya"
              type="button"
            >
              <ChevronFirst className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={prevMonth}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Bulan sebelumnya"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm flex-1 text-center">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Bulan berikutnya"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={nextYear}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Tahun berikutnya"
              type="button"
            >
              <ChevronLast className="w-4 h-4 text-primary" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Day headers */}
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs text-muted-foreground py-1 font-medium"
              >
                {d}
              </div>
            ))}

            {/* Previous month days */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div
                key={`p${i}`}
                className="text-center text-xs text-muted-foreground/40 py-1.5"
              >
                {daysInPrev - firstDay + 1 + i}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const currentDate = new Date(viewYear, viewMonth, day)
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear()
              const isSel =
                value &&
                day === value.getDate() &&
                viewMonth === value.getMonth() &&
                viewYear === value.getFullYear()
              const isDisabled =
                minDate &&
                new Date(viewYear, viewMonth, day) <
                  new Date(
                    minDate.getFullYear(),
                    minDate.getMonth(),
                    minDate.getDate(),
                  )

              return (
                <button
                  key={day}
                  onClick={() => !isDisabled && selectDay(day)}
                  disabled={isDisabled}
                  type="button"
                  className={`text-center text-xs py-1.5 rounded-md transition-colors
                    ${isDisabled ? 'text-muted-foreground/30 cursor-not-allowed' : ''}
                    ${isSel ? 'bg-primary text-white font-bold' : ''}
                    ${isToday && !isSel ? 'font-bold text-primary' : ''}
                    ${!isSel && !isDisabled ? 'hover:bg-primary/10' : ''}`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
