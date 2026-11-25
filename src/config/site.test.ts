import { describe, expect, it } from 'vitest'
import { normalizeApiBaseUrl } from './site'

describe('normalizeApiBaseUrl', () => {
  it('accepts https URLs and strips trailing slashes', () => {
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in')).toBe('https://api.thelastbyte.in')
    expect(normalizeApiBaseUrl('  https://api.thelastbyte.in/v1///  ')).toBe(
      'https://api.thelastbyte.in/v1',
    )
  })

  it('treats an empty value as unconfigured', () => {
    expect(normalizeApiBaseUrl('')).toBe('')
    expect(normalizeApiBaseUrl('   ')).toBe('')
  })

  it('rejects http URLs', () => {
    expect(normalizeApiBaseUrl('http://api.thelastbyte.in')).toBe('')
  })

  it('rejects query strings', () => {
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in?key=secret')).toBe('')
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/v1/?key=secret')).toBe('')
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/?')).toBe('')
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/v1?')).toBe('')
  })

  it('rejects hashes', () => {
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/#fragment')).toBe('')
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/#')).toBe('')
  })

  it('rejects credentials', () => {
    expect(normalizeApiBaseUrl('https://user:pass@api.thelastbyte.in')).toBe('')
  })
})
