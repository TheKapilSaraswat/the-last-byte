import { useState, type FormEvent } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { adminApi, adminApiConfigured, errorMessage } from '../api'
import type { AdminUser } from '../types'
import { Button, ErrorNote, Field } from './ui'

export function LoginScreen({ onSignedIn }: { onSignedIn: (admin: AdminUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const { admin } = await adminApi.login(email.trim(), password)
      onSignedIn(admin)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 60% at 50% 0%, rgba(198,255,94,0.08) 0%, transparent 55%), var(--c-obsidian)',
          }}
        />
      </div>

      <div className="w-full max-w-md">
        <a href="/" className="mono mb-8 inline-flex text-2xs uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
          ← Back to site
        </a>

        <div
          className="border p-7 sm:p-9"
          style={{
            borderColor: 'var(--c-line-strong)',
            background: 'var(--c-surface)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'var(--c-lime-14)', color: 'var(--c-lime)' }}
            >
              <LockKeyhole size={16} aria-hidden="true" />
            </span>
            <p className="eyebrow" style={{ color: 'var(--c-lime)' }}>
              Admin access
            </p>
          </div>

          <h1 className="mt-5 text-3xl">Sign in.</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--c-ink-2)' }}>
            The Last Byte control room. Authorised staff only.
          </p>

          {!adminApiConfigured() && (
            <div className="mt-6">
              <ErrorNote message="The admin API is not configured for this build. Set VITE_API_BASE_URL and redeploy." />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <Field label="Email">
              <input
                type="email"
                className="field-input"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@thelastbyte.in"
                required
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                className="field-input"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </Field>

            {error && <ErrorNote message={error} />}

            <Button type="submit" loading={loading} disabled={!adminApiConfigured()} className="w-full">
              Sign in
              <ArrowRight size={15} aria-hidden="true" />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: 'var(--c-muted)' }}>
          Sessions are protected by an HttpOnly cookie and a CSRF token. Sign-in attempts are rate limited.
        </p>
      </div>
    </div>
  )
}
