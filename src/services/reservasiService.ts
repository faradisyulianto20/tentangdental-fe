import { apiRequest } from '#/lib/api-client'

export type AdminReservationStatus =
  | 'pending'
  | 'validated'
  | 'completed'
  | 'cancelled'

export type ReservationMedicalHistoryForm = {
  has_allergy?: boolean | string | null
  allergy_detail?: string | null
  has_systemic_disease?: boolean | string | null
  systemic_disease_detail?: string | null
  undergoing_treatment?: boolean | string | null
  treatment_detail?: string | null
  ever_hospitalized?: boolean | string | null
  hospitalized_reason?: string | null
  smoking_or_alcohol?: boolean | string | null
}

export type ReservationDentalHistoryForm = {
  frequent_tooth_pain?: boolean | string | null
  tooth_pain_detail?: string | null
  bleeding_gums?: boolean | string | null
  ever_dental_treatment?: boolean | string | null
  dental_treatment_detail?: string | null
  brushing_frequency?: string | null
  use_floss_or_mouthwash?: boolean | string | null
  bad_habits?: boolean | string | null
  bad_habits_detail?: string | null
  ever_braces?: boolean | string | null
  braces_years?: number | null
  root_canal_treatment?: boolean | string | null
  root_canal_detail?: string | null
  dentures?: boolean | string | null
  routine_checkup?: boolean | string | null
  dental_checkup_frequency?: string | null
  doctor_notes?: string | null
}

export type ReservationPatientForm = {
  patient_id: string
  name: string
  nickname: string | null
  gender: string | null
  age: string | null
  birth_place: string | null
  birth_date: string | null
  address: string | null
  village: string | null
  district: string | null
  city: string | null
  phone: string
  occupation: string | null
  parent_name: string | null
  height: string | null
  weight: string | null
}

export type serviceItem = {
  id: number
  name: string
}

export type ReservasiApiItem = {
  id: number | string
  patient: {
    id: number | string
    name: string
    phone: string
  } | null
  services: serviceItem[]
  doctor: {
    id: number | string
    name: string
  } | null
  complain: string | null
  reservation_date: string | null
  appointment_time: string | null
  birth_date: string | null
  age: string | null
  patient_category: string | null
  status: AdminReservationStatus | string
  created_at: string | null
}

export type ReservasiPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

type AdminReservationsResponse = {
  reservations: ReservasiApiItem[]
  pagination: ReservasiPagination
}

export type AdminReservationDetail = ReservasiApiItem & {
  patient_form?: ReservationPatientForm
  medical_history_form?: ReservationMedicalHistoryForm
  dental_history_form?: ReservationDentalHistoryForm
}

export type ReservationPatientDetailsPayload = {
  patient_id: number
  name: string
  nickname?: string | null
  gender?: 'male' | 'female' | null
  age?: number | null
  birth_place?: string | null
  birth_date?: string | null
  address?: string | null
  village?: string | null
  district?: string | null
  city?: string | null
  phone: string
  occupation?: string | null
  parent_name?: string | null
  height?: number | null
  weight?: number | null
  medical_history?: ReservationMedicalHistoryForm
  dental_history?: ReservationDentalHistoryForm
}

export type UpdateAdminReservationStatusPayload = {
  id: number
  status: AdminReservationStatus
}

export type UpdateAdminReservationStatusResult = {
  id: string | number
  status: AdminReservationStatus
  created_at: string | null
}

export type UpdateAdminReservationPatientDetailsPayload = {
  id: number
  data: ReservationPatientDetailsPayload
}

function normalizeAdminReservationsResponse(
  input: AdminReservationsResponse | ReservasiApiItem[] | null | undefined,
): AdminReservationsResponse {
  if (Array.isArray(input)) {
    return {
      reservations: input,
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: input.length,
        total: input.length,
      },
    }
  }

  return {
    reservations: Array.isArray(input?.reservations) ? input.reservations : [],
    pagination: {
      current_page: Number(input?.pagination.current_page || 1),
      last_page: Number(input?.pagination.last_page || 1),
      per_page: Number(input?.pagination.per_page || 10),
      total: Number(input?.pagination.total || 0),
    },
  }
}

function toPatientDetailsRequestBody(
  payload: ReservationPatientDetailsPayload,
) {
  type JsonSection = Record<string, string | number | boolean | null>
  type JsonLike = string | number | boolean | null | JsonSection

  const body: Record<string, JsonLike> = {
    patient_id: payload.patient_id,
    name: payload.name,
    phone: payload.phone,
  }

  const setIfDefined = (key: string, value: JsonLike | undefined) => {
    if (value === undefined) return
    body[key] = value
  }

  setIfDefined('nickname', payload.nickname)
  setIfDefined('gender', payload.gender ?? null)
  setIfDefined('age', payload.age)
  setIfDefined('birth_place', payload.birth_place)
  setIfDefined('birth_date', payload.birth_date)
  setIfDefined('address', payload.address)
  setIfDefined('village', payload.village)
  setIfDefined('district', payload.district)
  setIfDefined('city', payload.city)
  setIfDefined('occupation', payload.occupation)
  setIfDefined('parent_name', payload.parent_name)
  setIfDefined('height', payload.height)
  setIfDefined('weight', payload.weight)

  const normalizeSection = (section?: Record<string, unknown>) => {
    if (!section) return null

    const next: JsonSection = {}
    Object.entries(section).forEach(([key, value]) => {
      if (value === undefined) return
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null
      ) {
        next[key] = value
      }
    })

    return next
  }

  setIfDefined('medical_history', normalizeSection(payload.medical_history))
  setIfDefined('dental_history', normalizeSection(payload.dental_history))

  return body
}

export async function getAdminReservations(): Promise<AdminReservationsResponse> {
  const response = await apiRequest<
    AdminReservationsResponse | ReservasiApiItem[]
  >('admin/reservations', {
    method: 'GET',
    auth: true,
  })

  return normalizeAdminReservationsResponse(response)
}

export async function getAdminReservationById(
  id: number,
): Promise<AdminReservationDetail> {
  return apiRequest<AdminReservationDetail>(`admin/reservations/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function updateAdminReservationStatus(
  payload: UpdateAdminReservationStatusPayload,
): Promise<UpdateAdminReservationStatusResult> {
  return apiRequest<UpdateAdminReservationStatusResult>(
    `admin/reservations/${payload.id}`,
    {
      method: 'PUT',
      auth: true,
      body: {
        status: payload.status,
      },
    },
  )
}

export async function updateAdminReservationPatientDetails(
  payload: UpdateAdminReservationPatientDetailsPayload,
): Promise<null> {
  return apiRequest<null>(`admin/reservations/${payload.id}/patient-details`, {
    method: 'PUT',
    auth: true,
    body: toPatientDetailsRequestBody(payload.data),
  })
}

export async function deleteAdminReservation(id: number): Promise<null> {
  return apiRequest<null>(`admin/reservations/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function getReservasi(): Promise<ReservasiApiItem[]> {
  const response = await getAdminReservations()
  return response.reservations
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
