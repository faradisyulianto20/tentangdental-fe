import { ApiError, apiRequest } from '@/lib/api-client'
import { getStoredToken } from '@/lib/auth-storage'
import { appEnv } from '@/lib/env'
import type {
  ReservationDentalHistoryForm,
  ReservationMedicalHistoryForm,
} from '@/services/reservasiService'

export type PatientGender = 'laki-laki' | 'perempuan'

export type AdminPatientListItem = {
  id: number
  patient_number: string
  name: string
  phone: string
  birth_date: string | null
  gender: PatientGender | null
  age: number | null
  latest_reservation_date: string | null
  latest_services: string[]
  created_at: string | null
}

export type AdminPatientPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

type AdminPatientsResponse = {
  patients: AdminPatientListItem[]
  pagination: AdminPatientPagination
}

export type PatientServiceItem = {
  id: number
  name: string
}

export type PatientReservationItem = {
  id: number
  complain: string | null
  services: PatientServiceItem[]
  doctor_name: string | null
  reservation_date: string | null
  appointment_time: string | null
  status: string
}

export type PatientLastReservation = {
  id: number
  doctor_name: string | null
  reservation_date: string | null
  appointment_time: string | null
  status: string
  services: PatientServiceItem[]
}

export type PatientRontgenSummary = {
  id: number
  doctor_id: number | null
  latest_image_url: string | null
  detail: string | null
  created_at: string | null
}

export type AdminPatientDetail = {
  id: number
  patient_number?: string
  name: string
  phone: string
  birth_date: string | null
  gender: PatientGender | null
  address: string | null
  age: number | null
  nickname?: string | null
  birth_place?: string | null
  village?: string | null
  district?: string | null
  city?: string | null
  occupation?: string | null
  parent_name?: string | null
  height?: number | null
  weight?: number | null
  medical_history: ReservationMedicalHistoryForm | null
  dental_history: ReservationDentalHistoryForm | null
  last_reservation: PatientLastReservation | null
  reservations: PatientReservationItem[]
  rontgens: PatientRontgenSummary[]
  created_at: string | null
  updated_at: string | null
}

export type PatientRontgenImage = {
  id: number
  image_url: string
  image_type: string | null
  created_at: string | null
}

export type PatientRontgenItem = {
  id: number
  doctor: {
    id: number
    name: string
  } | null
  detail: string | null
  status: string | null
  latest_image_url: string | null
  images: PatientRontgenImage[]
  created_at: string | null
}

export type AdminPatientReservation = {
  id: number
  complain: string | null
  services: Array<{
    id: number
    name: string
  }>
  doctor_name: string | null
  reservation_date: string | null
  appointment_time: string | null
  status: string | null
}

export type AdminPatientRontgensData = {
  id: number
  name: string
  phone: string
  birth_date: string | null
  gender: PatientGender | null
  age: number | null
  address: string | null
  medical_history: Record<string, unknown> | null
  dental_history: Record<string, unknown> | null
  reservations: AdminPatientReservation[]
  rontgens: PatientRontgenItem[]
  created_at: string | null
  updated_at: string | null
}

export type UpdateAdminPatientPayload = {
  id: number
  data: {
    name?: string
    phone?: string
    birth_date?: string | null
    gender?: PatientGender | null
    address?: string | null
    age?: number | null
    nickname?: string | null
    birth_place?: string | null
    village?: string | null
    district?: string | null
    city?: string | null
    occupation?: string | null
    parent_name?: string | null
    height?: number | null
    weight?: number | null
    medical_history?: ReservationMedicalHistoryForm | null
    dental_history?: ReservationDentalHistoryForm | null
  }
}

export interface DeleteRontgenImageResponse {
  success: boolean
  data: null
  message: string // "Foto rontgen berhasil dihapus"
}

function normalizePatientsResponse(
  input: AdminPatientsResponse | null | undefined,
) {
  return {
    patients: Array.isArray(input?.patients) ? input.patients : [],
    pagination: {
      current_page: Number(input?.pagination.current_page || 1),
      last_page: Number(input?.pagination.last_page || 1),
      per_page: Number(input?.pagination.per_page || 10),
      total: Number(input?.pagination.total || 0),
    },
  }
}

export async function getAdminPatients(page = 1, perPage = 10) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })

  const response = await apiRequest<AdminPatientsResponse>(
    `admin/patients?${query.toString()}`,
    {
      method: 'GET',
      auth: true,
    },
  )

  return normalizePatientsResponse(response)
}

export async function getAdminPatientById(id: number) {
  return apiRequest<AdminPatientDetail>(`admin/patients/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function getAdminPatientRontgens(id: number) {
  return apiRequest<AdminPatientRontgensData>(`admin/patients/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function updateAdminPatient(payload: UpdateAdminPatientPayload) {
  return apiRequest<AdminPatientDetail>(`admin/patients/${payload.id}`, {
    method: 'PUT',
    auth: true,
    body: payload.data,
    timeoutMs: 30000, // 30 seconds for complex patient updates with medical/dental history
  })
}

export async function deleteAdminPatient(id: number) {
  return apiRequest<null>(`admin/patients/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, '')
  const cleanPath = path.replace(/^\/+/, '')
  return `${cleanBase}/${cleanPath}`
}

function parseMessage(status: number, payload: unknown): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof (payload as { message?: unknown }).message === 'string'
  ) {
    return String((payload as { message: string }).message)
  }

  if (status === 401) return 'Unauthorized'
  if (status === 403) return 'Forbidden'
  if (status === 404) return 'Not found'
  if (status >= 500) return 'Server error'
  return 'Request failed'
}

export async function downloadAdminPatientPdf(id: number): Promise<Blob> {
  const token = getStoredToken()

  const response = await fetch(
    joinUrl(appEnv.apiBaseUrl, `admin/patients/${id}/download-pdf`),
    {
      method: 'GET',
      headers: {
        Accept: 'application/pdf, application/octet-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  )

  if (!response.ok) {
    let payload: unknown = null
    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    throw new ApiError(
      response.status,
      parseMessage(response.status, payload),
      payload,
    )
  }

  return response.blob()
}

export function getAdminRontgenDownloadUrl(id: string | number): string {
  return joinUrl(appEnv.apiBaseUrl, `admin/rontgens/${id}/download`)
}


export async function deleteAdminRontgenImage(id: string, imageId: string) {
  return apiRequest<DeleteRontgenImageResponse>(
    `admin/rontgens/${id}/images/${imageId}`,
    {
      method: 'DELETE',
      auth: true,
    }
  )
}