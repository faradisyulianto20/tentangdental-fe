import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminGallery,
  deleteAdminGallery,
  getAdminGalleries,
  getGallery,
  type AdminGalleryPagination,
  type CreateAdminGalleryPayload,
  type GalleryApiItem,
  type GalleryPagination,
} from '#/services/galeriService'

type GalleryQueryData = {
  galleries: GalleryApiItem[]
  pagination: GalleryPagination
}

type AdminGalleryQueryData = {
  galleries: GalleryApiItem[]
  pagination: AdminGalleryPagination
}

export function useGallery(page = 1) {
  return useQuery<GalleryQueryData>({
    queryKey: ['gallery', page],
    queryFn: () => getGallery(page),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminGalleries() {
  return useQuery<AdminGalleryQueryData>({
    queryKey: ['admin-galleries'],
    queryFn: getAdminGalleries,
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminGalleryPayload) =>
      createAdminGallery(payload),
    onSuccess: async (createdItem) => {
      queryClient.setQueryData<AdminGalleryQueryData>(
        ['admin-galleries'],
        (prev) => {
          if (!prev) {
            return {
              galleries: [createdItem],
              pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 1,
              },
            }
          }

          return {
            ...prev,
            galleries: [createdItem, ...prev.galleries],
            pagination: {
              ...prev.pagination,
              total: prev.pagination.total + 1,
            },
          }
        },
      )

      await queryClient.invalidateQueries({
        queryKey: ['gallery'],
        refetchType: 'none',
      })
    },
  })
}

export function useDeleteAdminGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminGallery(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminGalleryQueryData>(
        ['admin-galleries'],
        (prev) => {
          if (!prev) return prev

          const nextItems = prev.galleries.filter(
            (item) => item.id !== deletedId,
          )
          const nextTotal = Math.max(0, prev.pagination.total - 1)

          return {
            ...prev,
            galleries: nextItems,
            pagination: {
              ...prev.pagination,
              total: nextTotal,
            },
          }
        },
      )

      await queryClient.invalidateQueries({
        queryKey: ['gallery'],
        refetchType: 'none',
      })
    },
  })
}
