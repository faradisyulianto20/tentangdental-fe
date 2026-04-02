import { apiRequest } from '#/lib/api-client'

export type DoctorApiItem = {
  id: number
  name: string
  specialization: string | null
  photo_url: string
  schedule: Record<string, string[]>
  statement: string | null
}

export async function getDoctors(): Promise<DoctorApiItem[]> {
  const response = await apiRequest<DoctorApiItem[]>('doctors', {
    method: 'GET',
    auth: false,
  })
  return Array.isArray(response) ? response : []
}
