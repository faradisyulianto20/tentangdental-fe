import { apiRequest } from '@/lib/api-client'

export type TestimonialApiItem = {
  id: number
  name: string
  rating: number
  testimoni: string
  photo_url: string | null
  created_at: string
}

export async function getTestimonials(): Promise<TestimonialApiItem[]> {
  return apiRequest<TestimonialApiItem[]>('testimonials', {
    method: 'GET',
    auth: false,
  })
}
