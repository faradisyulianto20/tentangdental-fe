import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface MultiSelectProps {
  items: string[]
  value: string[]
  onChange: (val: string[]) => void
  placeholder?: string
  badgeColors?: string[]
}

const defaultBadgeColors = [
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-teal-100 text-teal-700 border-teal-200',
]

export function MultiSelect({
  items,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  badgeColors = defaultBadgeColors,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = (item: string) => {
    onChange(
      value.includes(item) ? value.filter((v) => v !== item) : [...value, item],
    )
  }

  const remove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== item))
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger box */}
      <div
        className="border-primary min-h-9 w-full flex flex-wrap gap-1 items-center px-3 py-1.5 border border-input rounded-md bg-background cursor-pointer text-sm hover:bg-accent/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {value.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        {value.map((item, i) => (
          <span
            key={item}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${badgeColors[i % badgeColors.length]}`}
          >
            {item}
            <X
              className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100"
              onClick={(e) => remove(item, e)}
            />
          </span>
        ))}
      </div>

      {/* Dropdown options */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-md max-h-52 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item}
              onMouseDown={(e) => {
                e.preventDefault()
                toggle(item)
              }}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                value.includes(item) ? 'bg-accent/40 font-medium' : ''
              }`}
            >
              {item}
              {value.includes(item) && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
