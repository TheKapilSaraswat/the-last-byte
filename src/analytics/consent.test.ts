import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function fakeStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size
    },
  }
}

describe('analytics consent', () => {
  let storage: Storage

  beforeEach(() => {
    vi.resetModules()
    storage = fakeStorage() as Storage
    vi.stubGlobal('window', { localStorage: storage })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('persists granted and denied choices', async () => {
    const consent = await import('./consent')
    expect(consent.setAnalyticsConsent('granted')).toBe(true)
    expect(consent.getAnalyticsConsent()).toBe('granted')
    expect(storage.getItem('tlb_analytics_consent')).toBe('granted')

    expect(consent.setAnalyticsConsent('denied')).toBe(true)
    expect(consent.getAnalyticsConsent()).toBe('denied')
    expect(storage.getItem('tlb_vid')).toBeNull()
  })

  it('resets a saved choice so the banner can be shown again', async () => {
    const consent = await import('./consent')
    consent.setAnalyticsConsent('denied')
    storage.setItem('tlb_vid', 'stale')

    expect(consent.resetAnalyticsConsent()).toBe(true)
    expect(consent.getAnalyticsConsent()).toBeNull()
    expect(storage.getItem('tlb_analytics_consent')).toBeNull()
    expect(storage.getItem('tlb_vid')).toBeNull()
  })

  it('notifies subscribers when consent changes', async () => {
    const consent = await import('./consent')
    const listener = vi.fn()
    consent.subscribeAnalyticsConsent(listener)

    consent.setAnalyticsConsent('granted')
    consent.resetAnalyticsConsent()

    expect(listener).toHaveBeenCalledTimes(2)
  })
})
