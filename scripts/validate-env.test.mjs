import { describe, expect, it } from 'vitest'
import { normalizeApiBaseUrl as normalizeRuntime } from '../src/config/site.ts'
import { normalizeApiBaseUrl } from './validate-env.mjs'

describe('validate-env normalizeApiBaseUrl', () => {
  it('accepts https URLs and strips trailing slashes', () => {
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/')).toBe('https://api.thelastbyte.in')
  })

  it('treats an empty value as unconfigured', () => {
    expect(normalizeApiBaseUrl('')).toBe('')
  })

  it('rejects http URLs', () => {
    expect(normalizeApiBaseUrl('http://api.thelastbyte.in')).toBe('')
  })

  it('rejects query strings', () => {
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in?key=secret')).toBe('')
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/?')).toBe('')
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/v1?')).toBe('')
  })

  it('rejects hashes and credentials', () => {
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/#fragment')).toBe('')
    expect(normalizeApiBaseUrl('https://api.thelastbyte.in/#')).toBe('')
    expect(normalizeApiBaseUrl('https://user:pass@api.thelastbyte.in')).toBe('')
  })

  it('matches the runtime URL normalizer', () => {
    const values = [
      'https://api.thelastbyte.in',
      'https://api.thelastbyte.in/v1///',
      '',
      'http://api.thelastbyte.in',
      'https://api.thelastbyte.in?key=secret',
      'https://api.thelastbyte.in/#fragment',
      'https://user:pass@api.thelastbyte.in',
    ]
    for (const value of values) {
      expect(normalizeApiBaseUrl(value)).toBe(normalizeRuntime(value))
    }
  })
})
