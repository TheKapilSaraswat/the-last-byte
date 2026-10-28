import { useEffect } from 'react'
import { SiteHeader } from './components/SiteHeader'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { BrandStatement } from './components/BrandStatement'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { Approach } from './components/Approach'
import { Process } from './components/Process'
import { ConversionCTA } from './components/ConversionCTA'
import { SiteFooter } from './components/SiteFooter'
import { EnquiryProvider } from './components/enquiry/EnquiryContext'
import { EnquiryDialog } from './components/enquiry/EnquiryDialog'
import { analytics } from './analytics/analytics'

const CAPABILITIES = [
  'Business websites',
  'QR menus',
  'Digital business pages',
  'Custom business tools',
  'Enquiry tracking',
  'Simple reports',
  'Business automation',
  'Built for mobile',
  'Clear pricing',
]

export default function App() {
  useEffect(() => {
    analytics().trackPageView()
  }, [])

  return (
    <EnquiryProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:px-4 focus:py-2"
        style={{ background: 'var(--c-lime)', color: '#080a06', fontFamily: "'JetBrains Mono', monospace" }}
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        <Marquee items={CAPABILITIES} />
        <BrandStatement />
        <Services />
        <Work />
        <Approach />
        <Process />
        <ConversionCTA />
      </main>

      <SiteFooter />
      <EnquiryDialog />
    </EnquiryProvider>
  )
}
