import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPublicReservation,
  deleteAdminReservation,
  getAdminReservationById,
  getAdminReservations,
  getReservasi,
  updateAdminReservationPatientDetails,
  updateAdminReservationStatus,
} from '@/services/reservasiService'
import type {
  AdminReservationDetail,
  AdminReservationStatus,
  CreatePublicReservationPayload,
  ReservasiApiItem,
  ReservasiPagination,
  ReservationPatientDetailsPayload,
  UpdateAdminReservationStatusResult,
} from '@/services/reservasiService'

type AdminReservationsQueryData = {
  reservations: ReservasiApiItem[]
  pagination: ReservasiPagination
}

function shouldKeepInActiveList(status: string) {
  return status !== 'cancelled'
}

function updateReservationInList(
  prev: AdminReservationsQueryData | undefined,
  nextItem: Partial<ReservasiApiItem> & { id: number | string; status: string },
) {
  if (!prev) return prev

  const withoutCurrent = prev.reservations.filter(
    (item) => item.id !== nextItem.id,
  )

  if (!shouldKeepInActiveList(nextItem.status)) {
    return {
      ...prev,
      reservations: withoutCurrent,
      pagination: {
        ...prev.pagination,
        total: Math.max(0, prev.pagination.total - 1),
      },
    }
  }

  const exists = prev.reservations.some((item) => item.id === nextItem.id)
  if (!exists) return prev

  return {
    ...prev,
    reservations: prev.reservations.map((item) =>
      item.id === nextItem.id ? { ...item, ...nextItem } : item,
    ),
    pagination: {
      ...prev.pagination,
      total: prev.pagination.total,
    },
  }
}

export function useReservasi() {
  return useQuery<ReservasiApiItem[]>({
    queryKey: ['reservasi'],
    queryFn: getReservasi,
    staleTime: 1000 * 60,
  })
}

export function useAdminReservations() {
  return useQuery<AdminReservationsQueryData>({
    queryKey: ['admin-reservations'],
    queryFn: getAdminReservations,
    staleTime: 1000 * 30,
  })
}

export function useAdminReservationById(id?: number) {
  return useQuery<AdminReservationDetail>({
    queryKey: ['admin-reservations', id],
    queryFn: () => getAdminReservationById(id as number),
    enabled: typeof id === 'number',
    staleTime: 1000 * 30,
  })
}

export function useUpdateAdminReservationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: number; status: AdminReservationStatus }) =>
      updateAdminReservationStatus(payload),
    onSuccess: async (updatedItem: UpdateAdminReservationStatusResult) => {
      queryClient.setQueryData<AdminReservationsQueryData>(
        ['admin-reservations'],
        (prev) =>
          updateReservationInList(prev, {
            id: updatedItem.id,
            status: updatedItem.status,
            created_at: updatedItem.created_at,
          }),
      )

      queryClient.setQueryData<AdminReservationDetail | undefined>(
        ['admin-reservations', Number(updatedItem.id)],
        (prev: AdminReservationDetail | undefined) => {
          if (!prev) return prev
          return {
            ...prev,
            status: updatedItem.status,
            created_at: updatedItem.created_at,
          }
        },
      )

      await queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      await queryClient.invalidateQueries({
        queryKey: ['admin-dashboard', 'reservation-stats'],
      })
    },
  })
}

export function useUpdateAdminReservationPatientDetails() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      id: number
      data: ReservationPatientDetailsPayload
    }) => updateAdminReservationPatientDetails(payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['admin-reservations', variables.id],
      })
      await queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-patients'] })
      await queryClient.invalidateQueries({
        queryKey: ['admin-patients', variables.data.patient_id],
      })
      await queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      await queryClient.invalidateQueries({
        queryKey: ['admin-dashboard', 'reservation-stats'],
      })
    },
  })
}

export function useDeleteAdminReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminReservation(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminReservationsQueryData>(
        ['admin-reservations'],
        (prev) => {
          if (!prev) return prev

          const nextItems = prev.reservations.filter(
            (item) => item.id !== deletedId,
          )
          const nextTotal = Math.max(0, prev.pagination.total - 1)

          return {
            ...prev,
            reservations: nextItems,
            pagination: {
              ...prev.pagination,
              total: nextTotal,
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ['admin-reservations', deletedId] })
      await queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      await queryClient.invalidateQueries({
        queryKey: ['admin-dashboard', 'reservation-stats'],
      })
    },
  })
}

export function useCreatePublicReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePublicReservationPayload) =>
      createPublicReservation(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      await queryClient.invalidateQueries({
        queryKey: ['admin-dashboard', 'reservation-stats'],
      })
    },
  })
}
