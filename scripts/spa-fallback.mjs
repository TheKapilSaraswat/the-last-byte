// GitHub Pages serves `404.html` for unknown paths. Copying the built
// `index.html` there lets deep links like `/admin` boot the single-page app
// instead of showing a GitHub 404. Route-specific copies give crawlers and
// social previews correct metadata before JavaScript runs.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const indexPath = resolve(dist, 'index.html')
const html = readFileSync(indexPath, 'utf8')

copyFileSync(indexPath, resolve(dist, '404.html'))

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function setTitle(source, title) {
  return source.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
}

function setMeta(source, attribute, name, value) {
  const pattern = new RegExp(
    `(<meta\\s+[^>]*${attribute}="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*\\scontent=")[^"]*(")`,
    'i',
  )
  if (pattern.test(source)) {
    return source.replace(pattern, (_, prefix, suffix) => `${prefix}${escapeHtml(value)}${suffix}`)
  }
  return source.replace('</head>', `    <meta ${attribute}="${name}" content="${escapeHtml(value)}" />\n  </head>`)
}

function setCanonical(source, url) {
  const pattern = /(<link\s+rel="canonical"\s+href=")[^"]*(")/i
  if (pattern.test(source)) {
    return source.replace(pattern, (_, prefix, suffix) => `${prefix}${escapeHtml(url)}${suffix}`)
  }
  return source.replace('</head>', `    <link rel="canonical" href="${escapeHtml(url)}" />\n  </head>`)
}

function removeStructuredData(source) {
  return source.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
}

function prepareRouteHtml(source) {
  const withoutRedirect = source.replace(
    /<script>\s*\(function \(\) \{[\s\S]*?\}\)\(\);\s*<\/script>/i,
    '',
  )
  return withoutRedirect.replace('</head>', `    <base href="/" />\n  </head>`)
}

function writeRoute(route, transform) {
  const routeDir = resolve(dist, route)
  mkdirSync(routeDir, { recursive: true })
  writeFileSync(resolve(routeDir, 'index.html'), transform(prepareRouteHtml(html)), 'utf8')
}

const privacyDescription =
  'How The Last Byte collects, uses and retains information, including first-party analytics, and how to opt out or request deletion.'
const privacySocialDescription =
  'Our privacy practices for enquiry data and first-party analytics, with choices to opt out or request deletion.'

writeRoute('privacy', (source) => {
  let output = removeStructuredData(source)
  output = setTitle(output, 'Privacy policy — The Last Byte')
  output = setMeta(output, 'name', 'description', privacyDescription)
  output = setMeta(output, 'property', 'og:title', 'Privacy policy — The Last Byte')
  output = setMeta(output, 'property', 'og:description', privacySocialDescription)
  output = setMeta(output, 'property', 'og:url', 'https://thelastbyte.in/privacy')
  output = setMeta(output, 'name', 'twitter:title', 'Privacy policy — The Last Byte')
  output = setMeta(output, 'name', 'twitter:description', privacySocialDescription)
  return setCanonical(output, 'https://thelastbyte.in/privacy')
})

writeRoute('admin', (source) => {
  let output = removeStructuredData(source)
  output = setTitle(output, 'Admin — The Last Byte')
  output = setMeta(output, 'name', 'robots', 'noindex, nofollow')
  output = setMeta(output, 'name', 'description', 'Private admin dashboard for The Last Byte.')
  output = setMeta(output, 'property', 'og:title', 'Admin — The Last Byte')
  output = setMeta(output, 'property', 'og:description', 'Private admin dashboard.')
  output = setMeta(output, 'property', 'og:url', 'https://thelastbyte.in/admin')
  output = setMeta(output, 'name', 'twitter:title', 'Admin — The Last Byte')
  output = setMeta(output, 'name', 'twitter:description', 'Private admin dashboard.')
  return setCanonical(output, 'https://thelastbyte.in/admin')
})

console.log('Created dist/404.html, dist/privacy/index.html and dist/admin/index.html.')
