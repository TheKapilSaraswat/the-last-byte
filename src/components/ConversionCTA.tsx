import { Mail } from 'lucide-react'
import { hasEmail, mailtoLink } from '../config/site'
import { EnquiryForm } from './enquiry/EnquiryForm'
import { Reveal } from './ui/Reveal'

export function ConversionCTA() {
  const email = mailtoLink('Project enquiry — The Last Byte')

  return (
    <section id="contact" className="section relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 70% at 20% 0%, rgba(198,255,94,0.10) 0%, transparent 50%), linear-gradient(180deg, var(--c-obsidian), var(--c-surface) 50%, var(--c-obsidian))',
          }}
        />
      </div>

      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
              06
            </span>
            <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
              Start here
            </span>
          </div>

          <Reveal>
            <h2 className="display-tight text-[clamp(2.2rem,5.4vw,4rem)]">
              Tell us about your business.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-lg text-base sm:text-lg" style={{ color: 'var(--c-ink-2)' }}>
              Send us a few details and we&apos;ll get back to you with next steps and a clear price.
              No pressure, no obligation.
            </p>
          </Reveal>

          {hasEmail && email && (
            <div className="mt-8">
              <a className="btn btn-outline" href={email}>
                <Mail size={15} aria-hidden="true" />
                Email us instead
              </a>
            </div>
          )}
        </div>

        {/* Inline enquiry form */}
        <div className="lg:col-span-6">
          <Reveal delay={0.12}>
            <div
              className="border p-6 sm:p-8"
              style={{ borderColor: 'var(--c-line-strong)', background: 'var(--c-surface)' }}
            >
              <p className="eyebrow mb-1" style={{ color: 'var(--c-lime)' }}>
                Get a free quote
              </p>
              <h3 className="text-2xl">Send us your details.</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--c-ink-2)' }}>
                A couple of sentences is enough to start a conversation.
              </p>
              <div className="mt-6">
                <EnquiryForm compact />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
