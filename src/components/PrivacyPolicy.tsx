import { useState } from 'react'
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react'
import { Wordmark } from './ui/BrandMark'
import {
  hasEmail,
  hasWhatsApp,
  mailtoLink,
  siteConfig,
  whatsappLink,
} from '../config/site'
import { resetAnalyticsConsent, setAnalyticsConsent } from '../analytics/consent'

export function PrivacyPolicy() {
  const [consentNotice, setConsentNotice] = useState<{ text: string; failed: boolean } | null>(null)
  const email = mailtoLink('Privacy request — The Last Byte')
  const whatsapp = whatsappLink('Hi The Last Byte — I have a privacy request.')

  function optOut() {
    const persisted = setAnalyticsConsent('denied')
    setConsentNotice({
      failed: !persisted,
      text: persisted
        ? 'Analytics are now off for this browser. Your visitor identifier has been removed and no further analytics events will be sent from this browser.'
        : 'Analytics are off for this visit. This browser blocked saving the preference, so you may be asked again next time.',
    })
  }

  function changeChoice() {
    const cleared = resetAnalyticsConsent()
    setConsentNotice({
      failed: !cleared,
      text: cleared
        ? 'Choose again in the banner at the bottom of the page.'
        : 'This browser blocked clearing the saved choice; you may need to clear site data to choose again.',
    })
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-obsidian)' }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:px-4 focus:py-2"
        style={{ background: 'var(--c-lime)', color: '#080a06', fontFamily: "'JetBrains Mono', monospace" }}
      >
        Skip to content
      </a>
      <header className="border-b" style={{ borderColor: 'var(--c-line)' }}>
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <a href="/" aria-label={`${siteConfig.name} — home`}>
            <Wordmark size={32} />
          </a>
          <a
            href="/"
            className="link-underline inline-flex items-center gap-2 text-xs uppercase mono"
            style={{ color: 'var(--c-ink-2)' }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to site
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="shell py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4" style={{ color: 'var(--c-lime)' }}>
            Privacy
          </p>
          <h1 className="display-tight text-[clamp(2.4rem,6vw,4.25rem)]">Privacy policy</h1>
          <p className="mt-6 text-base leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
            Last updated 25 November 2026. This page explains what {siteConfig.name} collects when
            you use this site, why we keep it, and how you can ask us to delete it or stop analytics.
          </p>

          <section className="mt-14" aria-labelledby="privacy-collected">
            <h2 id="privacy-collected" className="text-2xl">
              What we collect
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              <p>
                Enquiry form data: your name, optional business name, email or phone number,
                service, optional budget and project details, plus the time you started the form.
                We use these only to reply to your enquiry and discuss the work.
              </p>
              <p>
                First-party analytics events: anonymous page views and interactions such as
                navigation clicks, opening the enquiry form and form outcomes. We store a random
                visitor identifier in your browser to count distinct visitors, and send the event
                name, a path without query strings or fragments, a sanitised referrer, short UTM
                labels and a timestamp to our own analytics endpoint. We do not use advertising
                cookies, third-party tracking scripts, or your enquiry answers for analytics.
              </p>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="privacy-purposes">
            <h2 id="privacy-purposes" className="text-2xl">
              Why we use it
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              Enquiry data lets us answer your request and prepare a quotation. Analytics data is
              only used in aggregate to understand which pages and services get attention so we can
              improve the site. We do not sell data or use it for targeted advertising.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="privacy-retention">
            <h2 id="privacy-retention" className="text-2xl">
              Retention
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              Analytics records are retained for about 180 days, and the browser visitor identifier
              is rotated after 180 days. Enquiries are kept until you ask us to delete them; you can
              contact us using the details below. We do not keep enquiry answers in analytics.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="privacy-recipients">
            <h2 id="privacy-recipients" className="text-2xl">
              Who receives it
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              Site hosting serves this page and may keep standard server logs. API hosting receives
              and stores enquiry submissions and first-party analytics events. Our email provider
              may receive a notification so we can reply to you. The font provider (Google Fonts)
              serves typefaces used by this site and may see standard request data such as your IP
              address. These providers act on our behalf; we do not pass your details to advertisers
              or data brokers.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="privacy-choices">
            <h2 id="privacy-choices" className="text-2xl">
              Your choices
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              Analytics is off unless you accept it in the consent banner, and is disabled
              automatically when your browser sends Do Not Track or Global Privacy Control, or when
              you opt out below. Your choice is stored only in this browser. You can also ask us to
              delete an enquiry.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={optOut} className="btn btn-outline">
                Opt out of analytics
              </button>
              <button type="button" onClick={changeChoice} className="btn btn-ghost">
                Change analytics choice
              </button>
            </div>
            {consentNotice && (
              <div
                role="status"
                className="mt-4 border p-4 text-sm"
                style={{
                  borderColor: 'var(--c-lime-24)',
                  background: 'var(--c-lime-08)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--c-ink)',
                }}
              >
                {consentNotice.text}
              </div>
            )}
          </section>

          <section className="mt-12" aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className="text-2xl">
              Contact us
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
              For privacy questions or deletion requests, reach us at {siteConfig.location.city},{' '}
              {siteConfig.location.region}, {siteConfig.location.country}:
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {hasEmail && email && (
                <li>
                  <a href={email} className="link-underline inline-flex items-center gap-2" style={{ color: 'var(--c-ink)' }}>
                    <Mail size={15} aria-hidden="true" />
                    {siteConfig.email}
                  </a>
                </li>
              )}
              {hasWhatsApp && whatsapp && (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2"
                    style={{ color: 'var(--c-ink)' }}
                  >
                    <MessageCircle size={15} aria-hidden="true" />
                    WhatsApp: +{siteConfig.whatsappNumber}
                  </a>
                </li>
              )}
              {!hasEmail && !hasWhatsApp && (
                <li style={{ color: 'var(--c-muted)' }}>
                  Public contact details are not configured yet.
                </li>
              )}
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t" style={{ borderColor: 'var(--c-line)' }}>
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-8">
          <p className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
            © {new Date().getFullYear()} {siteConfig.name} · All rights reserved
          </p>
          <a
            href="/"
            className="link-underline inline-flex items-center gap-2 text-xs uppercase mono"
            style={{ color: 'var(--c-ink-2)' }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to site
          </a>
        </div>
      </footer>
    </div>
  )
}
