import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminFaq,
  deleteAdminFaq,
  getAdminFaqById,
  getAdminFaqs,
  getFaqs,
  updateAdminFaq
  
  
  
  
} from '#/services/faqService'
import type {AdminFaqPagination, CreateAdminFaqPayload, FaqApiItem, UpdateAdminFaqPayload} from '#/services/faqService';

type AdminFaqsQueryData = {
  faqs: FaqApiItem[]
  pagination: AdminFaqPagination
}

export function useFaq() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useAdminFaqs() {
  return useQuery({
    queryKey: ['admin-faqs'],
    queryFn: getAdminFaqs,
    staleTime: 1000 * 60,
  })
}

export function useAdminFaqById(id?: number) {
  return useQuery({
    queryKey: ['admin-faqs', id],
    queryFn: () => getAdminFaqById(id as number),
    enabled: typeof id === 'number',
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminFaqPayload) => createAdminFaq(payload),
    onSuccess: async (createdItem) => {
      queryClient.setQueryData<AdminFaqsQueryData>(['admin-faqs'], (prev) => {
        if (!prev) return prev

        return {
          ...prev,
          faqs: [createdItem, ...prev.faqs],
          pagination: {
            ...prev.pagination,
            total: prev.pagination.total + 1,
          },
        }
      })

      await queryClient.invalidateQueries({ queryKey: ['admin-faqs'] })
      await queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}

export function useUpdateAdminFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminFaqPayload) => updateAdminFaq(payload),
    onSuccess: async (updatedItem) => {
      queryClient.setQueryData<AdminFaqsQueryData>(['admin-faqs'], (prev) => {
        if (!prev) return prev

        return {
          ...prev,
          faqs: prev.faqs.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        }
      })

      queryClient.setQueryData(['admin-faqs', updatedItem.id], updatedItem)
      await queryClient.invalidateQueries({ queryKey: ['admin-faqs'] })
      await queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}

export function useDeleteAdminFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminFaq(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminFaqsQueryData>(['admin-faqs'], (prev) => {
        if (!prev) return prev

        const nextItems = prev.faqs.filter((item) => item.id !== deletedId)
        const nextTotal = Math.max(0, prev.pagination.total - 1)

        return {
          ...prev,
          faqs: nextItems,
          pagination: {
            ...prev.pagination,
            total: nextTotal,
          },
        }
      })

      queryClient.removeQueries({ queryKey: ['admin-faqs', deletedId] })
      await queryClient.invalidateQueries({ queryKey: ['admin-faqs'] })
      await queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}
