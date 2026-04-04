import { apiRequest } from '#/lib/api-client'

export type FaqApiItem = {
  id: number
  question: string
  answer: string
  created_at?: string
  updated_at?: string
}

export type AdminFaqPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateAdminFaqPayload = {
  question: string
  answer: string
}

export type UpdateAdminFaqPayload = {
  id: number
  question?: string
  answer?: string
}

export async function getFaqs(): Promise<FaqApiItem[]> {
  const response = await apiRequest<FaqApiItem[]>('faqs', {
    method: 'GET',
    auth: false,
  })
  return Array.isArray(response) ? response : []
}

export async function getAdminFaqs(): Promise<{
  faqs: FaqApiItem[]
  pagination: AdminFaqPagination
}> {
  const response = await apiRequest<{
    faqs: FaqApiItem[]
    pagination: AdminFaqPagination
  }>('admin/faqs', {
    method: 'GET',
    auth: true,
  })

  return {
    faqs: Array.isArray(response?.faqs) ? response.faqs : [],
    pagination: {
      current_page: Number(response?.pagination?.current_page || 1),
      last_page: Number(response?.pagination?.last_page || 1),
      per_page: Number(response?.pagination?.per_page || 10),
      total: Number(response?.pagination?.total || 0),
    },
  }
}

export async function getAdminFaqById(id: number): Promise<FaqApiItem> {
  return apiRequest<FaqApiItem>(`admin/faqs/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function createAdminFaq(
  payload: CreateAdminFaqPayload,
): Promise<FaqApiItem> {
  return apiRequest<FaqApiItem>('admin/faqs', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function updateAdminFaq(
  payload: UpdateAdminFaqPayload,
): Promise<FaqApiItem> {
  const body: Record<string, string> = {}
  if (payload.question !== undefined) body.question = payload.question
  if (payload.answer !== undefined) body.answer = payload.answer

  return apiRequest<FaqApiItem>(`admin/faqs/${payload.id}`, {
    method: 'PUT',
    auth: true,
    body,
  })
}

export async function deleteAdminFaq(id: number): Promise<null> {
  return apiRequest<null>(`admin/faqs/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
