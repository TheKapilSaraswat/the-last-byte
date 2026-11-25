import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const admin = {
  id: 'admin-1',
  email: 'owner@thelastbyte.in',
  displayName: 'Owner',
  role: 'owner' as const,
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function headers(call: unknown): Record<string, string> {
  const init = call as [string, RequestInit | undefined]
  return (init[1]?.headers ?? {}) as Record<string, string>
}

describe('admin API client', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the CSRF header after login and clears it on logout', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          ok: true,
          admin,
          csrfToken: 'csrf-1',
          expiresAt: '2026-11-26T12:00:00.000Z',
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ ok: true, enquiry: {} }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, followUp: {} }))

    const { adminApi } = await import('./api')
    await adminApi.login('owner@thelastbyte.in', 'password')
    await adminApi.setLeadStatus('enquiry-1', 'contacted')

    expect(headers(fetchMock.mock.calls[1])['X-Requested-With']).toBe('XMLHttpRequest')
    expect(headers(fetchMock.mock.calls[1])['X-CSRF-Token']).toBe('csrf-1')

    await adminApi.logout()
    expect(headers(fetchMock.mock.calls[2])['X-CSRF-Token']).toBe('csrf-1')

    await adminApi.completeFollowUp('follow-up-1')
    expect(headers(fetchMock.mock.calls[3])['X-CSRF-Token']).toBeUndefined()
  })

  it('clears the CSRF token after a 401 response', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          ok: true,
          admin,
          csrfToken: 'csrf-2',
          expiresAt: '2026-11-26T12:00:00.000Z',
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ ok: false, error: 'Unauthorized' }, 401))
      .mockResolvedValueOnce(jsonResponse({ ok: true, followUp: {} }))

    const { adminApi } = await import('./api')
    await adminApi.login('owner@thelastbyte.in', 'password')
    await expect(adminApi.overview()).rejects.toMatchObject({ status: 401 })
    await adminApi.completeFollowUp('follow-up-1')

    expect(headers(fetchMock.mock.calls[2])['X-CSRF-Token']).toBeUndefined()
  })

  it('uses a safe login-specific 401 message', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: 'Internal detail' }, 401))

    const { adminApi } = await import('./api')
    await expect(adminApi.login('owner@thelastbyte.in', 'wrong')).rejects.toMatchObject({
      status: 401,
      message: 'The email or password is incorrect.',
    })
  })

  it('clears the in-memory CSRF token on explicit reset', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          ok: true,
          admin,
          csrfToken: 'csrf-3',
          expiresAt: '2026-11-26T12:00:00.000Z',
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ ok: true, followUp: {} }))

    const { adminApi, clearAdminCredentials } = await import('./api')
    await adminApi.login('owner@thelastbyte.in', 'password')
    clearAdminCredentials()
    await adminApi.completeFollowUp('follow-up-1')

    expect(headers(fetchMock.mock.calls[1])['X-CSRF-Token']).toBeUndefined()
  })

  it('sanitizes server-supplied field errors', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          ok: false,
          error: 'Validation failed',
          fields: {
            name: { unexpected: 'object' },
            contact: ['array'],
            service: '\u0000  Bad\tvalue  \u007f',
            details: `x${' '.repeat(180)}y`,
          },
        },
        422,
      ),
    )

    const { adminApi } = await import('./api')
    await expect(adminApi.login('owner@thelastbyte.in', 'password')).rejects.toMatchObject({
      status: 422,
      fields: {
        service: 'Bad value',
        details: expect.stringMatching(/^x(?: y)?$/),
      },
    })
  })
})
