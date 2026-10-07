import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest, ApiError, getErrorMessage } from './api-client'

const mockFetch = (impl: () => Promise<Response>) => vi.stubGlobal('fetch', vi.fn(impl))

describe('apiRequest', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns parsed JSON on success', async () => {
    mockFetch(async () => Response.json([{ id: '1' }]))
    await expect(apiRequest('/todos')).resolves.toEqual([{ id: '1' }])
  })

  it('returns undefined for 204 responses', async () => {
    mockFetch(async () => new Response(null, { status: 204 }))
    await expect(apiRequest('/todos/1')).resolves.toBeUndefined()
  })

  it('surfaces the server error message', async () => {
    mockFetch(async () =>
      Response.json({ statusCode: 400, message: 'Title is required' }, { status: 400 }),
    )
    const error = await apiRequest('/todos').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 400, message: 'Title is required' })
  })

  it('maps network failures to a friendly message', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    const error = await apiRequest('/todos').catch((e: unknown) => e)
    expect(getErrorMessage(error)).toMatch(/can't reach the server/i)
  })
})
