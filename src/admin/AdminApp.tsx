import { useEffect, useState } from 'react'
import { BarChart3, FileText, LayoutDashboard, LogOut, Tags, Users } from 'lucide-react'
import { adminApi, adminApiConfigured, errorMessage } from './api'
import type { AdminUser } from './types'
import { LoginScreen } from './components/LoginScreen'
import { ErrorNote, Spinner } from './components/ui'
import { OverviewPanel } from './panels/OverviewPanel'
import { PricingPanel } from './panels/PricingPanel'
import { LeadsPanel } from './panels/LeadsPanel'
import { QuotesPanel } from './panels/QuotesPanel'
import { AnalyticsPanel } from './panels/AnalyticsPanel'
import { cn } from '../lib/cn'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pricing', label: 'Pricing', icon: Tags },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'quotes', label: 'Quotes', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const

type TabId = (typeof TABS)[number]['id']

export function AdminApp() {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TabId>('overview')
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!adminApiConfigured()) {
      setChecking(false)
      return
    }
    adminApi
      .session()
      .then((session) => {
        if (!cancelled) setAdmin(session?.admin ?? null)
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await adminApi.logout()
    } catch {
      /* even if the call fails, drop the local view */
    } finally {
      setLoggingOut(false)
      setAdmin(null)
      setTab('overview')
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking your session…" />
      </div>
    )
  }

  if (!admin) {
    return <LoginScreen onSignedIn={(user) => setAdmin(user)} />
  }

  const onUnauthorized = () => setAdmin(null)

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{ borderColor: 'var(--c-line)', background: 'rgba(9,11,10,0.85)' }}
      >
        <div className="shell flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="mono text-sm tracking-widest" style={{ color: 'var(--c-lime)' }}>
              TLB
            </span>
            <span className="hidden text-sm sm:inline" style={{ color: 'var(--c-ink-2)' }}>
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-right text-xs sm:block">
              <span className="block" style={{ color: 'var(--c-ink)' }}>
                {admin.displayName}
              </span>
              <span className="mono uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
                {admin.role}
              </span>
            </span>
            <a href="/" className="btn btn-ghost px-2 text-xs" title="View public site">
              Site
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline"
              disabled={loggingOut}
            >
              <LogOut size={14} aria-hidden="true" />
              {loggingOut ? 'Signing out' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <div className="shell py-8">
        <nav className="no-scrollbar mb-8 flex gap-1 overflow-x-auto border-b" style={{ borderColor: 'var(--c-line)' }}>
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'mono flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-xs uppercase tracking-widest transition-colors',
                )}
                style={{
                  borderColor: active ? 'var(--c-lime)' : 'transparent',
                  color: active ? 'var(--c-lime)' : 'var(--c-muted)',
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={15} aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {error && (
          <div className="mb-6">
            <ErrorNote message={error} />
          </div>
        )}

        {tab === 'overview' && <OverviewPanel onUnauthorized={onUnauthorized} />}
        {tab === 'pricing' && <PricingPanel onUnauthorized={onUnauthorized} />}
        {tab === 'leads' && <LeadsPanel onUnauthorized={onUnauthorized} />}
        {tab === 'quotes' && <QuotesPanel onUnauthorized={onUnauthorized} />}
        {tab === 'analytics' && <AnalyticsPanel onUnauthorized={onUnauthorized} />}
      </div>
    </div>
  )
}
