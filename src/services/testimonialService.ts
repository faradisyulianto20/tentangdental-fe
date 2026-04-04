import { apiRequest } from '@/lib/api-client'

export type TestimonialApiItem = {
  id: number
  name: string
  rating: number
  testimoni: string
  photo_url: string | null
  created_at: string
  updated_at?: string
}

export type AdminTestimonialPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateAdminTestimonialPayload = {
  name: string
  rating: number
  testimoni: string
  photo?: File | null
}

export type UpdateAdminTestimonialPayload = {
  id: number
  name?: string
  rating?: number
  testimoni?: string
  photo?: File | null
}

export async function getTestimonials(): Promise<TestimonialApiItem[]> {
  return apiRequest<TestimonialApiItem[]>('testimonials', {
    method: 'GET',
    auth: false,
  })
}

export async function getAdminTestimonials(): Promise<{
  testimonials: TestimonialApiItem[]
  pagination: AdminTestimonialPagination
}> {
  const result = await apiRequest<{
    testimonials: TestimonialApiItem[]
    pagination: AdminTestimonialPagination
  }>('admin/testimonials', {
    method: 'GET',
    auth: true,
  })

  return {
    testimonials: Array.isArray(result?.testimonials)
      ? result.testimonials
      : [],
    pagination: {
      current_page: Number(result?.pagination?.current_page || 1),
      last_page: Number(result?.pagination?.last_page || 1),
      per_page: Number(result?.pagination?.per_page || 10),
      total: Number(result?.pagination?.total || 0),
    },
  }
}

export async function getAdminTestimonialById(
  id: number,
): Promise<TestimonialApiItem> {
  return apiRequest<TestimonialApiItem>(`admin/testimonials/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function createAdminTestimonial(
  payload: CreateAdminTestimonialPayload,
): Promise<TestimonialApiItem> {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('rating', String(payload.rating))
  formData.append('testimoni', payload.testimoni)
  if (payload.photo) {
    formData.append('photo', payload.photo)
  }

  return apiRequest<TestimonialApiItem>('admin/testimonials', {
    method: 'POST',
    auth: true,
    body: formData,
  })
}

export async function updateAdminTestimonial(
  payload: UpdateAdminTestimonialPayload,
): Promise<TestimonialApiItem> {
  const formData = new FormData()
  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.rating !== undefined)
    formData.append('rating', String(payload.rating))
  if (payload.testimoni !== undefined)
    formData.append('testimoni', payload.testimoni)
  if (payload.photo) formData.append('photo', payload.photo)

  return apiRequest<TestimonialApiItem>(`admin/testimonials/${payload.id}`, {
    method: 'PUT',
    auth: true,
    body: formData,
  })
}

export async function deleteAdminTestimonial(id: number): Promise<null> {
  return apiRequest<null>(`admin/testimonials/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
