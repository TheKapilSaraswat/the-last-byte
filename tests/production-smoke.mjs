import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const dist = path.join(process.cwd(), 'dist')
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8')
const exists = (file) => fs.existsSync(path.join(dist, file))
const siteUrl = 'https://thelastbyte.in'

assert.ok(exists('index.html'), 'dist/index.html is missing')
assert.ok(exists('404.html'), 'dist/404.html is missing')
assert.equal(read('404.html'), read('index.html'), 'SPA fallback does not match index.html')

const html = read('index.html')
for (const marker of [
  '<title>The Last Byte',
  'name="description"',
  `rel="canonical" href="${siteUrl}/"`,
  `property="og:image" content="${siteUrl}/og-image.png"`,
  'application/ld+json',
  'src="./assets/',
]) {
  assert.ok(html.includes(marker), `index.html is missing: ${marker}`)
}
assert.ok(!html.includes('/src/main.tsx'), 'index.html still references unbundled source')

const privacyHtml = read('privacy/index.html')
const adminHtml = read('admin/index.html')
for (const marker of [
  '<title>Privacy policy — The Last Byte</title>',
  `rel="canonical" href="${siteUrl}/privacy"`,
  'name="description"',
]) {
  assert.ok(privacyHtml.includes(marker), `privacy/index.html is missing: ${marker}`)
}
assert.ok(!privacyHtml.includes('application/ld+json'), 'privacy page still has home structured data')
assert.ok(privacyHtml.includes('<base href="/" />'), 'privacy page has no absolute asset base')
assert.ok(!privacyHtml.includes("path.replace(/\\/+$/, '')"), 'privacy page still redirects trailing slash')
for (const marker of [
  '<title>Admin — The Last Byte</title>',
  'name="robots"',
  'content="noindex, nofollow"',
  `rel="canonical" href="${siteUrl}/admin"`,
]) {
  assert.ok(adminHtml.includes(marker), `admin/index.html is missing: ${marker}`)
}
assert.ok(!adminHtml.includes('application/ld+json'), 'admin page still has home structured data')
assert.ok(adminHtml.includes('<base href="/" />'), 'admin page has no absolute asset base')
assert.ok(!adminHtml.includes("path.replace(/\\/+$/, '')"), 'admin page still redirects trailing slash')

const assets = fs.readdirSync(path.join(dist, 'assets'))
assert.ok(assets.some((file) => file.endsWith('.js')), 'no JavaScript bundle found')
assert.ok(assets.some((file) => file.endsWith('.css')), 'no CSS bundle found')

for (const file of [
  'favicon.svg',
  'apple-touch-icon.png',
  'og-image.png',
  'robots.txt',
  'sitemap.xml',
]) {
  assert.ok(exists(file), `${file} was not copied into dist`)
}

console.log('Production build smoke test passed.')
