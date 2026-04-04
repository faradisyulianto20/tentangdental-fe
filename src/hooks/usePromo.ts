import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createAdminPromo,
  deleteAdminPromo,
  getAdminPromoById,
  getAdminPromos,
  getPromos,
  updateAdminPromo,
  type CreateAdminPromoPayload,
  type UpdateAdminPromoPayload,
} from '#/services/promoService'
import { queryClient } from '@/lib/queryClient'

export function usePromos() {
  return useQuery({
    queryKey: ['promos'],
    queryFn: getPromos,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminPromos() {
  return useQuery({
    queryKey: ['admin-promos'],
    queryFn: getAdminPromos,
    staleTime: 1000 * 60,
  })
}

export function useAdminPromoById(id?: number) {
  return useQuery({
    queryKey: ['admin-promos', id],
    queryFn: () => getAdminPromoById(id as number),
    enabled: typeof id === 'number',
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminPromo() {
  return useMutation({
    mutationFn: (payload: CreateAdminPromoPayload) => createAdminPromo(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-promos'] })
    },
  })
}

export function useUpdateAdminPromo() {
  return useMutation({
    mutationFn: (payload: UpdateAdminPromoPayload) => updateAdminPromo(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-promos'] })
    },
  })
}

export function useDeleteAdminPromo() {
  return useMutation({
    mutationFn: (id: number) => deleteAdminPromo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-promos'] })
    },
  })
}
