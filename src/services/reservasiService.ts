import { apiRequest } from '#/lib/api-client'

export type ReservasiApiItem = {
  id: number
  patient: {
    id: number
    name: string
    phone: string
  }
  services: string
  doctor: {
    id: number
    name: string
  }
  complain: string
  reservation_date: string
  appointment_time: string
  birth_date: string
  age: number
  patient_category: string
  status: string
  created_at: string | null
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
