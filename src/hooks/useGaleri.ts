import { useQuery } from '@tanstack/react-query'
import { getGallery } from '#/services/galeriService'

export function useGallery(page = 1) {
  return useQuery({
    queryKey: ['gallery', page],
    queryFn: () => getGallery(page), // ← wrap arrow function
    staleTime: 1000 * 60 * 5,
  })
}
