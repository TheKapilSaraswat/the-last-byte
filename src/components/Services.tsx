import { useEffect, useRef, type RefObject } from 'react'
import { useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { services, type Service, type ServicePlan } from '../data/services'
import { serviceArt, type ServiceArtKey } from './ServiceArt'
import { Reveal } from './ui/Reveal'
import { useEnquiry } from './enquiry/EnquiryContext'
import { cn } from '../lib/cn'
import { track } from '../analytics/analytics'
import {
  formatPaise,
  planLookupKey,
  usePublishedPricing,
  type PublishedPlan,
} from '../lib/pricing'

/** Fire a one-off `service_view` event when a card first scrolls into view. */
function useServiceView(serviceId: string, ref: RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  useEffect(() => {
    if (inView) track('service_view', { service: serviceId })
  }, [inView, serviceId])
}

function PriceLabel({
  plan,
  serviceId,
  pricing,
  pill = false,
  className = '',
}: {
  plan: ServicePlan
  serviceId: string
  pricing?: Map<string, PublishedPlan>
  /** Render the price as a compact pill when there is no live discount. */
  pill?: boolean
  className?: string
}) {
  const live = pricing?.get(planLookupKey(serviceId, plan.planKey))

  // Only the server can say a discount is live. When it is, show the original
  // struck through beside the discounted price; otherwise show the static price.
  const percent = live?.discount?.active ? live.discount.percent : null
  const discounted =
    percent !== null &&
    typeof live?.basePricePaise === 'number' &&
    typeof live?.finalPricePaise === 'number'
      ? { base: live.basePricePaise, final: live.finalPricePaise, percent }
      : null

  const content = (
    <>
      {plan.pricePrefix && (
        <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
          {plan.pricePrefix}{' '}
        </span>
      )}
      {discounted ? (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <s className="mono" style={{ color: 'var(--c-muted)' }}>
            {formatPaise(discounted.base)}
          </s>
          <span className="mono" style={{ color: 'var(--c-lime)' }}>
            {formatPaise(discounted.final)}
          </span>
          <span className="tag tag-lime">{discounted.percent}% off</span>
        </span>
      ) : (
        <span className="mono">{plan.price}</span>
      )}
    </>
  )

  // Only wrap in the compact lime pill when nothing is discounted; a live
  // discount renders its own richer block instead.
  if (pill && !discounted) {
    return (
      <span className={cn(className, 'tag tag-lime whitespace-nowrap')}>{content}</span>
    )
  }

  return <span className={className}>{content}</span>
}

function PlanFeatures({ plan }: { plan: ServicePlan }) {
  return (
    <div>
      <p className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
        {plan.listLabel}
      </p>
      <ul className="mt-3 space-y-2">
        {plan.features.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm"
            style={{ color: 'var(--c-ink-2)' }}
          >
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0" style={{ background: 'var(--c-lime)' }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ExclusionNote({ text }: { text: string }) {
  return (
    <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
      <span className="mono text-2xs uppercase" style={{ color: 'var(--c-ink-2)' }}>
        Not included —{' '}
      </span>
      {text}
    </p>
  )
}

/** Featured card for Business Websites, presenting the two options side by side. */
function WebsiteCard({
  service,
  pricing,
}: {
  service: Service
  pricing: Map<string, PublishedPlan>
}) {
  const { openEnquiry } = useEnquiry()
  const Art = serviceArt[service.id as ServiceArtKey]
  const Icon = service.icon
  const cardRef = useRef<HTMLElement>(null)
  useServiceView(service.id, cardRef)

  return (
    <Reveal className="h-full">
      <article
        ref={cardRef}
        className="group flex h-full flex-col border"
        style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <Icon size={18} style={{ color: 'var(--c-lime)' }} aria-hidden="true" />
                <span className="mono text-xs" style={{ color: 'var(--c-muted)' }}>
                  {service.number}
                </span>
                <span className="tag tag-lime">Two options</span>
              </div>
              <h3 className="mt-5 text-2xl transition-colors duration-300 group-hover:text-lime sm:text-3xl">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                {service.summary}
              </p>
            </div>
            <div className="hidden w-56 shrink-0 lg:block">
              <Art />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 border-t sm:grid-cols-2" style={{ borderColor: 'var(--c-line)' }}>
          {service.plans.map((plan) => (
            <div
              key={plan.name}
              className="border-t p-6 first:border-t-0 sm:border-t-0 sm:p-7 sm:odd:border-r"
              style={{ borderColor: 'var(--c-line)' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4 className="text-lg transition-colors duration-300 group-hover:text-lime">
                  {plan.name}
                </h4>
                <PriceLabel plan={plan} serviceId={service.id} pricing={pricing} className="text-sm" />
              </div>
              <div className="mt-5">
                <PlanFeatures plan={plan} />
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col gap-5 border-t p-6 sm:flex-row sm:items-end sm:justify-between sm:p-7"
          style={{ borderColor: 'var(--c-line)' }}
        >
          <div className="max-w-2xl">
            <ExclusionNote text={service.excludes} />
          </div>
          <button
            type="button"
            onClick={() => {
              track('cta_click', { service: service.id })
              openEnquiry({ service: service.title })
            }}
            className="btn btn-primary shrink-0"
          >
            Get a Free Quote
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
      </article>
    </Reveal>
  )
}

/** Compact card for single-option services. */
function ServiceCard({
  service,
  index,
  pricing,
}: {
  service: Service
  index: number
  pricing: Map<string, PublishedPlan>
}) {
  const { openEnquiry } = useEnquiry()
  const Art = serviceArt[service.id as ServiceArtKey]
  const Icon = service.icon
  const plan = service.plans[0]
  const cardRef = useRef<HTMLElement>(null)
  useServiceView(service.id, cardRef)

  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <article
        ref={cardRef}
        className="group flex h-full flex-col border"
        style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
      >
        <div className="overflow-hidden border-b" style={{ borderColor: 'var(--c-line)' }}>
          <Art />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Icon size={18} style={{ color: 'var(--c-lime)' }} aria-hidden="true" />
              <span className="mono text-xs" style={{ color: 'var(--c-muted)' }}>
                {service.number}
              </span>
            </div>
            <div className="flex justify-end">
              <PriceLabel plan={plan} serviceId={service.id} pricing={pricing} pill />
            </div>
          </div>

          <h3 className="mt-5 text-xl transition-colors duration-300 group-hover:text-lime sm:text-2xl">
            {service.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
            {service.summary}
          </p>

          <div className="mt-6">
            <PlanFeatures plan={plan} />
          </div>

          <div className="mt-6">
            <ExclusionNote text={service.excludes} />
          </div>

          <div className="mt-auto pt-7">
            <button
              type="button"
              onClick={() => openEnquiry({ service: service.title })}
              className="btn btn-outline w-full"
            >
              Get a Free Quote
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export function Services() {
  const [websites, ...rest] = services
  const pricing = usePublishedPricing()

  return (
    <section id="services" className="section relative">
      <div className="shell">
        <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                02
              </span>
              <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                Services &amp; Pricing
              </span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.02]">
                Simple, clear pricing.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-2xl" style={{ color: 'var(--c-ink-2)' }}>
                Four ways we can help, with honest starting prices. Every project starts with a free
                quote and a clear plan.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <WebsiteCard service={websites} pricing={pricing} />
          </div>
          {rest.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} pricing={pricing} />
          ))}
        </div>

        <Reveal delay={0.08}>
          <div
            className="mt-8 border p-5 sm:p-6"
            style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface-2)' }}
          >
            <p className="eyebrow" style={{ color: 'var(--c-lime)' }}>
              About pricing
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              These are starting prices and a guide only — not a final quote. Your final price
              depends on what you need. Domain, hosting and any paid third-party tools are charged
              separately unless we agree otherwise. We&apos;ll confirm everything with you in writing
              before any work begins.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
