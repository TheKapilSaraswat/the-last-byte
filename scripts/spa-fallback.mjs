// GitHub Pages serves `404.html` for unknown paths. Copying the built
// `index.html` there lets deep links like `/admin` boot the single-page app
// instead of showing a GitHub 404. It runs as part of `npm run build`, so both
// local builds and the Pages workflow get the fallback.
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
console.log('Created dist/404.html (SPA fallback for /admin deep links).')
