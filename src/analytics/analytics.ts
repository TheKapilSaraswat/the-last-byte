/**
 * ============================================================================
 *  FIRST-PARTY ANALYTICS
 *  ---------------------------------------------------------------------------
 *  A tiny, dependency-free, privacy-respecting event tracker. It sends small
 *  batches of anonymous events to our own backend (`/api/analytics/events`).
 *
 *  Principles:
 *   - No third-party scripts, no cookies for tracking, no personal data.
 *   - A random, pseudonymous visitor id is kept in localStorage purely to
 *     distinguish visitors for aggregate counts. It is not tied to an account.
 *   - Everything is best-effort: failures are swallowed so analytics can never
 *     break the site or an enquiry submission.
 *   - Disabled entirely when no API base URL is configured.
 * ============================================================================
 */

import { siteConfig } from '../config/site'
import { getAnalyticsConsent, subscribeAnalyticsConsent } from './consent'

/** Event names accepted by the analytics ingestion endpoint. */
export type AnalyticsEventName =
  | 'page_view'
  | 'service_view'
  | 'package_view'
  | 'cta_click'
  | 'enquiry_open'
  | 'enquiry_start'
  | 'enquiry_submit'
  | 'enquiry_validation_failure'
  | 'enquiry_submission_failure'
  | 'nav_click'
  | 'outbound_click'

interface QueuedEvent {
  visitorId: string
  name: AnalyticsEventName
  path: string | null
  service: string | null
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  occurredAt: string
}

export interface TrackOptions {
  /** Service id the event relates to, e.g. 'websites'. */
  service?: string
}

const VISITOR_KEY = 'tlb_vid'
const OPTOUT_KEY = 'tlb_analytics_optout'
const VISITOR_TTL_MS = 180 * 24 * 60 * 60 * 1000
const MAX_FIELD_LENGTH = 120
const MAX_BATCH = 20
const FLUSH_INTERVAL_MS = 4000

function endpoint(): string | null {
  if (!siteConfig.apiBaseUrl) return null
  return `${siteConfig.apiBaseUrl}/api/analytics/events`
}

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().replace(/-/g, '')
    }
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`.padEnd(32, '0').slice(0, 32)
}

interface VisitorRecord {
  id: string
  createdAt: number
}

function analyticsBlocked(): boolean {
  if (getAnalyticsConsent() !== 'granted') return true
  if (typeof navigator !== 'undefined') {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
    if (nav.doNotTrack === '1' || nav.globalPrivacyControl === true) return true
  }
  try {
    if (window.localStorage.getItem(OPTOUT_KEY) === '1') return true
  } catch {
    return false
  }
  return false
}

function readVisitorId(): VisitorRecord {
  try {
    const stored = window.localStorage.getItem(VISITOR_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<VisitorRecord>
      if (
        typeof parsed.id === 'string' &&
        parsed.id.length >= 8 &&
        typeof parsed.createdAt === 'number' &&
        Number.isFinite(parsed.createdAt) &&
        Date.now() - parsed.createdAt < VISITOR_TTL_MS
      ) {
        return { id: parsed.id, createdAt: parsed.createdAt }
      }
    }
    const record: VisitorRecord = { id: randomId(), createdAt: Date.now() }
    window.localStorage.setItem(VISITOR_KEY, JSON.stringify(record))
    return record
  } catch {
    return { id: randomId(), createdAt: Date.now() }
  }
}

function truncate(value: string | null): string | null {
  if (!value) return null
  return value.slice(0, MAX_FIELD_LENGTH)
}

function sanitizeReferrer(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return truncate(`${url.origin}${url.pathname}`)
  } catch {
    return null
  }
}

function readUtm(): Pick<QueuedEvent, 'utmSource' | 'utmMedium' | 'utmCampaign'> {
  const empty = { utmSource: null, utmMedium: null, utmCampaign: null }
  try {
    const params = new URLSearchParams(window.location.search)
    return {
      utmSource: truncate(params.get('utm_source')),
      utmMedium: truncate(params.get('utm_medium')),
      utmCampaign: truncate(params.get('utm_campaign')),
    }
  } catch {
    return empty
  }
}

class Analytics {
  private visitorId: string | null = null
  private visitorCreatedAt = 0
  private stateInitialised = false
  private utm: Pick<QueuedEvent, 'utmSource' | 'utmMedium' | 'utmCampaign'> = {
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
  }
  private referrer: string | null = null
  private queue: QueuedEvent[] = []
  private timer: number | null = null
  private listenersBound = false

  constructor() {
    if (this.enabled) this.initialiseState()
  }

  get enabled(): boolean {
    return endpoint() !== null && !analyticsBlocked()
  }

  private initialiseState(): void {
    const expired = Date.now() - this.visitorCreatedAt >= VISITOR_TTL_MS
    if (this.stateInitialised && !expired && this.visitorId) return
    const visitor = readVisitorId()
    this.visitorId = visitor.id
    this.visitorCreatedAt = visitor.createdAt
    this.stateInitialised = true
    this.utm = readUtm()
    this.referrer =
      typeof document !== 'undefined' ? sanitizeReferrer(document.referrer) : null
  }

  /**
   * Record an event. Silent and safe to call anywhere; does nothing when
   * analytics is not configured.
   */
  track(name: AnalyticsEventName, options: TrackOptions = {}): void {
    if (!this.enabled) return
    this.initialiseState()
    const visitorId = this.visitorId
    if (!visitorId) return
    this.bindLifecycle()

    let path: string | null = null
    try {
      path = window.location.pathname
    } catch {
      path = null
    }

    this.queue.push({
      visitorId,
      name,
      path,
      service: options.service ?? null,
      referrer: this.referrer,
      ...this.utm,
      occurredAt: new Date().toISOString(),
    })

    // First event of the visit carries the referrer; later ones need not repeat
    // it, but repeating is harmless and keeps the server logic simple.
    this.referrer = null

    if (this.queue.length >= MAX_BATCH) {
      void this.flush()
    } else {
      this.schedule()
    }
  }

  /** Record a page view for the current location. */
  trackPageView(): void {
    this.track('page_view')
  }

  reset(): void {
    this.queue = []
    if (this.timer !== null) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
    this.visitorId = null
    this.visitorCreatedAt = 0
    this.stateInitialised = false
    this.referrer = null
    this.utm = { utmSource: null, utmMedium: null, utmCampaign: null }
  }

  private schedule(): void {
    if (this.timer !== null) return
    this.timer = window.setTimeout(() => {
      this.timer = null
      void this.flush()
    }, FLUSH_INTERVAL_MS)
  }

  private bindLifecycle(): void {
    if (this.listenersBound) return
    this.listenersBound = true
    const onHidden = () => {
      if (document.visibilityState === 'hidden') void this.flush()
    }
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('pagehide', () => void this.flush())
  }

  /** Send and clear the queued events. Never throws. */
  async flush(): Promise<void> {
    if (!this.enabled) {
      this.queue = []
      if (this.timer !== null) {
        window.clearTimeout(this.timer)
        this.timer = null
      }
      return
    }
    const url = endpoint()
    if (!url || this.queue.length === 0) return
    const batch = this.queue.slice(0, MAX_BATCH)
    this.queue = this.queue.slice(batch.length)

    const body = JSON.stringify({ events: batch })
    try {
      // sendBeacon survives page unload (e.g. CTA that navigates away).
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' })
        if (navigator.sendBeacon(url, blob)) return
      }
    } catch {
      /* fall back to fetch */
    }

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'omit',
      })
    } catch {
      /* analytics is best-effort */
    }
  }
}

let singleton: Analytics | null = null

/** Access the shared analytics tracker. */
export function analytics(): Analytics {
  if (!singleton) {
    singleton = new Analytics()
    subscribeAnalyticsConsent(() => singleton?.reset())
  }
  return singleton
}

/** Convenience: track a single event without holding a reference. */
export function track(name: AnalyticsEventName, options?: TrackOptions): void {
  analytics().track(name, options)
}
