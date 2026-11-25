/**
 * Admin API client.
 *
 * The session lives in an HttpOnly cookie, so every request uses
 * `credentials: 'include'`. State-changing requests also echo the session's
 * CSRF token in `X-CSRF-Token`; the token is held in memory and refreshed from
 * the login and session responses (never persisted to storage).
 */

import { siteConfig } from '../config/site'
import type {
  AdminOverview,
  AdminSession,
  AnalyticsSummary,
  EnquiryDetail,
  EnquiryListItem,
  FollowUp,
  LeadNote,
  LeadStatus,
  PricingPlan,
  Quote,
  QuoteStatus,
} from './types'

export class ApiError extends Error {
  status: number
  fields?: Record<string, string>

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

let csrfToken: string | null = null

const LOGIN_ERROR_MESSAGES: Record<number, string> = {
  401: 'The email or password is incorrect.',
}

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Please check the information you entered.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'That item could not be found.',
  409: 'That change conflicts with the current record.',
  413: 'The request is too large.',
  422: 'Please check the information you entered.',
  429: 'Too many attempts. Please try again shortly.',
  500: 'The server could not complete the request.',
  502: 'The server is temporarily unavailable.',
  503: 'The server is temporarily unavailable.',
  504: 'The server took too long to respond.',
}

function sanitizedFields(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const result: Record<string, string> = {}
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== 'string') continue
    const message = Array.from(entry)
      .map((character) => {
        const code = character.charCodeAt(0)
        return code < 32 || code === 127 ? ' ' : character
      })
      .join('')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 160)
    if (message) result[key] = message
  }
  return Object.keys(result).length ? result : undefined
}

function safeErrorMessage(
  status: number,
  fields?: Record<string, string>,
  messages: Record<number, string> = ERROR_MESSAGES,
): string {
  const base = messages[status] ?? ERROR_MESSAGES[status] ?? 'The request could not be completed.'
  if (!fields) return base
  const details = Object.values(fields).slice(0, 3)
  return details.length ? `${base} ${details.join(' ')}` : base
}

function setCsrfToken(token: string | null): void {
  csrfToken = token
}

export function clearAdminCredentials(): void {
  setCsrfToken(null)
}

/** True when an API base URL has been configured at build time. */
export function adminApiConfigured(): boolean {
  return siteConfig.apiBaseUrl.length > 0
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Treat these status codes as a null result instead of throwing. */
  allow?: number[]
  errorMessages?: Record<number, string>
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T | null> {
  const method = options.method ?? 'GET'
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken

  const response = await fetch(`${siteConfig.apiBaseUrl}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    if (response.status === 401) setCsrfToken(null)
    if (options.allow?.includes(response.status)) return null
    const body = data as { fields?: unknown } | null
    const fields = sanitizedFields(body?.fields)
    throw new ApiError(
      safeErrorMessage(response.status, fields, options.errorMessages),
      response.status,
      fields,
    )
  }

  return data as T
}

export const adminApi = {
  /** Describe the current session, or null when not signed in. */
  async session(): Promise<AdminSession | null> {
    const data = await request<AdminSession & { ok: boolean }>('/api/admin/session', {
      allow: [401],
    })
    if (!data || !data.ok) return null
    setCsrfToken(data.csrfToken)
    return { admin: data.admin, csrfToken: data.csrfToken, expiresAt: data.expiresAt }
  },

  async login(
    email: string,
    password: string,
  ): Promise<{ admin: AdminSession['admin']; csrfToken: string }> {
    const data = await request<{
      ok: boolean
      admin: AdminSession['admin']
      csrfToken: string
      expiresAt: string
    }>('/api/admin/login', {
      method: 'POST',
      body: { email, password },
      errorMessages: LOGIN_ERROR_MESSAGES,
    })
    if (!data || !data.ok) throw new ApiError('Sign in did not complete.', 500)
    setCsrfToken(data.csrfToken)
    return { admin: data.admin, csrfToken: data.csrfToken }
  },

  async logout(): Promise<void> {
    await request('/api/admin/logout', { method: 'POST' })
    setCsrfToken(null)
  },

  async overview(): Promise<AdminOverview> {
    const data = await request<{ ok: boolean; overview: AdminOverview }>('/api/admin/overview')
    if (!data) throw new ApiError('Could not load overview.', 500)
    return data.overview
  },

  /* Pricing -------------------------------------------------------------- */

  async pricingPlans(): Promise<PricingPlan[]> {
    const data = await request<{ ok: boolean; plans: PricingPlan[] }>('/api/admin/pricing')
    return data?.plans ?? []
  },

  async updatePlanPrice(
    planId: string,
    input: { pricePaise: number | null; isActive: boolean },
  ): Promise<PricingPlan> {
    const data = await request<{ ok: boolean; plan: PricingPlan }>(
      `/api/admin/pricing/plans/${planId}`,
      { method: 'PUT', body: input },
    )
    if (!data) throw new ApiError('Could not update the plan.', 500)
    return data.plan
  },

  async updateDiscount(
    planId: string,
    input: {
      enabled: boolean
      percent: number
      label: string | null
      startsAt: string | null
      expiresAt: string | null
    },
  ): Promise<void> {
    await request(`/api/admin/pricing/plans/${planId}/discount`, {
      method: 'PUT',
      body: input,
    })
  },

  /* CRM ------------------------------------------------------------------ */

  async enquiries(
    query: { status?: LeadStatus; search?: string; limit?: number; offset?: number } = {},
  ): Promise<{ enquiries: EnquiryListItem[]; total: number }> {
    const params = new URLSearchParams()
    if (query.status) params.set('status', query.status)
    if (query.search) params.set('search', query.search)
    if (query.limit) params.set('limit', String(query.limit))
    if (query.offset) params.set('offset', String(query.offset))
    const suffix = params.toString() ? `?${params.toString()}` : ''
    const data = await request<{ ok: boolean; enquiries: EnquiryListItem[]; total: number }>(
      `/api/admin/enquiries${suffix}`,
    )
    return { enquiries: data?.enquiries ?? [], total: data?.total ?? 0 }
  },

  async enquiry(id: string): Promise<EnquiryDetail> {
    const data = await request<{ ok: boolean; enquiry: EnquiryDetail }>(
      `/api/admin/enquiries/${id}`,
    )
    if (!data) throw new ApiError('Could not load the enquiry.', 500)
    return data.enquiry
  },

  async setLeadStatus(id: string, leadStatus: LeadStatus): Promise<EnquiryDetail> {
    const data = await request<{ ok: boolean; enquiry: EnquiryDetail }>(
      `/api/admin/enquiries/${id}`,
      { method: 'PATCH', body: { leadStatus } },
    )
    if (!data) throw new ApiError('Could not update the status.', 500)
    return data.enquiry
  },

  async addNote(id: string, body: string): Promise<LeadNote> {
    const data = await request<{ ok: boolean; note: LeadNote }>(
      `/api/admin/enquiries/${id}/notes`,
      { method: 'POST', body: { body } },
    )
    if (!data) throw new ApiError('Could not add the note.', 500)
    return data.note
  },

  async addFollowUp(id: string, dueAt: string, note: string | null): Promise<FollowUp> {
    const data = await request<{ ok: boolean; followUp: FollowUp }>(
      `/api/admin/enquiries/${id}/follow-ups`,
      { method: 'POST', body: { dueAt, note } },
    )
    if (!data) throw new ApiError('Could not add the follow-up.', 500)
    return data.followUp
  },

  async completeFollowUp(id: string): Promise<FollowUp> {
    const data = await request<{ ok: boolean; followUp: FollowUp }>(
      `/api/admin/follow-ups/${id}`,
      { method: 'PATCH' },
    )
    if (!data) throw new ApiError('Could not complete the follow-up.', 500)
    return data.followUp
  },

  /* Quotes --------------------------------------------------------------- */

  async quotes(
    query: { status?: QuoteStatus; limit?: number; offset?: number } = {},
  ): Promise<{ quotes: Quote[]; total: number }> {
    const params = new URLSearchParams()
    if (query.status) params.set('status', query.status)
    if (query.limit) params.set('limit', String(query.limit))
    if (query.offset) params.set('offset', String(query.offset))
    const suffix = params.toString() ? `?${params.toString()}` : ''
    const data = await request<{ ok: boolean; quotes: Quote[]; total: number }>(
      `/api/admin/quotes${suffix}`,
    )
    return { quotes: data?.quotes ?? [], total: data?.total ?? 0 }
  },

  async createQuote(input: {
    enquiryId?: string | null
    customerName: string
    customerBusiness?: string | null
    customerContact?: string | null
    items: { description: string; quantity: number; unitPricePaise: number; planId?: string | null }[]
    discountPaise?: number
    taxPercent?: number
    notes?: string | null
    validUntil?: string | null
  }): Promise<Quote> {
    const data = await request<{ ok: boolean; quote: Quote }>('/api/admin/quotes', {
      method: 'POST',
      body: input,
    })
    if (!data) throw new ApiError('Could not create the quotation.', 500)
    return data.quote
  },

  async setQuoteStatus(id: string, status: QuoteStatus): Promise<Quote> {
    const data = await request<{ ok: boolean; quote: Quote }>(`/api/admin/quotes/${id}`, {
      method: 'PATCH',
      body: { status },
    })
    if (!data) throw new ApiError('Could not update the quotation.', 500)
    return data.quote
  },

  /* Analytics ------------------------------------------------------------ */

  async analytics(range: { from?: string; to?: string } = {}): Promise<{
    summary: AnalyticsSummary
    from: string
    to: string
    retentionDays: number
  }> {
    const params = new URLSearchParams()
    if (range.from) params.set('from', range.from)
    if (range.to) params.set('to', range.to)
    const suffix = params.toString() ? `?${params.toString()}` : ''
    const data = await request<{
      ok: boolean
      from: string
      to: string
      retentionDays: number
      summary: AnalyticsSummary
    }>(`/api/admin/analytics${suffix}`)
    if (!data) throw new ApiError('Could not load analytics.', 500)
    return {
      summary: data.summary,
      from: data.from,
      to: data.to,
      retentionDays: data.retentionDays,
    }
  },
}

/** Pull a human-readable message out of an unknown error. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}
