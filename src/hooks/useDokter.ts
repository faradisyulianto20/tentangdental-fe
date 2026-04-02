import { useQuery } from '@tanstack/react-query'
import { getDoctors } from '@/services/dokterService'

export function useDokter() {
  return useQuery({
    queryKey: ['dokter'],
    queryFn: getDoctors,
    staleTime: 1000 * 60 * 5,
  })
}
