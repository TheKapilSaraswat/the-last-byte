import { describe, expect, it } from 'vitest'
import { formatPaise, planLookupKey } from './pricing'

describe('planLookupKey', () => {
  it('joins the service and plan with a colon', () => {
    expect(planLookupKey('web', 'starter')).toBe('web:starter')
  })
})

describe('formatPaise', () => {
  it('formats whole rupees with Indian grouping', () => {
    expect(formatPaise(1234500)).toBe('₹12,345')
  })

  it('formats zero', () => {
    expect(formatPaise(0)).toBe('₹0')
  })

  it('rounds fractional rupees', () => {
    expect(formatPaise(999)).toBe('₹10')
  })
})
