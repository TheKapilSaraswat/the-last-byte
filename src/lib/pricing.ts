import { useEffect, useState } from 'react'
import { siteConfig } from '../config/site'

export interface PublishedDiscount {
  percent: number
  label: string | null
  startsAt: string | null
  expiresAt: string | null
  /** True only when the discount is enabled and inside its date window now. */
  active: boolean
}

export interface PublishedPlan {
  serviceId: string
  planKey: string
  name: string | null
  pricePrefix: string | null
  listLabel: string
  features: string[]
  basePricePaise: number | null
  finalPricePaise: number | null
  savingsPaise: number | null
  discount: PublishedDiscount | null
}

/** Lookup key for a published plan, matching the backend's serviceId+planKey. */
export function planLookupKey(serviceId: string, planKey: string): string {
  return `${serviceId}:${planKey}`
}

/** Format integer paise as a readable Indian rupee amount. */
export function formatPaise(paise: number): string {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`
}

interface PricingResponse {
  ok?: boolean
  plans?: PublishedPlan[]
}

/**
 * Fetch the published pricing catalogue (with any live discounts applied
 * server-side). Returns an empty map when the API is not configured or the
 * request fails, in which case callers fall back to the static catalogue in
 * `data/services.ts`. Never throws.
 */
export function usePublishedPricing(): Map<string, PublishedPlan> {
  const [map, setMap] = useState<Map<string, PublishedPlan>>(() => new Map())

  useEffect(() => {
    if (!siteConfig.apiBaseUrl) return
    let cancelled = false

    fetch(`${siteConfig.apiBaseUrl}/api/pricing`, {
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    })
      .then((response) => (response.ok ? (response.json() as Promise<PricingResponse>) : null))
      .then((data) => {
        if (cancelled || !data?.ok || !Array.isArray(data.plans)) return
        const next = new Map<string, PublishedPlan>()
        for (const plan of data.plans) {
          next.set(planLookupKey(plan.serviceId, plan.planKey), plan)
        }
        setMap(next)
      })
      .catch(() => {
        /* offline or unconfigured — keep the static fallback */
      })

    return () => {
      cancelled = true
    }
  }, [])

  return map
}
