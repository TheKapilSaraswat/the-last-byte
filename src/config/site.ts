/**
 * ============================================================================
 *  CENTRAL SITE CONFIGURATION
 *  ---------------------------------------------------------------------------
 *  All business contact details and integration endpoints live here. Update
 *  this single file to change them everywhere on the site.
 *
 *  IMPORTANT: Values left as empty strings are treated as "not configured".
 *  The UI will never present an unconfigured value as a real public contact,
 *  and the enquiry form will not claim a submission succeeded without a
 *  working destination.
 * ============================================================================
 */

export const siteConfig = {
  name: 'The Last Byte',
  shortName: 'TLB',
  wordmark: 'THE LAST BYTE',
  domain: 'https://thelastbyte.in',
  url: 'https://thelastbyte.in/',

  /**
   * Base URL of the enquiry API (without a trailing slash), supplied at build
   * time via VITE_API_BASE_URL, e.g. 'https://api.thelastbyte.in'. Leave empty
   * until the backend is deployed; the form then falls back to WhatsApp/email
   * or local preview.
   */
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, ''),

  tagline:
    'Website development, QR menus and digital business pages, and custom business software — practical digital tools engineered to help ambitious businesses move forward.',

  location: {
    city: 'Mathura',
    region: 'Uttar Pradesh',
    country: 'India',
    /** Short label used in technical captions across the site. */
    label: 'MATHURA, INDIA',
  },

  /**
   * Public email address. Leave empty until a real mailbox is configured,
   * e.g. 'studio@thelastbyte.in'.
   */
  email: '',

  /**
   * WhatsApp number in full international format WITHOUT '+', spaces or dashes,
   * e.g. '919812345678'. Leave empty until a real business number exists.
   */
  whatsappNumber: '',

  /** Social profiles — only rendered in the UI when a real URL is provided. */
  social: {
    instagram: '',
    linkedin: '',
  },

  /**
   * Optional form submission endpoint (e.g. a serverless function, Formspree,
   * Formspark, Getform or your own API). When set, the enquiry form POSTs
   * JSON to it. When empty, the form falls back to a WhatsApp hand-off if a
   * WhatsApp number is configured, otherwise it runs in local preview mode.
   */
  formEndpoint: '',

  /** Business hours text shown in the footer (kept general, not a claim). */
  responseTime: 'Replies usually within 1–2 business days',
} as const

export type SiteConfig = typeof siteConfig

/** True when a WhatsApp destination has been configured. */
export const hasWhatsApp = siteConfig.whatsappNumber.trim().length > 0

/** True when an email address has been configured. */
export const hasEmail = siteConfig.email.trim().length > 0

/** Build a wa.me deep link, or return null when WhatsApp is not configured. */
export function whatsappLink(message?: string): string | null {
  if (!hasWhatsApp) return null
  const base = `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Build a mailto link, or return null when email is not configured. */
export function mailtoLink(subject?: string, body?: string): string | null {
  if (!hasEmail) return null
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  return `mailto:${siteConfig.email}${query ? `?${query}` : ''}`
}

/**
 * Resolve the endpoint the enquiry form posts to, or null when neither a
 * backend API base URL nor a legacy form endpoint is configured.
 */
export function enquiriesEndpoint(): string | null {
  if (siteConfig.apiBaseUrl) return `${siteConfig.apiBaseUrl}/api/enquiries`
  const legacy = siteConfig.formEndpoint.trim()
  return legacy ? legacy : null
}
