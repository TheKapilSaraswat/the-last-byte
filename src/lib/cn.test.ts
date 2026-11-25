import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('keeps truthy class names in order', () => {
    expect(cn('one', 'two')).toBe('one two')
  })

  it('drops false, null and undefined values', () => {
    expect(cn('one', false, null, undefined, 'two')).toBe('one two')
  })

  it('returns an empty string when nothing is provided', () => {
    expect(cn()).toBe('')
  })
})
