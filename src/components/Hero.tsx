import { ArrowUpRight, ArrowDown } from 'lucide-react'
import { HeroVisual } from './HeroVisual'
import { useEnquiry } from './enquiry/EnquiryContext'
import { siteConfig } from '../config/site'

export function Hero() {
  const { openEnquiry } = useEnquiry()

  return (
    <section id="top" className="relative overflow-hidden pt-[68px]">
      {/* Backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-[0.5]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 78% 12%, rgba(198,255,94,0.10) 0%, transparent 46%), radial-gradient(90% 80% at 8% 90%, rgba(198,255,94,0.05) 0%, transparent 55%), linear-gradient(180deg, rgba(9,11,10,0) 40%, var(--c-obsidian) 100%)',
          }}
        />
      </div>

      <div className="shell grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24">
        {/* Copy */}
        <div className="lg:col-span-6">
          <div className="mb-7 flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--c-lime)', animation: 'pulse-node 2.6s ease-in-out infinite' }}
              aria-hidden="true"
            />
            <p className="eyebrow" style={{ color: 'var(--c-ink-2)' }}>
              Digital services for businesses
            </p>
          </div>

          <h1 className="display-tight text-[clamp(2.4rem,6.4vw,4.6rem)]" style={{ fontWeight: 600 }}>
            Make your business{' '}
            <span style={{ color: 'var(--c-lime)' }}>easy to find</span> online.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--c-ink-2)' }}>
            We build simple, attractive websites and useful digital tools for shops, restaurants,
            coaching centres and growing businesses.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#services" className="btn btn-primary">
              Explore Our Services
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <button type="button" onClick={() => openEnquiry()} className="btn btn-outline">
              Get a Free Quote
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-8 text-sm" style={{ color: 'var(--c-muted)' }}>
            Clear starting prices. A written quote before we begin. Based in{' '}
            {siteConfig.location.city}, working with businesses across India.
          </p>
        </div>

        {/* Quick overview */}
        <div className="relative lg:col-span-6">
          <HeroVisual />
        </div>
      </div>

      <div className="shell">
        <div className="hairline" />
      </div>
    </section>
  )
}
