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
