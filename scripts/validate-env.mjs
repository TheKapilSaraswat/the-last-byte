import { pathToFileURL } from 'node:url'

export function normalizeApiBaseUrl(raw) {
  const value = raw.trim().replace(/\/+$/, '')
  if (!value) return ''
  try {
    const url = new URL(value)
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.hash ||
      url.search ||
      value.includes('#') ||
      value.includes('?')
    ) {
      return ''
    }
    return value
  } catch {
    return ''
  }
}

function main() {
  const raw = process.env.VITE_API_BASE_URL ?? ''
  if (raw.trim() && !normalizeApiBaseUrl(raw)) {
    console.error(
      'VITE_API_BASE_URL must be an absolute https:// URL without credentials, a query string or a hash.',
    )
    process.exit(1)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
