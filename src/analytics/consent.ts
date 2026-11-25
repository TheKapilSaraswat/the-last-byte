export type AnalyticsConsent = 'granted' | 'denied'

const CONSENT_KEY = 'tlb_analytics_consent'
const VISITOR_KEY = 'tlb_vid'

let consentInMemory: AnalyticsConsent | null = null
let memoryOptOut = false
const listeners = new Set<() => void>()

function parseConsent(value: string | null): AnalyticsConsent | null {
  return value === 'granted' || value === 'denied' ? value : null
}

function notify(): void {
  for (const listener of listeners) listener()
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (memoryOptOut) return 'denied'
  if (consentInMemory) return consentInMemory
  try {
    const value = parseConsent(window.localStorage.getItem(CONSENT_KEY))
    consentInMemory = value
    return value
  } catch {
    return null
  }
}

export function setAnalyticsConsent(value: AnalyticsConsent): boolean {
  consentInMemory = value
  memoryOptOut = value === 'denied'
  let visitorCleared = true

  if (value === 'denied') {
    try {
      window.localStorage.removeItem(VISITOR_KEY)
    } catch {
      visitorCleared = false
    }
  }

  let persisted = false
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
    persisted = true
  } catch {
    persisted = false
  }

  notify()
  return persisted && visitorCleared
}

export function resetAnalyticsConsent(): boolean {
  consentInMemory = null
  memoryOptOut = false
  let cleared = true
  try {
    window.localStorage.removeItem(CONSENT_KEY)
    window.localStorage.removeItem(VISITOR_KEY)
  } catch {
    cleared = false
  }
  notify()
  return cleared
}

export function subscribeAnalyticsConsent(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
