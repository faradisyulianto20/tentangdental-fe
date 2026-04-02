import { useQuery } from '@tanstack/react-query'
import { getLayanan, getLayananById } from '@/services/layananService'

export function useLayanan() {
  return useQuery({
    queryKey: ['layanan'],
    queryFn: getLayanan,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLayananById(id: string) {
  return useQuery({
    queryKey: ['layanan', id],
    queryFn: () => getLayananById(id),
    staleTime: 1000 * 60 * 5,
  })
}