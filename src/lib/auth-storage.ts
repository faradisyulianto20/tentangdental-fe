import { appEnv } from '@/lib/env'
import type { AdminUser } from '@/types/auth'

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

export function getStoredToken(): string | null {
  if (!canUseStorage()) return null
  return localStorage.getItem(appEnv.authTokenKey)
}

export function setStoredToken(token: string): void {
  if (!canUseStorage()) return
  localStorage.setItem(appEnv.authTokenKey, token)
}

export function clearStoredToken(): void {
  if (!canUseStorage()) return
  localStorage.removeItem(appEnv.authTokenKey)
}

export function getStoredUser(): AdminUser | null {
  if (!canUseStorage()) return null

  const raw = localStorage.getItem(appEnv.authUserKey)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function setStoredUser(user: AdminUser): void {
  if (!canUseStorage()) return
  localStorage.setItem(appEnv.authUserKey, JSON.stringify(user))
}

export function clearStoredUser(): void {
  if (!canUseStorage()) return
  localStorage.removeItem(appEnv.authUserKey)
}

export function clearStoredSession(): void {
  clearStoredToken()
  clearStoredUser()
}
