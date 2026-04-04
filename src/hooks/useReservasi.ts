import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createPublicReservation,
  getReservasi,
  type CreatePublicReservationPayload,
  type ReservasiApiItem,
} from '#/services/reservasiService'

export function useReservasi() {
  return useQuery<ReservasiApiItem[]>({
    queryKey: ['reservasi'],
    queryFn: getReservasi,
    staleTime: 1000 * 60,
  })
}

export function useCreatePublicReservation() {
  return useMutation({
    mutationFn: (payload: CreatePublicReservationPayload) =>
      createPublicReservation(payload),
  })
}
