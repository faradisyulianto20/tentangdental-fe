import { apiRequest } from '#/lib/api-client'

export type GalleryApiItem = {
  id: number
  image_url: string | null
  caption: string | null
  created_at: string
  updated_at: string
}

export type GalleryPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type GalleryApiResponse = {
  galleries: GalleryApiItem[]
  pagination: GalleryPagination
}

export type AdminGalleryPagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateAdminGalleryPayload = {
  image: File
  caption?: string
}

export async function getGallery(
  page = 1,
): Promise<{ galleries: GalleryApiItem[]; pagination: GalleryPagination }> {
  const result = await apiRequest<GalleryApiResponse>(
    `galleries?page=${page}`,
    {
      method: 'GET',
      auth: false,
    },
  )

  return {
    galleries: Array.isArray(result?.galleries) ? result.galleries : [],
    pagination: {
      current_page: Number(result?.pagination?.current_page || 1),
      last_page: Number(result?.pagination?.last_page || 1),
      per_page: Number(result?.pagination?.per_page || 10),
      total: Number(result?.pagination?.total || 0),
    },
  }
}

export async function getAdminGalleries(): Promise<{
  galleries: GalleryApiItem[]
  pagination: AdminGalleryPagination
}> {
  const result = await apiRequest<GalleryApiResponse>('admin/galleries', {
    method: 'GET',
    auth: true,
  })

  return {
    galleries: Array.isArray(result?.galleries) ? result.galleries : [],
    pagination: {
      current_page: Number(result?.pagination?.current_page || 1),
      last_page: Number(result?.pagination?.last_page || 1),
      per_page: Number(result?.pagination?.per_page || 10),
      total: Number(result?.pagination?.total || 0),
    },
  }
}

export async function createAdminGallery(
  payload: CreateAdminGalleryPayload,
): Promise<GalleryApiItem> {
  const formData = new FormData()
  formData.append('image', payload.image)
  if (payload.caption !== undefined) {
    formData.append('caption', payload.caption)
  }

  return apiRequest<GalleryApiItem>('admin/galleries', {
    method: 'POST',
    auth: true,
    body: formData,
  })
}

export async function deleteAdminGallery(id: number): Promise<null> {
  return apiRequest<null>(`admin/galleries/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
