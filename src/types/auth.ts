export type AdminRole =
  | 'registration'
  | 'rontgen'
  | 'registration,rontgen'
  | string

export interface AdminUser {
  id: number
  name: string
  email: string
  role: AdminRole
  avatarUrl?: string | null
}

export type AuthStatus = 'unknown' | 'authenticated' | 'guest'

export interface AuthSnapshot {
  initialized: boolean
  status: AuthStatus
  token: string | null
  user: AdminUser | null
}

export interface LoginPayload {
  email: string
  password: string
}
