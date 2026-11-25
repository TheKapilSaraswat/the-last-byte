import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const dist = path.join(process.cwd(), 'dist')
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8')
const exists = (file) => fs.existsSync(path.join(dist, file))

assert.ok(exists('index.html'), 'dist/index.html is missing')
assert.ok(exists('404.html'), 'dist/404.html is missing')
assert.equal(read('404.html'), read('index.html'), 'SPA fallback does not match index.html')

const html = read('index.html')
for (const marker of [
  '<title>The Last Byte',
  'name="description"',
  'rel="canonical" href="https://thelastbyte.in/"',
  'property="og:image" content="https://thelastbyte.in/og-image.png"',
  'application/ld+json',
  'src="./assets/',
]) {
  assert.ok(html.includes(marker), `index.html is missing: ${marker}`)
}
assert.ok(!html.includes('/src/main.tsx'), 'index.html still references unbundled source')

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
