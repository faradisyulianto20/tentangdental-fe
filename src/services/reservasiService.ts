import { apiRequest } from '@/lib/api-client'

export type PatientCategory = 'new' | 'existing'

export type CreatePublicReservationPayload = {
  patient_category: PatientCategory
  name: string
  phone: string
  gender?: 'male' | 'female'
  address?: string
  birth_date?: string
  age?: number
  doctor_id: number
  complain: string
  reservation_date: string
  appointment_time: string
  service_ids: number[]
}

export type PublicReservationResult = {
  id: string | number
  patient: {
    id: string | number
    name: string
    phone: string
  }
  services: string
  doctor: {
    id: string | number
    name: string
  }
  complain: string
  reservation_date: string
  appointment_time: string
  birth_date: string | null
  age: string | number | null
  patient_category: string
  status: string
  created_at: string
}

export async function createPublicReservation(
  payload: CreatePublicReservationPayload,
): Promise<PublicReservationResult> {
  return apiRequest<PublicReservationResult>('reservations', {
    method: 'POST',
    auth: false,
    body: payload,
  })
}
