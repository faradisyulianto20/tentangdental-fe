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
}

export async function getLayanan(): Promise<LayananApiItem[]> {
  const result = await apiRequest<LayananApiItem[]>('services', {
    method: 'GET',
    auth: false,
  })
  return Array.isArray(result) ? result : []
}

export async function getLayananById(id: string): Promise<LayananDetailApiItem> {
  if (!id || id === '0') {
    throw new Error('Invalid layanan ID')
  }
  return apiRequest<LayananDetailApiItem>(`services/${id}`, {
    method: 'GET',
    auth: false,
  })
}