import { apiRequest } from '@/lib/api-client'

export type PromoApiItem = {
  id: number
  name: string
  image_url: string | null
  original_price: number
  promo_price: number
  detail: string
}

export async function getPromos(): Promise<PromoApiItem[]> {
  return apiRequest<PromoApiItem[]>('promos', {
    method: 'GET',
    auth: false,
  })
}

export type AdminPromoItem = {
  id: number
  name: string
  image_url: string | null
  detail: string
  original_price: number
  promo_price: number
  created_at: string
  updated_at: string
}

export type AdminPromoPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateAdminPromoPayload = {
  name: string
  detail: string
  original_price: number
  promo_price: number
  image: File
}

export type UpdateAdminPromoPayload = {
  id: number
  name?: string
  detail?: string
  original_price?: number
  promo_price?: number
  image?: File | null
}

export async function getAdminPromos(): Promise<{
  promos: AdminPromoItem[]
  pagination: AdminPromoPagination
}> {
  const result = await apiRequest<{
    promos: AdminPromoItem[]
    pagination: AdminPromoPagination
  }>('admin/promos', {
    method: 'GET',
    auth: true,
  })

  return {
    promos: Array.isArray(result?.promos) ? result.promos : [],
    pagination: {
      current_page: Number(result?.pagination?.current_page || 1),
      last_page: Number(result?.pagination?.last_page || 1),
      per_page: Number(result?.pagination?.per_page || 10),
      total: Number(result?.pagination?.total || 0),
    },
  }
}

export async function getAdminPromoById(id: number): Promise<AdminPromoItem> {
  return apiRequest<AdminPromoItem>(`admin/promos/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function createAdminPromo(
  payload: CreateAdminPromoPayload,
): Promise<AdminPromoItem> {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('detail', payload.detail)
  formData.append('original_price', String(payload.original_price))
  formData.append('promo_price', String(payload.promo_price))
  formData.append('image', payload.image)

  return apiRequest<AdminPromoItem>('admin/promos', {
    method: 'POST',
    auth: true,
    body: formData,
  })
}

export async function updateAdminPromo(
  payload: UpdateAdminPromoPayload,
): Promise<AdminPromoItem> {
  const formData = new FormData()
  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.detail !== undefined) formData.append('detail', payload.detail)
  if (payload.original_price !== undefined) {
    formData.append('original_price', String(payload.original_price))
  }
  if (payload.promo_price !== undefined) {
    formData.append('promo_price', String(payload.promo_price))
  }
  if (payload.image) formData.append('image', payload.image)

  return apiRequest<AdminPromoItem>(`admin/promos/${payload.id}`, {
    method: 'PUT',
    auth: true,
    body: formData,
  })
}

export async function deleteAdminPromo(id: number): Promise<null> {
  return apiRequest<null>(`admin/promos/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
