/**
 * Shared types for the admin dashboard, mirroring the backend's public JSON
 * shapes (services, not database rows). Keep these in sync with the API.
 */

export type AdminRole = 'owner' | 'admin' | 'viewer'

export interface AdminUser {
  id: string
  email: string
  displayName: string
  role: AdminRole
}

export interface AdminSession {
  admin: AdminUser
  csrfToken: string
  expiresAt: string
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

export interface StatusCount<T extends string> {
  status: T
  count: number
}

export interface AdminOverview {
  enquiries: {
    total: number
    last30Days: number
    byStatus: StatusCount<LeadStatus>[]
  }
  followUps: { open: number; overdue: number }
  quotes: { total: number; byStatus: StatusCount<QuoteStatus>[] }
  pricing: { activePlans: number; activeDiscounts: number }
  analytics: {
    pageViews: number
    visitors: number
    ctaClicks: number
    from: string
    to: string
  }
}

/* -------------------------------------------------------------------------- */
/* Pricing                                                                    */
/* -------------------------------------------------------------------------- */

export interface PlanDiscount {
  planId: string
  enabled: boolean
  percent: number
  label: string | null
  startsAt: string | null
  expiresAt: string | null
  updatedAt: string
  updatedBy: string | null
}

export interface PricingPlan {
  id: string
  serviceId: string
  planKey: string
  name: string | null
  pricePaise: number | null
  pricePrefix: string | null
  listLabel: string
  features: string[]
  isActive: boolean
  sortOrder: number
  updatedAt: string
  discount: PlanDiscount | null
}

/* -------------------------------------------------------------------------- */
/* CRM                                                                        */
/* -------------------------------------------------------------------------- */

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'quoted',
  'won',
  'lost',
  'archived',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
}

export type EmailStatus = 'pending' | 'sent' | 'failed'

export interface EnquiryListItem {
  id: string
  name: string
  business: string | null
  contact: string
  service: string
  budget: string | null
  details: string
  createdAt: string
  leadStatus: LeadStatus
  emailStatus: EmailStatus
  openFollowUps: number
}

export interface LeadNote {
  id: string
  enquiryId: string
  authorId: string | null
  body: string
  createdAt: string
}

export interface FollowUp {
  id: string
  enquiryId: string
  dueAt: string
  note: string | null
  completedAt: string | null
  createdBy: string | null
  createdAt: string
}

export interface EnquiryDetail extends EnquiryListItem {
  emailError: string | null
  notes: LeadNote[]
  followUps: FollowUp[]
}

/* -------------------------------------------------------------------------- */
/* Quotations                                                                 */
/* -------------------------------------------------------------------------- */

export const QUOTE_STATUSES = ['draft', 'sent', 'accepted', 'declined', 'expired'] as const

export type QuoteStatus = (typeof QUOTE_STATUSES)[number]

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
}

export interface QuoteItem {
  id: string
  quoteId: string
  description: string
  quantity: number
  unitPricePaise: number
  lineTotalPaise: number
  planId: string | null
}

export interface Quote {
  id: string
  reference: string
  enquiryId: string | null
  customerName: string
  customerBusiness: string | null
  customerContact: string | null
  status: QuoteStatus
  currency: string
  items: QuoteItem[]
  subtotalPaise: number
  discountPaise: number
  taxPercent: number
  taxPaise: number
  totalPaise: number
  notes: string | null
  validUntil: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

/* -------------------------------------------------------------------------- */
/* Analytics                                                                  */
/* -------------------------------------------------------------------------- */

export interface AnalyticsDailyPoint {
  date: string
  pageViews: number
  visitors: number
}

export interface AnalyticsCount {
  key: string
  count: number
}

export interface AnalyticsFunnel {
  opened: number
  started: number
  submitted: number
  failed: number
}

export interface AnalyticsSummary {
  totals: {
    events: number
    pageViews: number
    visitors: number
    ctaClicks: number
    serviceViews: number
  }
  daily: AnalyticsDailyPoint[]
  topPages: AnalyticsCount[]
  topServices: AnalyticsCount[]
  eventCounts: AnalyticsCount[]
  funnel: AnalyticsFunnel
}
