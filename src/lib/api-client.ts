import { getStoredToken } from '@/lib/auth-storage'
import { appEnv } from '@/lib/env'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonObject | JsonArray
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

export interface ApiRequestOptions {
  method?: HttpMethod
  auth?: boolean
  token?: string
  headers?: Record<string, string>
  body?: JsonObject | FormData
  timeoutMs?: number
}

type ApiEnvelope<T> = {
  success?: boolean
  data?: T
  message?: string
}

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(status: number, message: string, payload: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, '')
  const cleanPath = path.replace(/^\/+/, '')
  return cleanBase + '/' + cleanPath
}

function isEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return typeof value === 'object' && value !== null && 'success' in value
}

function parseMessage(status: number, payload: unknown): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof (payload as { message?: unknown }).message === 'string'
  ) {
    return String((payload as { message: string }).message)
  }

  if (status === 401) return 'Unauthorized'
  if (status === 403) return 'Forbidden'
  if (status === 404) return 'Not found'
  if (status === 422) return 'Validation failed'
  if (status >= 500) return 'Server error'
  return 'Request failed'
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const method = options.method || 'GET'
  const shouldAuth = options.auth !== false
  const timeoutMs = options.timeoutMs || appEnv.apiTimeoutMs
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(function () {
    controller.abort()
  }, timeoutMs)

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  const token = options.token || getStoredToken()
  if (shouldAuth && token) {
    headers.Authorization = 'Bearer ' + token
  }

  let body: BodyInit | undefined

  if (options.body instanceof FormData) {
    body = options.body
  } else if (options.body) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.body)
  }

  const url = joinUrl(appEnv.apiBaseUrl, path)

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    })

    const text = await response.text()
    const payload: unknown = text ? JSON.parse(text) : null

    if (!response.ok) {
      throw new ApiError(
        response.status,
        parseMessage(response.status, payload),
        payload,
      )
    }

    if (payload === null) {
      return null as T
    }

    if (isEnvelope(payload)) {
      return (payload.data as T) ?? (null as T)
    }

    return payload as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout', null)
    }

    throw new ApiError(0, 'Network error', error)
  } finally {
    globalThis.clearTimeout(timeoutId)
  }
}
