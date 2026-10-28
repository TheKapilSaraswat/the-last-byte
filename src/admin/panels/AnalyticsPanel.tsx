import { useCallback, useEffect, useState } from 'react'
import { ApiError, adminApi, errorMessage } from '../api'
import type { AnalyticsSummary } from '../types'
import {
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Field,
  PanelHeader,
  Spinner,
  Stat,
} from '../components/ui'
import { formatDate } from '../lib/format'

interface AnalyticsData {
  summary: AnalyticsSummary
  from: string
  to: string
  retentionDays: number
}

function dayStartIso(value: string): string | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function dayEndIso(value: string): string | null {
  if (!value) return null
  const date = new Date(`${value}T23:59:59.999`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function AnalyticsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (range: { from?: string; to?: string } = {}) => {
      setLoading(true)
      setError(null)
      try {
        setData(await adminApi.analytics(range))
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          onUnauthorized()
          return
        }
        setError(errorMessage(err))
      } finally {
        setLoading(false)
      }
    },
    [onUnauthorized],
  )

  useEffect(() => {
    void load()
  }, [load])

  function applyRange() {
    const fromIso = dayStartIso(from)
    const toIso = dayEndIso(to)
    if (fromIso && toIso && new Date(fromIso) > new Date(toIso)) {
      setError('The start date must be before the end date.')
      return
    }
    void load({ from: fromIso ?? undefined, to: toIso ?? undefined })
  }

  function resetRange() {
    setFrom('')
    setTo('')
    void load()
  }

  const summary = data?.summary
  const maxDaily = summary
    ? Math.max(1, ...summary.daily.map((point) => Math.max(point.pageViews, point.visitors)))
    : 1

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Analytics"
        description="First-party, privacy-respecting traffic from your own site. No third-party trackers."
        actions={
          <Button variant="outline" onClick={() => void load()}>
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <Field label="From">
          <input
            type="date"
            className="field-input"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </Field>
        <Field label="To">
          <input
            type="date"
            className="field-input"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </Field>
        <Button onClick={applyRange}>Apply</Button>
        <Button variant="ghost" onClick={resetRange}>
          Reset
        </Button>
      </div>

      {error && <ErrorNote message={error} />}

      {loading ? (
        <Spinner label="Loading analytics…" />
      ) : !data || !summary ? (
        <EmptyState title="No analytics data." />
      ) : (
        <>
          <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
            {formatDate(data.from)} — {formatDate(data.to)} · retained for {data.retentionDays} days
          </p>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Stat label="Page views" value={summary.totals.pageViews.toLocaleString('en-IN')} />
            <Stat label="Visitors" value={summary.totals.visitors.toLocaleString('en-IN')} />
            <Stat label="CTA clicks" value={summary.totals.ctaClicks.toLocaleString('en-IN')} />
            <Stat label="Service views" value={summary.totals.serviceViews.toLocaleString('en-IN')} />
            <Stat label="All events" value={summary.totals.events.toLocaleString('en-IN')} />
          </div>

          <Card className="p-5 sm:p-6">
            <p className="eyebrow" style={{ color: 'var(--c-muted)' }}>
              Daily traffic
            </p>
            {summary.daily.length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: 'var(--c-muted)' }}>
                No events in this range.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {summary.daily.map((point) => (
                  <div key={point.date} className="flex items-center gap-3">
                    <span className="mono w-20 shrink-0 text-2xs" style={{ color: 'var(--c-muted)' }}>
                      {formatDate(point.date)}
                    </span>
                    <div className="flex flex-1 items-center gap-1">
                      <div
                        className="h-3 rounded-sm"
                        style={{
                          width: `${(point.pageViews / maxDaily) * 100}%`,
                          background: 'var(--c-lime)',
                          minWidth: point.pageViews > 0 ? '2px' : '0',
                        }}
                        title={`${point.pageViews} page views`}
                      />
                      <div
                        className="h-3 rounded-sm"
                        style={{
                          width: `${(point.visitors / maxDaily) * 100}%`,
                          background: 'rgba(120,170,255,0.7)',
                          minWidth: point.visitors > 0 ? '2px' : '0',
                        }}
                        title={`${point.visitors} visitors`}
                      />
                    </div>
                    <span className="mono w-24 shrink-0 text-right text-2xs" style={{ color: 'var(--c-ink-2)' }}>
                      {point.pageViews} / {point.visitors}
                    </span>
                  </div>
                ))}
                <div className="mono flex gap-4 pt-2 text-2xs" style={{ color: 'var(--c-muted)' }}>
                  <span>
                    <span style={{ color: 'var(--c-lime)' }}>■</span> page views
                  </span>
                  <span>
                    <span style={{ color: 'rgba(120,170,255,0.9)' }}>■</span> visitors
                  </span>
                </div>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Breakdown title="Enquiry funnel" rows={[
              { label: 'Opened', value: summary.funnel.opened },
              { label: 'Started', value: summary.funnel.started },
              { label: 'Submitted', value: summary.funnel.submitted },
              { label: 'Failed', value: summary.funnel.failed },
            ]} />
            <Breakdown title="Top pages" rows={summary.topPages.map((item) => ({ label: item.key || '/', value: item.count }))} />
            <Breakdown title="Top services" rows={summary.topServices.map((item) => ({ label: item.key || '—', value: item.count }))} />
          </div>

          <Breakdown
            title="Event breakdown"
            rows={summary.eventCounts.map((item) => ({ label: item.key, value: item.count }))}
          />
        </>
      )}
    </div>
  )
}

function Breakdown({
  title,
  rows,
}: {
  title: string
  rows: { label: string; value: number }[]
}) {
  const max = Math.max(1, ...rows.map((row) => row.value))
  return (
    <Card className="p-5">
      <p className="eyebrow" style={{ color: 'var(--c-muted)' }}>
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm" style={{ color: 'var(--c-muted)' }}>
          No data.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate" style={{ color: 'var(--c-ink-2)' }}>
                  {row.label}
                </span>
                <span className="mono shrink-0" style={{ color: 'var(--c-ink)' }}>
                  {row.value}
                </span>
              </div>
              <div className="mt-1 h-1 w-full" style={{ background: 'var(--c-ink-06)' }}>
                <div
                  className="h-1"
                  style={{ width: `${(row.value / max) * 100}%`, background: 'var(--c-lime-24)' }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
