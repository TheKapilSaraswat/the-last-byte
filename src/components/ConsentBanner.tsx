import { useEffect, useState } from 'react'
import { analytics } from '../analytics/analytics'
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  type AnalyticsConsent,
} from '../analytics/consent'

export function ConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent())

  useEffect(
    () => subscribeAnalyticsConsent(() => setConsent(getAnalyticsConsent())),
    [],
  )

  if (consent !== null) return null

  function decide(value: AnalyticsConsent) {
    setAnalyticsConsent(value)
    if (value === 'granted') analytics().trackPageView()
  }

  return (
    <aside
      role="region"
      aria-label="Analytics consent"
      aria-describedby="analytics-consent-copy"
      className="fixed inset-x-0 bottom-0 z-[90] border-t"
      style={{ borderColor: 'var(--c-line-strong)', background: 'var(--c-surface)' }}
    >
      <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="analytics-consent-copy" className="max-w-3xl text-xs leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
          We use anonymous first-party analytics to see which parts of the site are useful. No
          advertising or analytics cookies and no third-party tracking scripts. Your choice is
          stored only in this browser; see our{' '}
          <a href="/privacy" className="link-underline" style={{ color: 'var(--c-ink)' }}>
            privacy policy
          </a>
          .
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" className="btn btn-outline" onClick={() => decide('denied')}>
            Decline
          </button>
          <button type="button" className="btn btn-primary" onClick={() => decide('granted')}>
            Accept
          </button>
        </div>
      </div>
    </aside>
  )
}
