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

export type AdminArticleItem = {
  id: number
  title: string
  slug: string
  content: string
  image_url: string | null
  writer: string
  created_at: string
  updated_at: string
}

export type AdminArticlePagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateAdminArticlePayload = {
  title: string
  content: string
  image: File
}

export type UpdateAdminArticlePayload = {
  id: number
  title?: string
  content?: string
  image?: File | null
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

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetailApiItem | null> {
  const response = await apiRequest<ArticleDetailApiItem>(`articles/${slug}`, {
    method: 'GET',
    auth: false,
  })
  return response
}

export async function getAdminArticles(): Promise<{
  articles: AdminArticleItem[]
  pagination: AdminArticlePagination
}> {
  const response = await apiRequest<{
    articles: AdminArticleItem[]
    pagination: AdminArticlePagination
  }>('admin/articles', {
    method: 'GET',
    auth: true,
  })

  return {
    articles: Array.isArray(response?.articles) ? response.articles : [],
    pagination: {
      current_page: Number(response?.pagination?.current_page || 1),
      last_page: Number(response?.pagination?.last_page || 1),
      per_page: Number(response?.pagination?.per_page || 10),
      total: Number(response?.pagination?.total || 0),
    },
  }
}

export async function getAdminArticleById(
  id: number,
): Promise<AdminArticleItem> {
  return apiRequest<AdminArticleItem>(`admin/articles/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function createAdminArticle(
  payload: CreateAdminArticlePayload,
): Promise<AdminArticleItem> {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('content', payload.content)
  formData.append('image', payload.image)

  return apiRequest<AdminArticleItem>('admin/articles', {
    method: 'POST',
    auth: true,
    body: formData,
  })
}

export async function updateAdminArticle(
  payload: UpdateAdminArticlePayload,
): Promise<AdminArticleItem> {
  const formData = new FormData()
  if (payload.title !== undefined) formData.append('title', payload.title)
  if (payload.content !== undefined) formData.append('content', payload.content)
  if (payload.image) formData.append('image', payload.image)

  return apiRequest<AdminArticleItem>(`admin/articles/${payload.id}`, {
    method: 'PUT',
    auth: true,
    body: formData,
  })
}

export async function deleteAdminArticle(id: number): Promise<null> {
  return apiRequest<null>(`admin/articles/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
