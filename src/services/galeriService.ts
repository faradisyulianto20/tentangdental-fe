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

export async function getGallery(
  page = 1,
): Promise<{ galleries: GalleryApiItem[]; pagination: GalleryPagination }> {
  return apiRequest<GalleryApiResponse>(`galleries?page=${page}`, {
    method: 'GET',
    auth: false,
  })
}
