import { useState } from 'react'
import { ArrowUpRight, MessageCircle, Mail } from 'lucide-react'
import { hasEmail, mailtoLink, whatsappLink } from '../config/site'
import { useEnquiry } from './enquiry/EnquiryContext'
import { EnquiryForm } from './enquiry/EnquiryForm'
import { Reveal } from './ui/Reveal'

export function ConversionCTA() {
  const { openEnquiry } = useEnquiry()
  const [waNotice, setWaNotice] = useState(false)
  const wa = whatsappLink('Hi The Last Byte — I would like to discuss a project.')
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
            <h2 className="display-tight text-[clamp(2.2rem,6vw,4.6rem)] uppercase">
              Let&apos;s make your
              <br />
              next move <span style={{ color: 'var(--c-lime)' }}>digital</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-lg text-base sm:text-lg" style={{ color: 'var(--c-ink-2)' }}>
              Have an idea, an existing business, or a workflow that needs improving? Tell us what
              you&apos;re building.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" className="btn btn-primary" onClick={() => openEnquiry()}>
              Start a Project
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>

            {wa ? (
              <a className="btn btn-outline" href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setWaNotice(true)}
                aria-describedby={waNotice ? 'wa-note' : undefined}
              >
                <MessageCircle size={15} aria-hidden="true" />
                Chat on WhatsApp
              </button>
            )}

            {hasEmail && email && (
              <a className="btn btn-ghost" href={email}>
                <Mail size={15} aria-hidden="true" />
                Email
              </a>
            )}
          </div>

          {waNotice && !wa && (
            <p
              id="wa-note"
              role="status"
              className="mt-4 max-w-md text-sm"
              style={{ color: 'var(--c-ink-2)' }}
            >
              WhatsApp isn&apos;t connected in this build yet. Use the form to send your details —
              they&apos;ll be ready to hand off the moment a number is configured.
            </p>
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
                Project enquiry
              </p>
              <h3 className="text-2xl">Tell us what you&apos;re building.</h3>
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
