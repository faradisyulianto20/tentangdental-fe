import { apiRequest } from '#/lib/api-client'

export type DoctorScheduleMap = Record<string, string[]>

export type ScheduleOptions = {
  days: string[]
  time_slot_options: string[]
  default_schedule: DoctorScheduleMap
  dropdown_options: string[]
}

const dayLabelMap: Record<string, string> = {
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: 'Jumat',
  sabtu: 'Sabtu',
  minggu: 'Minggu',
}

/**
 * Split time slot into 1-hour intervals
 * @param timeSlot - Time slot in format 'HH:MM-HH:MM' (e.g., '08:00-14:00')
 * @returns Array of 1-hour time slots (e.g., ['08:00-09:00', '09:00-10:00', ...])
 */
export function splitTimeSlotByHour(timeSlot: string): string[] {
  const [startStr, endStr] = timeSlot.split('-')
  if (!startStr || !endStr) return []

  const startHour = parseInt(startStr.split(':')[0], 10)
  const endHour = parseInt(endStr.split(':')[0], 10)

  if (isNaN(startHour) || isNaN(endHour)) return []

  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    const currentHour = hour.toString().padStart(2, '0')
    const nextHour = (hour + 1).toString().padStart(2, '0')
    slots.push(`${currentHour}:00-${nextHour}:00`)
  }

  return slots
}

/**
 * Split multiple time slots by hour
 * @param timeSlots - Array of time slots
 * @returns Array of split 1-hour time slots (duplicates removed)
 */
export function splitTimeSlotsByHour(timeSlots: string[]): string[] {
  const slotSet = new Set<string>()

  timeSlots.forEach((slot) => {
    const split = splitTimeSlotByHour(slot)
    split.forEach((s) => slotSet.add(s))
  })

  return Array.from(slotSet)
}

/**
 * Generate all 1-hour time slots for a given time range
 * @param timeSlots - Array of time slots to determine start and end hours
 * @returns Array of all 1-hour time slots
 */
export function generateAllHourlySlots(timeSlots: string[]): string[] {
  if (timeSlots.length === 0) return []

  let minHour = 24
  let maxHour = 0

  // Find min and max hours from the time slots
  timeSlots.forEach((slot) => {
    const split = splitTimeSlotByHour(slot)
    split.forEach((s) => {
      const startHour = parseInt(s.split(':')[0], 10)
      minHour = Math.min(minHour, startHour)
      maxHour = Math.max(maxHour, startHour + 1)
    })
  })

  if (minHour >= maxHour) return []

  const slots: string[] = []
  for (let hour = minHour; hour < maxHour; hour++) {
    const currentHour = hour.toString().padStart(2, '0')
    const nextHour = (hour + 1).toString().padStart(2, '0')
    slots.push(`${currentHour}:00-${nextHour}:00`)
  }

  return slots
}

/**
 * Format schedule label from day and time slot
 * @param day - Day name (e.g., 'senin', 'selasa')
 * @param slot - Time slot (e.g., '09:00-11:00')
 * @returns Formatted label (e.g., 'Senin 09:00 - 11:00')
 */
export function formatScheduleLabel(day: string, slot: string): string {
  const labelDay = dayLabelMap[day.toLowerCase()] ?? day
  return labelDay + ' ' + slot.replace('-', ' - ')
}

/**
 * Get schedule options for doctors
 * Fetches days, time slots, and default schedule configuration
 * Generates all 1-hour intervals for all days available for selection
 */
export async function getScheduleOptions(): Promise<ScheduleOptions> {
  const response = await apiRequest<{
    default_schedule: DoctorScheduleMap
    time_slot_options: string[]
    days: string[]
  }>('admin/doctors/schedule-options', {
    method: 'GET',
    auth: true,
  })

  const days = Array.isArray(response?.days) ? response.days : []
  const timeSlotOptionsRaw = Array.isArray(response?.time_slot_options)
    ? response.time_slot_options
    : []

  // Generate all 1-hour intervals based on API time slot range
  const timeSlotOptions = generateAllHourlySlots(timeSlotOptionsRaw)

  // Create default schedule with all hourly slots for all days
  const defaultSchedule: DoctorScheduleMap = {}
  days.forEach((day) => {
    defaultSchedule[day.toLowerCase()] = timeSlotOptions
  })

  // Generate dropdown options with all combinations of day + hourly slots
  const dropdownOptions: string[] = []
  days.forEach((day) => {
    timeSlotOptions.forEach((slot) => {
      dropdownOptions.push(formatScheduleLabel(day, slot))
    })
  })

  return {
    days,
    time_slot_options: timeSlotOptions,
    default_schedule: defaultSchedule,
    dropdown_options: dropdownOptions,
  }
}

/**
 * Convert schedule labels to schedule map format
 * @param labels - Array of formatted schedule labels
 * @returns Schedule map with days as keys and time slots as values
 */
export function toScheduleMap(labels: string[]): DoctorScheduleMap {
  const dayLookup: Record<string, string> = {
    senin: 'senin',
    selasa: 'selasa',
    rabu: 'rabu',
    kamis: 'kamis',
    jumat: 'jumat',
    sabtu: 'sabtu',
    minggu: 'minggu',
  }

  const result: DoctorScheduleMap = {
    senin: [],
    selasa: [],
    rabu: [],
    kamis: [],
    jumat: [],
    sabtu: [],
    minggu: [],
  }

  labels.forEach((label) => {
    const parts = label.trim().split(' ')
    if (parts.length < 2) return

    const dayRaw = parts[0].toLowerCase()
    const day = dayLookup[dayRaw]
    if (!day) return

    const slot = parts
      .slice(1)
      .join(' ')
      .replace(/\s*-\s*/g, '-')
    if (slot.length > 0) {
      result[day].push(slot)
    }
  })

  return result
}
