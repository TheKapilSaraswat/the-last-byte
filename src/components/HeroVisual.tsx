import { ArrowUpRight } from 'lucide-react'
import { services } from '../data/services'
import { useEnquiry } from './enquiry/EnquiryContext'

/**
 * The hero's companion panel: a plain-English snapshot of what we build and
 * roughly what it costs, so a visitor understands the offer in seconds.
 */
export function HeroVisual() {
  const { openEnquiry } = useEnquiry()

  return (
    <div
      className="border"
      style={{ borderColor: 'var(--c-line-strong)', background: 'var(--c-surface)' }}
    >
      <div
        className="flex items-center justify-between gap-4 border-b px-5 py-4"
        style={{ borderColor: 'var(--c-line)' }}
      >
        <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
          What we can build for you
        </span>
        <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
          04 services
        </span>
      </div>

      <ul>
        {services.map((service) => {
          const Icon = service.icon
          return (
            <li
              key={service.id}
              className="flex items-center gap-4 border-b px-5 py-4 last:border-b-0"
              style={{ borderColor: 'var(--c-line)' }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center border"
                style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface-2)' }}
              >
                <Icon size={16} style={{ color: 'var(--c-lime)' }} aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-sm" style={{ color: 'var(--c-ink)' }}>
                  {service.title}
                </span>
                <span className="mono block text-2xs" style={{ color: 'var(--c-muted)' }}>
                  {service.price}
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      <div className="px-5 py-4">
        <button type="button" onClick={() => openEnquiry()} className="btn btn-primary w-full">
          Get a Free Quote
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
