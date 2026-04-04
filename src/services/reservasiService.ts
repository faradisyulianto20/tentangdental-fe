import { apiRequest } from '@/lib/api-client'

export type ReservasiApiItem = {
  id: number | string
  patient: {
    id: number | string
    name: string
    phone: string
  }
  services: Array<{
    id: number | string
    name: string
  }>
  doctor: {
    id: number | string
    name: string
  }
  complain: string
  reservation_date: string
  appointment_time: string
  birth_date: string | null
  age: number | null
  patient_category: string
  status: string
  created_at: string | null

  namaPasien?: string
  namaPanggilan?: string
  layanan?: string
  tanggalReservasi?: string
  nomorHandphone?: string
  jamReservasi?: string
  dokter?: string
  nomorPasien?: string
  jenisKelamin?: string
  umur?: string
  pekerjaan?: string
  tanggalLahir?: string
  namaOrangTua?: string
  kotaKabupaten?: string
  kecamatan?: string
  kelurahan?: string
  alamatLengkap?: string
  tinggiBadan?: string
  beratBadan?: string
  keluhan?: string
}

export type ReservasiPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export async function getReservasi(): Promise<ReservasiApiItem[]> {
  const response = await apiRequest<{
    reservations: ReservasiApiItem[]
    pagination: ReservasiPagination
  }>('/admin/reservations', {
    method: 'GET',
    auth: true,
  })

  return response?.reservations ?? []
}

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
