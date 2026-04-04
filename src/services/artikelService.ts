import { apiRequest } from '#/lib/api-client'

export type ArticlePagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ArticleApiItem = {
  id: string
  title: string
  slug: string
  image_url: string | null
  writer: string
  published_at: string
  published_at_full: string
}

export type ArticleDetailApiItem = {
  id: string
  title: string
  slug: string
  image_url: string | null
  writer: string
  published_at: string
  published_at_full: string
  content: string
}

export async function getArticles(): Promise<ArticleApiItem[]> {
  const response = await apiRequest<{
    articles: ArticleApiItem[]
    pagination: ArticlePagination
  }>('articles', {
    method: 'GET',
    auth: false,
  })
  return response?.articles ?? []
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetailApiItem | null> {
  const response = await apiRequest<ArticleDetailApiItem>(`articles/${slug}`, {
    method: 'GET',
    auth: false,
  })
  return response
}