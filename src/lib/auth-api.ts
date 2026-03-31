import { apiRequest, ApiError } from '@/lib/api-client'
import type { AdminUser, LoginPayload } from '@/types/auth'

type LoginApiData = {
  token?: string
  access_token?: string
  admin?: Record<string, unknown>
  user?: Record<string, unknown>
}

type RefreshApiData = {
  token?: string
  access_token?: string
}

function normalizeUser(input: Record<string, unknown>): AdminUser {
  return {
    id: Number(input.id || 0),
    name: String(input.name || ''),
    email: String(input.email || ''),
    role: String(input.role || 'registration'),
    avatarUrl:
      typeof input.avatarUrl === 'string'
        ? input.avatarUrl
        : typeof input.profile_photo_url === 'string'
          ? input.profile_photo_url
          : null,
  }
}

function pickToken(data: LoginApiData | RefreshApiData): string | null {
  if (typeof data.token === 'string' && data.token.length > 0) return data.token
  if (typeof data.access_token === 'string' && data.access_token.length > 0) {
    return data.access_token
  }

  return null
}

export async function loginAdmin(payload: LoginPayload): Promise<{
  token: string
  user: AdminUser
}> {
  const data = await apiRequest<LoginApiData>('admin/login', {
    method: 'POST',
    auth: false,
    body: {
      email: payload.email,
      password: payload.password,
    },
  })

  const token = pickToken(data)
  const rawUser = (data.admin || data.user) as
    | Record<string, unknown>
    | undefined

  if (!token || !rawUser) {
    throw new ApiError(500, 'Invalid login response format', data)
  }

  return {
    token,
    user: normalizeUser(rawUser),
  }
}

export async function getCurrentAdmin(token?: string): Promise<AdminUser> {
  const data = await apiRequest<Record<string, unknown>>('admin/me', {
    method: 'GET',
    auth: true,
    token,
  })

  return normalizeUser(data)
}

export async function refreshAdminToken(token?: string): Promise<string> {
  const data = await apiRequest<RefreshApiData>('admin/refresh', {
    method: 'POST',
    auth: true,
    token,
  })

  const nextToken = pickToken(data)
  if (!nextToken) {
    throw new ApiError(500, 'Invalid refresh response format', data)
  }

  return nextToken
}

export async function logoutAdmin(token?: string): Promise<void> {
  await apiRequest<unknown>('admin/logout', {
    method: 'POST',
    auth: true,
    token,
  })
}
