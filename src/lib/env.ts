function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback
  return value.toLowerCase() === 'true'
}

export const appEnv = {
  appName: import.meta.env.VITE_APP_NAME || 'Tentang Dental',
  appMode: import.meta.env.VITE_APP_ENV || 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  storageBaseUrl:
    import.meta.env.VITE_STORAGE_BASE_URL || 'http://127.0.0.1:8000/storage',
  apiTimeoutMs: toNumber(import.meta.env.VITE_API_TIMEOUT_MS, 15000),
  authTokenKey:
    import.meta.env.VITE_AUTH_TOKEN_KEY || 'tentangdental_admin_token',
  authUserKey: import.meta.env.VITE_AUTH_USER_KEY || 'tentangdental_admin_user',
  defaultPerPage: toNumber(import.meta.env.VITE_DEFAULT_PER_PAGE, 10),
  enableApiLog: toBool(import.meta.env.VITE_ENABLE_API_LOG, false),
}
