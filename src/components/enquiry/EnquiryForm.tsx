import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Check, Copy, Loader2, MessageCircle } from 'lucide-react'
import { services } from '../../data/services'
import {
  hasEmail,
  hasWhatsApp,
  mailtoLink,
  siteConfig,
  whatsappLink,
} from '../../config/site'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FormState {
  name: string
  business: string
  contact: string
  service: string
  budget: string
  details: string
}

const initialForm: FormState = {
  name: '',
  business: '',
  contact: '',
  service: '',
  budget: '',
  details: '',
}

const serviceOptions = [...services.map((s) => s.title), 'Not sure yet']

const budgetOptions = [
  'Not decided yet',
  'Under ₹25,000',
  '₹25,000 – ₹75,000',
  '₹75,000 – ₹2,00,000',
  '₹2,00,000+',
]

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {}
  if (!form.name.trim()) errors.name = 'Please tell us your name.'

  const contact = form.contact.trim()
  if (!contact) {
    errors.contact = 'Add an email or phone number so we can reply.'
  } else if (contact.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      errors.contact = 'That email address looks incomplete.'
    }
  } else if (contact.replace(/\D/g, '').length < 8) {
    errors.contact = 'That phone number looks too short.'
  }

  if (!form.service) errors.service = 'Choose the service you need.'
  if (form.details.trim().length < 12) {
    errors.details = 'A sentence or two about the project helps a lot.'
  }
  return errors
}

function buildMessage(form: FormState): string {
  return [
    'New project enquiry — The Last Byte',
    '',
    `Name: ${form.name.trim()}`,
    form.business.trim() ? `Business: ${form.business.trim()}` : null,
    `Contact: ${form.contact.trim()}`,
    `Service: ${form.service}`,
    form.budget ? `Budget: ${form.budget}` : null,
    '',
    'Details:',
    form.details.trim(),
  ]
    .filter(Boolean)
    .join('\n')
}

export function EnquiryForm({
  compact = false,
  initialService = null,
}: {
  compact?: boolean
  initialService?: string | null
}) {
  const uid = useId()
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    service: initialService ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [notice, setNotice] = useState<{ kind: 'preview' | 'wa' | 'error'; text: string } | null>(
    null,
  )
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const fieldId = (key: string) => `${uid}-${key}`

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      setNotice(null)
      return
    }

    const message = buildMessage(form)

    // 1) Real backend endpoint configured → POST JSON.
    if (siteConfig.formEndpoint.trim()) {
      setStatus('submitting')
      setNotice(null)
      try {
        const response = await fetch(siteConfig.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...form, _subject: 'New enquiry — The Last Byte' }),
        })
        if (!response.ok) throw new Error(`Request failed with ${response.status}`)
        setStatus('success')
        setForm(initialForm)
      } catch {
        setStatus('error')
        setNotice({
          kind: 'error',
          text: 'We could not send that automatically. Please use WhatsApp or email below — the details are ready to copy.',
        })
      }
      return
    }

    // 2) No endpoint, but WhatsApp configured → hand off to WhatsApp.
    const wa = whatsappLink(message)
    if (wa) {
      setStatus('success')
      setNotice({
        kind: 'wa',
        text: 'Opening WhatsApp with your details pre-filled. Press send in WhatsApp to reach us.',
      })
      window.open(wa, '_blank', 'noopener,noreferrer')
      return
    }

    // 3) Nothing configured → honest local preview. Never claim it was sent.
    setStatus('success')
    setNotice({
      kind: 'preview',
      text: 'Submission is not connected yet in this build. Your message has been prepared below — copy it and send it through a channel once contact details are configured.',
    })
  }

  function copyMessage() {
    const message = buildMessage(form)
    navigator.clipboard?.writeText(message).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2200)
      },
      () => setCopied(false),
    )
  }

  const endpointConfigured = siteConfig.formEndpoint.trim().length > 0
  const emailLink = mailtoLink('New project enquiry — The Last Byte', buildMessage(form))

  return (
    <form onSubmit={handleSubmit} noValidate className={compact ? '' : 'w-full'}>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <Field
          id={fieldId('name')}
          label="Your name"
          required
          error={errors.name}
        >
          <input
            ref={nameRef}
            id={fieldId('name')}
            name="name"
            className="field-input"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId('name')}-error` : undefined}
            placeholder="e.g. Aarav Sharma"
          />
        </Field>

        <Field id={fieldId('business')} label="Business name (optional)">
          <input
            id={fieldId('business')}
            name="business"
            className="field-input"
            autoComplete="organization"
            value={form.business}
            onChange={(e) => set('business')(e.target.value)}
            placeholder="e.g. Riverstone Stay"
          />
        </Field>

        <Field
          id={fieldId('contact')}
          label="Email or phone"
          required
          error={errors.contact}
          helper="Whatever you prefer — we will use it only to reply."
        >
          <input
            id={fieldId('contact')}
            name="contact"
            className="field-input"
            autoComplete="email"
            value={form.contact}
            onChange={(e) => set('contact')(e.target.value)}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? `${fieldId('contact')}-error` : undefined}
            placeholder="you@business.com or +91..."
          />
        </Field>

        <Field
          id={fieldId('service')}
          label="Service required"
          required
          error={errors.service}
        >
          <select
            id={fieldId('service')}
            name="service"
            className="field-input"
            value={form.service}
            onChange={(e) => set('service')(e.target.value)}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? `${fieldId('service')}-error` : undefined}
          >
            <option value="">Select a service…</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field id={fieldId('budget')} label="Approximate budget (optional)">
            <select
              id={fieldId('budget')}
              name="budget"
              className="field-input"
              value={form.budget}
              onChange={(e) => set('budget')(e.target.value)}
            >
              <option value="">Prefer not to say</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id={fieldId('details')}
            label="Project details"
            required
            error={errors.details}
          >
            <textarea
              id={fieldId('details')}
              name="details"
              className="field-input"
              rows={compact ? 3 : 4}
              value={form.details}
              onChange={(e) => set('details')(e.target.value)}
              aria-invalid={Boolean(errors.details)}
              aria-describedby={errors.details ? `${fieldId('details')}-error` : undefined}
              placeholder="What are you building, and what should it achieve?"
            />
          </Field>
        </div>
      </div>

      <div
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        aria-live="polite"
      >
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight size={15} aria-hidden="true" />
            </>
          )}
        </button>

        {hasWhatsApp && (
          <a
            className="btn btn-outline"
            href={whatsappLink() ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={15} aria-hidden="true" />
            WhatsApp instead
          </a>
        )}
      </div>

      {/* Success / fallback feedback */}
      {(status === 'success' || status === 'error') && notice && (
        <div
          role="status"
          className="mt-5 border p-4 text-sm"
          style={{
            borderColor:
              notice.kind === 'error' ? 'rgba(255,107,107,0.5)' : 'var(--c-lime-24)',
            background: notice.kind === 'error' ? 'rgba(255,107,107,0.06)' : 'var(--c-lime-08)',
            borderRadius: 'var(--radius)',
            color: 'var(--c-ink)',
          }}
        >
          <p className="m-0">{notice.text}</p>

          {notice.kind === 'preview' && (
            <div className="mt-3">
              <pre
                className="mono max-h-44 overflow-auto whitespace-pre-wrap p-3 text-xs"
                style={{ background: 'var(--c-obsidian)', border: '1px solid var(--c-line)' }}
              >
                {buildMessage(form)}
              </pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline" onClick={copyMessage}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy details'}
                </button>
                {emailLink && (
                  <a className="btn btn-outline" href={emailLink}>
                    Email instead
                  </a>
                )}
              </div>
            </div>
          )}

          {notice.kind === 'error' && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hasWhatsApp && (
                <a
                  className="btn btn-outline"
                  href={whatsappLink(buildMessage(form)) ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              )}
              {emailLink && (
                <a className="btn btn-outline" href={emailLink}>
                  Email
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {!endpointConfigured && !hasWhatsApp && (
        <p className="mt-4 text-xs" style={{ color: 'var(--c-muted)' }}>
          {hasEmail
            ? 'Online submission is not connected in this build — we will hand off to email.'
            : 'Online submission is not connected yet in this build. See the deployment notes to enable it.'}
        </p>
      )}
    </form>
  )
}

interface FieldProps {
  id: string
  label: string
  required?: boolean
  helper?: string
  error?: string
  children: ReactNode
}

function Field({ id, label, required, helper, error, children }: FieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: 'var(--c-lime)' }}>
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs" style={{ color: '#ff8b8b' }}>
          {error}
        </p>
      ) : helper ? (
        <p className="mt-1.5 text-xs" style={{ color: 'var(--c-muted)' }}>
          {helper}
        </p>
      ) : null}
    </div>
  )
}
