import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminArticle,
  deleteAdminArticle,
  getAdminArticleById,
  getAdminArticles,
  getArticleBySlug,
  getArticles,
  updateAdminArticle
  
  
  
  
} from '#/services/artikelService'
import type {AdminArticleItem, AdminArticlePagination, CreateAdminArticlePayload, UpdateAdminArticlePayload} from '#/services/artikelService';

type AdminArticlesQueryData = {
  articles: AdminArticleItem[]
  pagination: AdminArticlePagination
}

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
    staleTime: 1000 * 60 * 5,
  })
}

export function useArticleBySlug(slug: string) {
  return useQuery({
    queryKey: ['articles', slug],
    queryFn: () => getArticleBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminArticles() {
  return useQuery({
    queryKey: ['admin-articles'],
    queryFn: getAdminArticles,
    staleTime: 1000 * 60,
  })
}

export function useAdminArticleById(id?: number) {
  return useQuery({
    queryKey: ['admin-articles', id],
    queryFn: () => getAdminArticleById(id as number),
    enabled: typeof id === 'number',
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminArticlePayload) =>
      createAdminArticle(payload),
    onSuccess: async (createdItem) => {
      queryClient.setQueryData<AdminArticlesQueryData>(
        ['admin-articles'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            articles: [createdItem, ...prev.articles],
            pagination: {
              ...prev.pagination,
              total: prev.pagination.total + 1,
            },
          }
        },
      )

      await queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      await queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useUpdateAdminArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminArticlePayload) =>
      updateAdminArticle(payload),
    onSuccess: async (updatedItem) => {
      queryClient.setQueryData<AdminArticlesQueryData>(
        ['admin-articles'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            articles: prev.articles.map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            ),
          }
        },
      )

      queryClient.setQueryData(['admin-articles', updatedItem.id], updatedItem)
      await queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      await queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useDeleteAdminArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminArticle(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminArticlesQueryData>(
        ['admin-articles'],
        (prev) => {
          if (!prev) return prev

          const nextItems = prev.articles.filter(
            (item) => item.id !== deletedId,
          )
          const nextTotal = Math.max(0, prev.pagination.total - 1)

          return {
            ...prev,
            articles: nextItems,
            pagination: {
              ...prev.pagination,
              total: nextTotal,
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ['admin-articles', deletedId] })
      await queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      await queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}
