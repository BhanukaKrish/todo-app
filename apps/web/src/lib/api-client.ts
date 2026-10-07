import type { ApiErrorBody } from '@todo/shared'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number
  readonly errors: string[]

  constructor(status: number, message: string, errors: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'Something unexpected happened. Please try again.'
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    })
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.")
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as Partial<ApiErrorBody> | null
    throw new ApiError(
      response.status,
      body?.message ?? `Request failed (${response.status})`,
      body?.errors,
    )
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
