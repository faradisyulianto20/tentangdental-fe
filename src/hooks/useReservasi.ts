import { useQuery } from '@tanstack/react-query'
import { getReservasi } from '@/services/reservasiService'
import type { ReservasiApiItem } from '@/services/reservasiService'

export function useReservasi() {
  return useQuery<ReservasiApiItem[]>({
    queryKey: ['reservasi'],
    queryFn: getReservasi,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
