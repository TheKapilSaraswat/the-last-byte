import { useEffect, useState } from 'react'
import { ApiError, adminApi, errorMessage } from '../api'
import type { AdminOverview } from '../types'
import { LEAD_STATUS_LABELS, QUOTE_STATUS_LABELS } from '../types'
import { Card, ErrorNote, PanelHeader, Spinner, Stat, StatusBadge } from '../components/ui'

export function OverviewPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [data, setData] = useState<AdminOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    adminApi
      .overview()
      .then((overview) => {
        if (!cancelled) setData(overview)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          onUnauthorized()
          return
        }
        if (!cancelled) setError(errorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [onUnauthorized])

  if (loading) return <Spinner label="Loading overview…" />
  if (error) return <ErrorNote message={error} />
  if (!data) return null

  const pageViews = data.analytics.pageViews
  const visitors = data.analytics.visitors
  const ctaClicks = data.analytics.ctaClicks

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Overview"
        description="A live snapshot of enquiries, pipeline, pricing and traffic."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Enquiries" value={data.enquiries.total} hint={`${data.enquiries.last30Days} in the last 30 days`} />
        <Stat
          label="Open follow-ups"
          value={data.followUps.open}
          hint={data.followUps.overdue > 0 ? `${data.followUps.overdue} overdue` : 'Nothing overdue'}
        />
        <Stat label="Quotations" value={data.quotes.total} hint="All time" />
        <Stat
          label="Active plans"
          value={data.pricing.activePlans}
          hint={`${data.pricing.activeDiscounts} live discount${data.pricing.activeDiscounts === 1 ? '' : 's'}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Stat label="Page views (30d)" value={pageViews.toLocaleString('en-IN')} />
        <Stat label="Visitors (30d)" value={visitors.toLocaleString('en-IN')} />
        <Stat label="CTA clicks (30d)" value={ctaClicks.toLocaleString('en-IN')} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <p className="eyebrow" style={{ color: 'var(--c-muted)' }}>
            Leads by status
          </p>
          <ul className="mt-4 space-y-2">
            {data.enquiries.byStatus.length === 0 && (
              <li className="text-sm" style={{ color: 'var(--c-muted)' }}>
                No enquiries yet.
              </li>
            )}
            {data.enquiries.byStatus.map((item) => (
              <li key={item.status} className="flex items-center justify-between gap-3">
                <StatusBadge status={item.status} label={LEAD_STATUS_LABELS[item.status]} />
                <span className="mono text-sm" style={{ color: 'var(--c-ink)' }}>
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <p className="eyebrow" style={{ color: 'var(--c-muted)' }}>
            Quotations by status
          </p>
          <ul className="mt-4 space-y-2">
            {data.quotes.byStatus.length === 0 && (
              <li className="text-sm" style={{ color: 'var(--c-muted)' }}>
                No quotations yet.
              </li>
            )}
            {data.quotes.byStatus.map((item) => (
              <li key={item.status} className="flex items-center justify-between gap-3">
                <StatusBadge status={item.status} label={QUOTE_STATUS_LABELS[item.status]} />
                <span className="mono text-sm" style={{ color: 'var(--c-ink)' }}>
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
