import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminTestimonial,
  deleteAdminTestimonial,
  getAdminTestimonialById,
  getAdminTestimonials,
  getTestimonials,
  updateAdminTestimonial,
  type AdminTestimonialPagination,
  type CreateAdminTestimonialPayload,
  type TestimonialApiItem,
  type UpdateAdminTestimonialPayload,
} from '@/services/testimonialService'

type AdminTestimonialsQueryData = {
  testimonials: TestimonialApiItem[]
  pagination: AdminTestimonialPagination
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminTestimonials() {
  return useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: getAdminTestimonials,
    staleTime: 1000 * 60,
  })
}

export function useAdminTestimonialById(id?: number) {
  return useQuery({
    queryKey: ['admin-testimonials', id],
    queryFn: () => getAdminTestimonialById(id as number),
    enabled: typeof id === 'number',
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminTestimonialPayload) =>
      createAdminTestimonial(payload),
    onSuccess: async (createdItem) => {
      queryClient.setQueryData<AdminTestimonialsQueryData>(
        ['admin-testimonials'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            testimonials: [createdItem, ...prev.testimonials],
            pagination: {
              ...prev.pagination,
              total: prev.pagination.total + 1,
            },
          }
        },
      )

      await queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export function useUpdateAdminTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminTestimonialPayload) =>
      updateAdminTestimonial(payload),
    onSuccess: async (updatedItem) => {
      queryClient.setQueryData<AdminTestimonialsQueryData>(
        ['admin-testimonials'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            testimonials: prev.testimonials.map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            ),
          }
        },
      )

      queryClient.setQueryData(
        ['admin-testimonials', updatedItem.id],
        updatedItem,
      )
      await queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export function useDeleteAdminTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminTestimonial(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminTestimonialsQueryData>(
        ['admin-testimonials'],
        (prev) => {
          if (!prev) return prev

          const nextItems = prev.testimonials.filter(
            (item) => item.id !== deletedId,
          )
          const nextTotal = Math.max(0, prev.pagination.total - 1)

          return {
            ...prev,
            testimonials: nextItems,
            pagination: {
              ...prev.pagination,
              total: nextTotal,
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ['admin-testimonials', deletedId] })
      await queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}
