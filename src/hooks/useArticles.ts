import { useQuery } from '@tanstack/react-query'
import { getArticleBySlug, getArticles } from '@/services/articlesService'

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
    staleTime: 1000 * 60 * 5,
  })
}
