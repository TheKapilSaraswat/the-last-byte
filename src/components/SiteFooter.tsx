import { ArrowUp, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { Wordmark } from './ui/BrandMark'
import {
  hasEmail,
  hasWhatsApp,
  mailtoLink,
  siteConfig,
  whatsappLink,
} from '../config/site'
import { useEnquiry } from './enquiry/EnquiryContext'

const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
]

const SERVICES = [
  { label: 'Websites', href: '#services' },
  { label: 'Digital menus', href: '#services' },
  { label: 'Business software', href: '#services' },
  { label: 'Automation', href: '#services' },
]

export function SiteFooter() {
  const { openEnquiry } = useEnquiry()
  const year = new Date().getFullYear()
  const wa = whatsappLink('Hi The Last Byte — I would like to discuss a project.')
  const email = mailtoLink('Project enquiry — The Last Byte')

  return (
    <footer className="relative border-t" style={{ borderColor: 'var(--c-line)' }}>
      <div className="shell py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <a href="#top" aria-label="The Last Byte — back to top">
              <Wordmark size={34} />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              An independent digital solutions studio helping small and medium businesses build a
              strong online presence and run smoother with websites, software and automation.
            </p>
            <p className="mono mt-6 flex items-center gap-2 text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--c-lime)' }}
                aria-hidden="true"
              />
              {siteConfig.location.city}, {siteConfig.location.region}
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
              Navigate
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline" style={{ color: 'var(--c-ink-2)' }}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="link-underline"
                  style={{ color: 'var(--c-ink-2)' }}
                >
                  Start a project
                </button>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
              Services
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {SERVICES.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="link-underline" style={{ color: 'var(--c-ink-2)' }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
              Contact
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {hasWhatsApp && wa ? (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2"
                    style={{ color: 'var(--c-ink-2)' }}
                  >
                    <MessageCircle size={15} aria-hidden="true" /> WhatsApp
                  </a>
                </li>
              ) : null}
              {hasEmail && email ? (
                <li>
                  <a
                    href={email}
                    className="link-underline inline-flex items-center gap-2"
                    style={{ color: 'var(--c-ink-2)' }}
                  >
                    <Mail size={15} aria-hidden="true" /> Email
                  </a>
                </li>
              ) : null}

              {siteConfig.social.instagram ? (
                <li>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2"
                    style={{ color: 'var(--c-ink-2)' }}
                  >
                    <Instagram size={15} aria-hidden="true" /> Instagram
                  </a>
                </li>
              ) : null}
              {siteConfig.social.linkedin ? (
                <li>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2"
                    style={{ color: 'var(--c-ink-2)' }}
                  >
                    <Linkedin size={15} aria-hidden="true" /> LinkedIn
                  </a>
                </li>
              ) : null}

              {!hasWhatsApp && !hasEmail && !siteConfig.social.instagram && !siteConfig.social.linkedin ? (
                <li className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  Public contact details are not configured yet. Update{' '}
                  <code className="mono" style={{ color: 'var(--c-ink-2)' }}>
                    src/config/site.ts
                  </code>{' '}
                  to publish email, WhatsApp or social links.
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'var(--c-line)' }}
        >
          <p className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
            © {year} {siteConfig.name} · All rights reserved
          </p>

          <div className="flex items-center gap-5">
            <p className="mono hidden text-2xs uppercase sm:block" style={{ color: 'var(--c-muted)' }}>
              Precision in every pixel
            </p>
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-2xs uppercase transition-colors duration-300 hover:text-lime mono"
              style={{ color: 'var(--c-ink-2)' }}
            >
              Back to top
              <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
