import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminPromo,
  deleteAdminPromo,
  getAdminPromoById,
  getAdminPromos,
  getPromos,
  updateAdminPromo,
  type AdminPromoItem,
  type AdminPromoPagination,
  type CreateAdminPromoPayload,
  type UpdateAdminPromoPayload,
} from '#/services/promoService'

type AdminPromosQueryData = {
  promos: AdminPromoItem[]
  pagination: AdminPromoPagination
}

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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminPromoPayload) => createAdminPromo(payload),
    onSuccess: async (createdPromo) => {
      queryClient.setQueryData<AdminPromosQueryData>(
        ['admin-promos'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            promos: [createdPromo, ...prev.promos],
            pagination: {
              ...prev.pagination,
              total: prev.pagination.total + 1,
            },
          }
        },
      )

      await queryClient.invalidateQueries({ queryKey: ['admin-promos'] })
    },
  })
}

export function useUpdateAdminPromo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminPromoPayload) => updateAdminPromo(payload),
    onSuccess: async (updatedPromo) => {
      queryClient.setQueryData<AdminPromosQueryData>(
        ['admin-promos'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            promos: prev.promos.map((promo) =>
              promo.id === updatedPromo.id ? updatedPromo : promo,
            ),
          }
        },
      )

      queryClient.setQueryData(['admin-promos', updatedPromo.id], updatedPromo)
      await queryClient.invalidateQueries({ queryKey: ['admin-promos'] })
    },
  })
}

export function useDeleteAdminPromo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminPromo(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminPromosQueryData>(
        ['admin-promos'],
        (prev) => {
          if (!prev) return prev

          const nextPromos = prev.promos.filter(
            (promo) => promo.id !== deletedId,
          )
          const nextTotal = Math.max(0, prev.pagination.total - 1)

          return {
            ...prev,
            promos: nextPromos,
            pagination: {
              ...prev.pagination,
              total: nextTotal,
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ['admin-promos', deletedId] })
      await queryClient.invalidateQueries({ queryKey: ['admin-promos'] })
    },
  })
}
