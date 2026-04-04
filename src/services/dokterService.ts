import { apiRequest } from '#/lib/api-client'

export type DoctorApiItem = {
  id: number
  name: string
  specialization: string | null
  photo_url: string
  schedule: string[]
  statement: string | null
  created_at?: string
  updated_at?: string
}

type DoctorRawItem = {
  id: number
  name: string
  specialization: string | null
  photo_url: string
  schedule: unknown
  statement: string | null
  created_at?: string
  updated_at?: string
}

export type AdminDoctorPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateAdminDoctorPayload = {
  name: string
  specialization?: string | null
  statement?: string | null
  schedule: string[]
  photo: File
}

export type UpdateAdminDoctorPayload = {
  id: number
  name?: string
  specialization?: string | null
  statement?: string | null
  schedule?: string[]
  photo?: File | null
}

function normalizeSchedule(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>
    const collected: string[] = []

    Object.values(record).forEach((entry) => {
      if (Array.isArray(entry)) {
        entry.forEach((item) => {
          if (typeof item === 'string') {
            collected.push(item)
          }
        })
      }
    })

    return collected
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return normalizeSchedule(parsed)
    } catch {
      return value.length > 0 ? [value] : []
    }
  }

  return []
}

function normalizeDoctor(item: DoctorRawItem): DoctorApiItem {
  return {
    id: item.id,
    name: item.name,
    specialization: item.specialization,
    photo_url: item.photo_url,
    schedule: normalizeSchedule(item.schedule),
    statement: item.statement,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}

export async function getDoctors(): Promise<DoctorApiItem[]> {
  const response = await apiRequest<DoctorRawItem[]>('doctors', {
    method: 'GET',
    auth: false,
  })
  return Array.isArray(response) ? response.map(normalizeDoctor) : []
}

export async function getAdminDoctors(): Promise<{
  doctors: DoctorApiItem[]
  pagination: AdminDoctorPagination
}> {
  const response = await apiRequest<{
    doctors: DoctorRawItem[]
    pagination: AdminDoctorPagination
  }>('admin/doctors', {
    method: 'GET',
    auth: true,
  })

  return {
    doctors: Array.isArray(response?.doctors)
      ? response.doctors.map(normalizeDoctor)
      : [],
    pagination: {
      current_page: Number(response?.pagination?.current_page || 1),
      last_page: Number(response?.pagination?.last_page || 1),
      per_page: Number(response?.pagination?.per_page || 10),
      total: Number(response?.pagination?.total || 0),
    },
  }
}

export async function getAdminDoctorById(id: number): Promise<DoctorApiItem> {
  const response = await apiRequest<DoctorRawItem>(`admin/doctors/${id}`, {
    method: 'GET',
    auth: true,
  })

  return normalizeDoctor(response)
}

export async function createAdminDoctor(
  payload: CreateAdminDoctorPayload,
): Promise<DoctorApiItem> {
  const formData = new FormData()
  formData.append('name', payload.name)
  if (payload.specialization !== undefined && payload.specialization !== null) {
    formData.append('specialization', payload.specialization)
  }
  if (payload.statement !== undefined && payload.statement !== null) {
    formData.append('statement', payload.statement)
  }
  payload.schedule.forEach((item) => {
    formData.append('schedule[]', item)
  })
  formData.append('photo', payload.photo)

  const response = await apiRequest<DoctorRawItem>('admin/doctors', {
    method: 'POST',
    auth: true,
    body: formData,
  })

  return normalizeDoctor(response)
}

export async function updateAdminDoctor(
  payload: UpdateAdminDoctorPayload,
): Promise<DoctorApiItem> {
  const formData = new FormData()
  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.specialization !== undefined && payload.specialization !== null) {
    formData.append('specialization', payload.specialization)
  }
  if (payload.statement !== undefined && payload.statement !== null) {
    formData.append('statement', payload.statement)
  }
  if (payload.schedule !== undefined) {
    payload.schedule.forEach((item) => {
      formData.append('schedule[]', item)
    })
  }
  if (payload.photo) {
    formData.append('photo', payload.photo)
  }

  const response = await apiRequest<DoctorRawItem>(
    `admin/doctors/${payload.id}`,
    {
      method: 'PUT',
      auth: true,
      body: formData,
    },
  )

  return normalizeDoctor(response)
}

export async function deleteAdminDoctor(id: number): Promise<null> {
  return apiRequest<null>(`admin/doctors/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
