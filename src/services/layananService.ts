import { apiRequest } from '@/lib/api-client'

export type LayananApiItem = {
  id: number
  name: string
  detail: string
  icon_url: string | null
}

export type LayananDetailApiItem = {
  id: number
  name: string
  detail: string
  icon_url: string | null
  article_content: string
  support_img_url: string | null
  support_image_url?: string | null
}

export type AdminServiceItem = {
  id: number
  name: string
  detail: string
  icon_url: string | null
  article_content: string
  support_image_url: string | null
  created_at: string
  updated_at: string
}

export type AdminServicePagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateAdminServicePayload = {
  name: string
  detail: string
  article_content: string
  icon: File
  support_image: File
}

export type UpdateAdminServicePayload = {
  id: number
  name?: string
  detail?: string
  article_content?: string
  icon?: File | null
  support_image?: File | null
}

export async function getLayanan(): Promise<LayananApiItem[]> {
  const result = await apiRequest<LayananApiItem[]>('services', {
    method: 'GET',
    auth: false,
  })
  return Array.isArray(result) ? result : []
}

export async function getLayananById(
  id: string,
): Promise<LayananDetailApiItem> {
  if (!id || id === '0') {
    throw new Error('Invalid layanan ID')
  }
  return apiRequest<LayananDetailApiItem>(`services/${id}`, {
    method: 'GET',
    auth: false,
  })
}

export async function getAdminServices(): Promise<{
  services: AdminServiceItem[]
  pagination: AdminServicePagination
}> {
  const result = await apiRequest<{
    services: AdminServiceItem[]
    pagination: AdminServicePagination
  }>('admin/services', {
    method: 'GET',
    auth: true,
  })

  return {
    services: Array.isArray(result?.services) ? result.services : [],
    pagination: {
      current_page: Number(result?.pagination?.current_page || 1),
      last_page: Number(result?.pagination?.last_page || 1),
      per_page: Number(result?.pagination?.per_page || 10),
      total: Number(result?.pagination?.total || 0),
    },
  }
}

export async function getAdminServiceById(
  id: number,
): Promise<AdminServiceItem> {
  return apiRequest<AdminServiceItem>(`admin/services/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function createAdminService(
  payload: CreateAdminServicePayload,
): Promise<AdminServiceItem> {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('detail', payload.detail)
  formData.append('article_content', payload.article_content)
  formData.append('icon', payload.icon)
  formData.append('support_image', payload.support_image)

  return apiRequest<AdminServiceItem>('admin/services', {
    method: 'POST',
    auth: true,
    body: formData,
  })
}

export async function updateAdminService(
  payload: UpdateAdminServicePayload,
): Promise<AdminServiceItem> {
  const formData = new FormData()
  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.detail !== undefined) formData.append('detail', payload.detail)
  if (payload.article_content !== undefined) {
    formData.append('article_content', payload.article_content)
  }
  if (payload.icon) formData.append('icon', payload.icon)
  if (payload.support_image)
    formData.append('support_image', payload.support_image)

  return apiRequest<AdminServiceItem>(`admin/services/${payload.id}`, {
    method: 'PUT',
    auth: true,
    body: formData,
  })
}

export async function deleteAdminService(id: number): Promise<null> {
  return apiRequest<null>(`admin/services/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
