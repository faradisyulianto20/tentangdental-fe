import { useSyncExternalStore } from 'react'
import { getAuthSnapshot, subscribeAuth } from '@/lib/auth-session'

export function useAuth() {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthSnapshot)
}
