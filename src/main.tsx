import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AdminApp } from './admin/AdminApp.tsx'
import { PrivacyPolicy } from './components/PrivacyPolicy.tsx'
import { ConsentBanner } from './components/ConsentBanner.tsx'
import './index.css'

/**
 * There is no client-side router: the marketing site is a single page, and the
 * admin dashboard lives under `/admin`. GitHub Pages serves the built
 * `404.html` (a copy of `index.html`) for that deep link, so the app boots and
 * picks the right screen from the pathname.
 */
const path = window.location.pathname.replace(/\/+$/, '')
const isAdminRoute = path === '/admin'
const isPrivacyRoute = path === '/privacy'

function applyRobotsMeta(admin: boolean): void {
  const injected = document.querySelector<HTMLMetaElement>('meta[data-tlb-robots]')
  if (admin) {
    const meta =
      injected ??
      document.querySelector<HTMLMetaElement>('meta[name="robots"]') ??
      document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    meta.dataset.tlbRobots = 'admin'
    if (!meta.isConnected) document.head.appendChild(meta)
  } else {
    injected?.remove()
  }
}

function metaContent(selector: string): string {
  return document.querySelector<HTMLMetaElement>(selector)?.getAttribute('content') ?? ''
}

function setMetaContent(selector: string, content: string): void {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

const HOME_METADATA = {
  title: document.title,
  description: metaContent('meta[name="description"]'),
  canonical:
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.getAttribute('href') ?? '',
  ogTitle: metaContent('meta[property="og:title"]'),
  ogDescription: metaContent('meta[property="og:description"]'),
  ogUrl: metaContent('meta[property="og:url"]'),
  twitterTitle: metaContent('meta[name="twitter:title"]'),
  twitterDescription: metaContent('meta[name="twitter:description"]'),
}

const PRIVACY_METADATA = {
  title: 'Privacy policy — The Last Byte',
  description:
    'How The Last Byte collects, uses and retains information, including first-party analytics, and how to opt out or request deletion.',
  canonical: 'https://thelastbyte.in/privacy',
  ogTitle: 'Privacy policy — The Last Byte',
  ogDescription:
    'Our privacy practices for enquiry data and first-party analytics, with choices to opt out or request deletion.',
  ogUrl: 'https://thelastbyte.in/privacy',
  twitterTitle: 'Privacy policy — The Last Byte',
  twitterDescription:
    'Our privacy practices for enquiry data and first-party analytics, with choices to opt out or request deletion.',
}

function applyPageMetadata(privacy: boolean): void {
  const metadata = privacy ? PRIVACY_METADATA : HOME_METADATA
  document.title = metadata.title
  setMetaContent('meta[name="description"]', metadata.description)
  setMetaContent('meta[property="og:title"]', metadata.ogTitle)
  setMetaContent('meta[property="og:description"]', metadata.ogDescription)
  setMetaContent('meta[property="og:url"]', metadata.ogUrl)
  setMetaContent('meta[name="twitter:title"]', metadata.twitterTitle)
  setMetaContent('meta[name="twitter:description"]', metadata.twitterDescription)
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', metadata.canonical)
}

applyRobotsMeta(isAdminRoute)
applyPageMetadata(isPrivacyRoute)

const publicView = isPrivacyRoute ? <PrivacyPolicy /> : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? (
      <AdminApp />
    ) : (
      <>
        {publicView}
        <ConsentBanner />
      </>
    )}
  </StrictMode>,
)
