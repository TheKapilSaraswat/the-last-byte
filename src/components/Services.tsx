import { ArrowUpRight } from 'lucide-react'
import { services, type Service } from '../data/services'
import { serviceArt, type ServiceArtKey } from './ServiceArt'
import { Reveal } from './ui/Reveal'
import { useEnquiry } from './enquiry/EnquiryContext'

function Includes({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul
      className={`grid gap-x-8 gap-y-2.5 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--c-ink-2)' }}>
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0" style={{ background: 'var(--c-lime)' }} />
          {item}
        </li>
      ))}
    </ul>
  )
}

function ServiceNumber({ number, icon: Icon }: { number: string; icon: Service['icon'] }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={18} style={{ color: 'var(--c-lime)' }} aria-hidden="true" />
      <span className="mono text-xs" style={{ color: 'var(--c-muted)' }}>
        {number}
      </span>
    </div>
  )
}

function WhoFor({ text }: { text: string }) {
  return (
    <p className="mt-4 text-sm" style={{ color: 'var(--c-ink-2)' }}>
      <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
        Who it&apos;s for —{' '}
      </span>
      {text}
    </p>
  )
}

function StartLink({ service }: { service: string }) {
  const { openEnquiry } = useEnquiry()
  return (
    <button
      type="button"
      onClick={() => openEnquiry({ service })}
      className="link-underline mono text-2xs uppercase"
      style={{ color: 'var(--c-lime)' }}
    >
      Start with this service
      <ArrowUpRight size={13} aria-hidden="true" />
    </button>
  )
}

export function Services() {
  return (
    <section id="services" className="section relative">
      {/* header */}
      <div className="shell">
        <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                02
              </span>
              <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                Services
              </span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.02]">
                From first click to full system.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-2xl" style={{ color: 'var(--c-ink-2)' }}>
                Four ways we help businesses show up, sell better and run smoother — from a single
                page to a connected set of tools.
              </p>
            </Reveal>
          </div>
        </div>

        {/* 01 — wide */}
        <ServiceWide service={services[0]} />
        {/* 02 — split */}
        <ServiceSplit service={services[1]} />
        {/* 03 — stacked panel */}
        <ServiceStacked service={services[2]} />
        {/* 04 — list row */}
        <ServiceList service={services[3]} />
      </div>
    </section>
  )
}

function ServiceWide({ service }: { service: Service }) {
  const Art = serviceArt[service.id as ServiceArtKey]
  return (
    <Reveal>
      <article className="group grid grid-cols-1 gap-8 border-t py-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-2">
          <ServiceNumber number={service.number} icon={service.icon} />
        </div>
        <div className="lg:col-span-5">
          <h3 className="text-2xl transition-colors duration-300 group-hover:text-lime sm:text-3xl">
            {service.title}
          </h3>
          <p className="mt-4" style={{ color: 'var(--c-ink-2)' }}>
            {service.summary}
          </p>
          <p className="mt-4 text-sm" style={{ color: 'var(--c-muted)' }}>
            {service.outcome}
          </p>
          <WhoFor text={service.who} />
          <div className="mt-6">
            <Includes items={service.includes} columns={2} />
          </div>
          <div className="mt-7">
            <StartLink service={service.title} />
          </div>
        </div>
        <div className="lg:col-span-5">
          <div
            className="border p-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
            style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
          >
            <Art />
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function ServiceSplit({ service }: { service: Service }) {
  const Art = serviceArt[service.id as ServiceArtKey]
  return (
    <Reveal>
      <article
        className="group grid grid-cols-1 gap-8 border-t py-12 lg:grid-cols-12 lg:gap-6"
      >
        <div className="lg:col-span-5 lg:order-1">
          <div
            className="border p-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
            style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
          >
            <Art />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:order-2">
          <ServiceNumber number={service.number} icon={service.icon} />
          <h3 className="mt-5 text-2xl transition-colors duration-300 group-hover:text-lime sm:text-3xl">
            {service.title}
          </h3>
          <p className="mt-4" style={{ color: 'var(--c-ink-2)' }}>
            {service.summary}
          </p>
          <p className="mt-4 text-sm" style={{ color: 'var(--c-muted)' }}>
            {service.outcome}
          </p>
          <WhoFor text={service.who} />
          <div className="mt-6">
            <Includes items={service.includes} columns={2} />
          </div>
          <div className="mt-7">
            <StartLink service={service.title} />
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function ServiceStacked({ service }: { service: Service }) {
  const Art = serviceArt[service.id as ServiceArtKey]
  return (
    <Reveal>
      <article
        className="group my-4 border p-6 sm:p-10"
        style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface-2)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ServiceNumber number={service.number} icon={service.icon} />
          <span className="tag tag-lime">Business tools</span>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h3 className="text-2xl transition-colors duration-300 group-hover:text-lime sm:text-3xl">
              {service.title}
            </h3>
            <p className="mt-4" style={{ color: 'var(--c-ink-2)' }}>
              {service.summary}
            </p>
            <p className="mt-4 text-sm" style={{ color: 'var(--c-muted)' }}>
              {service.outcome}
            </p>
            <WhoFor text={service.who} />
            <div className="mt-7">
              <StartLink service={service.title} />
            </div>
          </div>
          <div className="lg:col-span-6">
            <Includes items={service.includes} columns={2} />
            <div
              className="mt-7 border p-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
              style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
            >
              <Art />
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function ServiceList({ service }: { service: Service }) {
  const Art = serviceArt[service.id as ServiceArtKey]
  return (
    <Reveal>
      <article className="group grid grid-cols-1 gap-8 border-t border-b py-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-3">
          <ServiceNumber number={service.number} icon={service.icon} />
          <div className="mt-6 hidden lg:block">
            <div
              className="border p-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
              style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
            >
              <Art />
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <h3 className="text-2xl transition-colors duration-300 group-hover:text-lime sm:text-3xl">
            {service.title}
          </h3>
          <p className="mt-4 max-w-2xl" style={{ color: 'var(--c-ink-2)' }}>
            {service.summary}
          </p>
          <p className="mt-4 max-w-2xl text-sm" style={{ color: 'var(--c-muted)' }}>
            {service.outcome}
          </p>
          <WhoFor text={service.who} />
          <div className="mt-6 flex flex-wrap gap-2">
            {service.includes.map((item) => (
              <span key={item} className="tag">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-start lg:col-span-2 lg:justify-end">
          <StartLink service={service.title} />
        </div>
      </article>
    </Reveal>
  )
}
