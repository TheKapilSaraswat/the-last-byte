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
const MAX_BATCH = 40
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

function readVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY)
    if (existing && existing.length >= 8) return existing
    const created = randomId()
    window.localStorage.setItem(VISITOR_KEY, created)
    return created
  } catch {
    // localStorage unavailable (private mode / blocked) — use an ephemeral id
    // that lasts for this page view only.
    return randomId()
  }
}

function readUtm(): Pick<QueuedEvent, 'utmSource' | 'utmMedium' | 'utmCampaign'> {
  const empty = { utmSource: null, utmMedium: null, utmCampaign: null }
  try {
    const params = new URLSearchParams(window.location.search)
    return {
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
    }
  } catch {
    return empty
  }
}

class Analytics {
  private visitorId: string
  private utm: Pick<QueuedEvent, 'utmSource' | 'utmMedium' | 'utmCampaign'>
  private referrer: string | null
  private queue: QueuedEvent[] = []
  private timer: number | null = null
  private listenersBound = false

  constructor() {
    this.visitorId = readVisitorId()
    this.utm = readUtm()
    this.referrer = typeof document !== 'undefined' ? document.referrer || null : null
  }

  get enabled(): boolean {
    return endpoint() !== null
  }

  /**
   * Record an event. Silent and safe to call anywhere; does nothing when
   * analytics is not configured.
   */
  track(name: AnalyticsEventName, options: TrackOptions = {}): void {
    if (!this.enabled) return
    this.bindLifecycle()

    let path: string | null = null
    try {
      path = window.location.pathname + window.location.hash
    } catch {
      path = null
    }

    this.queue.push({
      visitorId: this.visitorId,
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
    const url = endpoint()
    if (!url || this.queue.length === 0) return
    const batch = this.queue.slice(0, 50)
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
  singleton ??= new Analytics()
  return singleton
}

/** Convenience: track a single event without holding a reference. */
export function track(name: AnalyticsEventName, options?: TrackOptions): void {
  analytics().track(name, options)
}
