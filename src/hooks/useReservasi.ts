import { useMutation } from '@tanstack/react-query'
import {
  createPublicReservation,
  type CreatePublicReservationPayload,
} from '#/services/reservasiService'

export function useCreatePublicReservation() {
  return useMutation({
    mutationFn: (payload: CreatePublicReservationPayload) =>
      createPublicReservation(payload),
  })
}
