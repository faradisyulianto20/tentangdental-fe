import { useQuery } from '@tanstack/react-query'
import { getPromos } from '#/services/promoService'

export function usePromos() {
  return useQuery({
    queryKey: ['promos'],
    queryFn: getPromos,
    staleTime: 1000 * 60 * 5,
  })
}
