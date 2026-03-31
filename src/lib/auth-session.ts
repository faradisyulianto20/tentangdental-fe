import { ApiError } from '@/lib/api-client'
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} from '@/lib/auth-api'
import {
  clearStoredSession,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '@/lib/auth-storage'
import type { AuthSnapshot, LoginPayload } from '@/types/auth'

let snapshot: AuthSnapshot = {
  initialized: false,
  status: 'unknown',
  token: null,
  user: null,
}

let bootPromise: Promise<AuthSnapshot> | null = null
const listeners = new Set<() => void>()

function emit(): void {
  for (const listener of listeners) listener()
}

function setSnapshot(next: AuthSnapshot): AuthSnapshot {
  snapshot = next
  emit()
  return snapshot
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener)
  return function () {
    listeners.delete(listener)
  }
}

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot
}

async function resolveSessionFromToken(token: string): Promise<AuthSnapshot> {
  try {
    const user = await getCurrentAdmin(token)
    setStoredToken(token)
    setStoredUser(user)

    return setSnapshot({
      initialized: true,
      status: 'authenticated',
      token,
      user,
    })
  } catch (error) {
    const apiError = error instanceof ApiError ? error : null

    if (apiError && apiError.status === 401) {
      const nextToken = await refreshAdminToken(token)
      const user = await getCurrentAdmin(nextToken)

      setStoredToken(nextToken)
      setStoredUser(user)

      return setSnapshot({
        initialized: true,
        status: 'authenticated',
        token: nextToken,
        user,
      })
    }

    clearStoredSession()
    return setSnapshot({
      initialized: true,
      status: 'guest',
      token: null,
      user: null,
    })
  }
}

export async function initializeAuth(): Promise<AuthSnapshot> {
  if (snapshot.initialized) return snapshot
  if (bootPromise) return bootPromise

  bootPromise = (async function () {
    const token = getStoredToken()
    const user = getStoredUser()

    if (!token) {
      return setSnapshot({
        initialized: true,
        status: 'guest',
        token: null,
        user: null,
      })
    }

    const next = await resolveSessionFromToken(token)

    if (next.status === 'authenticated' && !next.user && user) {
      return setSnapshot({
        initialized: true,
        status: 'authenticated',
        token: next.token,
        user,
      })
    }

    return next
  })()

  try {
    return await bootPromise
  } finally {
    bootPromise = null
  }
}

export async function loginWithPassword(
  payload: LoginPayload,
): Promise<AuthSnapshot> {
  const result = await loginAdmin(payload)
  setStoredToken(result.token)
  setStoredUser(result.user)

  return setSnapshot({
    initialized: true,
    status: 'authenticated',
    token: result.token,
    user: result.user,
  })
}

export async function logoutCurrentAdmin(): Promise<void> {
  const token = snapshot.token || getStoredToken()

  try {
    if (token) {
      await logoutAdmin(token)
    }
  } finally {
    clearStoredSession()
    setSnapshot({
      initialized: true,
      status: 'guest',
      token: null,
      user: null,
    })
  }
}
