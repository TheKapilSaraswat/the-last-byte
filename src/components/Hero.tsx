import { ArrowUpRight, ArrowDown } from 'lucide-react'
import { HeroVisual } from './HeroVisual'
import { useEnquiry } from './enquiry/EnquiryContext'
import { siteConfig } from '../config/site'

export function Hero() {
  const { openEnquiry } = useEnquiry()

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-[68px]"
      style={{ minHeight: 'min(100svh, 920px)' }}
    >
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

      <div className="shell grid min-h-[calc(min(100svh,920px)-68px)] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-12 lg:gap-6 lg:py-20">
        {/* Copy */}
        <div className="lg:col-span-7">
          <div className="mb-7 flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--c-lime)', animation: 'pulse-node 2.6s ease-in-out infinite' }}
              aria-hidden="true"
            />
            <p className="eyebrow" style={{ color: 'var(--c-ink-2)' }}>
              Independent Digital Studio <span style={{ color: 'var(--c-muted)' }}>/</span>{' '}
              {siteConfig.location.label}
            </p>
          </div>

          <h1
            className="display-tight text-[clamp(2.9rem,8.2vw,6.2rem)] uppercase"
            style={{ fontWeight: 600 }}
          >
            <span className="block overflow-hidden">
              <span className="block">We build the</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block">
                digital <span style={{ color: 'var(--c-lime)' }}>edge</span>
                <span style={{ color: 'var(--c-lime)' }} className="animate-blink">
                  _
                </span>
              </span>
            </span>
          </h1>

          <p
            className="mt-7 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: 'var(--c-ink-2)' }}
          >
            {siteConfig.tagline}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={() => openEnquiry()} className="btn btn-primary">
              Start a Project
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <a href="#services" className="btn btn-outline">
              Explore What We Build
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {['Websites', 'Business systems', 'Automation'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                  ▚
                </span>
                <dt className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                  {item}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Signature visual */}
        <div className="relative lg:col-span-5">
          <HeroVisual />
        </div>
      </div>

      <div className="shell">
        <div className="hairline" />
      </div>
    </section>
  )
}
