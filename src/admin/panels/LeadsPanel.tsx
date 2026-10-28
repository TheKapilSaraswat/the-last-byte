import { useCallback, useEffect, useState } from 'react'
import { ApiError, adminApi, errorMessage } from '../api'
import type { EnquiryDetail, EnquiryListItem, LeadStatus } from '../types'
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from '../types'
import {
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Field,
  PanelHeader,
  Spinner,
  StatusBadge,
} from '../components/ui'
import { formatDateTime } from '../lib/format'

function fromLocalInput(value: string): string | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function LeadsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<EnquiryListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await adminApi.enquiries({
        status: statusFilter || undefined,
        search: query || undefined,
      })
      setItems(result.enquiries)
      setTotal(result.total)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [statusFilter, query, onUnauthorized])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Leads"
        description="Every enquiry lands here. Move leads through the pipeline, jot notes and schedule follow-ups."
        actions={
          <Button variant="outline" onClick={() => void load()}>
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[12rem_1fr_auto]">
        <select
          className="field-input"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as LeadStatus | '')}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((value) => (
            <option key={value} value={value}>
              {LEAD_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
        <input
          className="field-input"
          placeholder="Search name, business or contact…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') setQuery(search.trim())
          }}
        />
        <Button onClick={() => setQuery(search.trim())}>Search</Button>
      </div>

      {error && <ErrorNote message={error} />}

      {loading ? (
        <Spinner label="Loading leads…" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No leads match."
          message="Try clearing the filters, or wait for a new enquiry to arrive."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-2">
            <p className="mono text-xs uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
              {total} lead{total === 1 ? '' : 's'}
            </p>
            {items.map((item) => {
              const active = item.id === selectedId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="w-full border p-4 text-left transition-colors"
                  style={{
                    borderColor: active ? 'var(--c-lime-24)' : 'var(--c-line)',
                    background: active ? 'var(--c-lime-08)' : 'var(--c-surface)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm" style={{ color: 'var(--c-ink)' }}>
                        {item.name}
                        {item.business ? (
                          <span style={{ color: 'var(--c-muted)' }}> · {item.business}</span>
                        ) : null}
                      </p>
                      <p className="mono mt-1 truncate text-xs" style={{ color: 'var(--c-muted)' }}>
                        {item.service} · {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={item.leadStatus} label={LEAD_STATUS_LABELS[item.leadStatus]} />
                  </div>
                  {item.openFollowUps > 0 && (
                    <p className="mono mt-2 text-xs" style={{ color: 'var(--c-lime)' }}>
                      {item.openFollowUps} open follow-up{item.openFollowUps === 1 ? '' : 's'}
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          <div>
            {selectedId ? (
              <LeadDetail
                id={selectedId}
                onUnauthorized={onUnauthorized}
                onChanged={() => void load()}
              />
            ) : (
              <Card className="p-8">
                <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
                  Select a lead to see its details, notes and follow-ups.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function LeadDetail({
  id,
  onUnauthorized,
  onChanged,
}: {
  id: string
  onUnauthorized: () => void
  onChanged: () => void
}) {
  const [detail, setDetail] = useState<EnquiryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [followUpNote, setFollowUpNote] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setDetail(await adminApi.enquiry(id))
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id, onUnauthorized])

  useEffect(() => {
    void load()
  }, [load])

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await action()
      await load()
      onChanged()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (loading && !detail) return <Spinner label="Loading lead…" />
  if (error && !detail) return <ErrorNote message={error} />
  if (!detail) return null

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl">{detail.name}</h3>
          <p className="mono mt-1 text-xs" style={{ color: 'var(--c-muted)' }}>
            {formatDateTime(detail.createdAt)}
          </p>
        </div>
        <StatusBadge status={detail.leadStatus} label={LEAD_STATUS_LABELS[detail.leadStatus]} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <Detail label="Contact" value={detail.contact} />
        <Detail label="Business" value={detail.business ?? '—'} />
        <Detail label="Service" value={detail.service} />
        <Detail label="Budget" value={detail.budget ?? '—'} />
        <Detail
          label="Notification email"
          value={detail.emailStatus === 'failed' ? `Failed${detail.emailError ? ` — ${detail.emailError}` : ''}` : detail.emailStatus}
        />
        <Detail label="Open follow-ups" value={String(detail.followUps.filter((f) => !f.completedAt).length)} />
      </div>

      <div className="mt-4 border p-4 text-sm" style={{ borderColor: 'var(--c-line)' }}>
        <p className="eyebrow mb-2" style={{ color: 'var(--c-muted)' }}>
          Project details
        </p>
        <p className="whitespace-pre-wrap" style={{ color: 'var(--c-ink-2)' }}>
          {detail.details}
        </p>
      </div>

      {error && <div className="mt-4"><ErrorNote message={error} /></div>}

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div className="min-w-[12rem] flex-1">
          <Field label="Move to status">
            <select
              className="field-input"
              value={detail.leadStatus}
              disabled={busy}
              onChange={(event) => {
                const next = event.target.value as LeadStatus
                void run(async () => {
                  await adminApi.setLeadStatus(detail.id, next)
                })
              }}
            >
              {LEAD_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {LEAD_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6">
        <p className="eyebrow mb-2" style={{ color: 'var(--c-muted)' }}>
          Notes ({detail.notes.length})
        </p>
        <ul className="space-y-2">
          {detail.notes.map((item) => (
            <li
              key={item.id}
              className="border p-3 text-sm"
              style={{ borderColor: 'var(--c-line)', borderRadius: 'var(--radius)' }}
            >
              <p className="whitespace-pre-wrap" style={{ color: 'var(--c-ink-2)' }}>
                {item.body}
              </p>
              <p className="mono mt-1 text-2xs" style={{ color: 'var(--c-muted)' }}>
                {formatDateTime(item.createdAt)}
              </p>
            </li>
          ))}
          {detail.notes.length === 0 && (
            <li className="text-sm" style={{ color: 'var(--c-muted)' }}>
              No notes yet.
            </li>
          )}
        </ul>
        <div className="mt-3 space-y-2">
          <textarea
            className="field-input"
            rows={3}
            maxLength={4000}
            placeholder="Add an internal note…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button
            loading={busy}
            disabled={!note.trim()}
            onClick={() =>
              void run(async () => {
                await adminApi.addNote(detail.id, note.trim())
                setNote('')
              })
            }
          >
            Add note
          </Button>
        </div>
      </div>

      {/* Follow-ups */}
      <div className="mt-6">
        <p className="eyebrow mb-2" style={{ color: 'var(--c-muted)' }}>
          Follow-ups ({detail.followUps.length})
        </p>
        <ul className="space-y-2">
          {detail.followUps.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 border p-3 text-sm"
              style={{ borderColor: 'var(--c-line)', borderRadius: 'var(--radius)' }}
            >
              <div>
                <p style={{ color: 'var(--c-ink)' }}>{formatDateTime(item.dueAt)}</p>
                {item.note && (
                  <p className="text-xs" style={{ color: 'var(--c-ink-2)' }}>
                    {item.note}
                  </p>
                )}
                <p className="mono text-2xs" style={{ color: 'var(--c-muted)' }}>
                  {item.completedAt ? `Completed ${formatDateTime(item.completedAt)}` : 'Open'}
                </p>
              </div>
              {!item.completedAt && (
                <Button
                  variant="outline"
                  loading={busy}
                  onClick={() =>
                    void run(async () => {
                      await adminApi.completeFollowUp(item.id)
                    })
                  }
                >
                  Complete
                </Button>
              )}
            </li>
          ))}
          {detail.followUps.length === 0 && (
            <li className="text-sm" style={{ color: 'var(--c-muted)' }}>
              No follow-ups yet.
            </li>
          )}
        </ul>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
          <Field label="Due">
            <input
              type="datetime-local"
              className="field-input"
              value={dueAt}
              onChange={(event) => setDueAt(event.target.value)}
            />
          </Field>
          <Field label="Follow-up note (optional)">
            <input
              type="text"
              maxLength={500}
              className="field-input"
              value={followUpNote}
              onChange={(event) => setFollowUpNote(event.target.value)}
            />
          </Field>
        </div>
        <div className="mt-3">
          <Button
            loading={busy}
            disabled={!dueAt}
            onClick={() => {
              const iso = fromLocalInput(dueAt)
              if (!iso) return
              void run(async () => {
                await adminApi.addFollowUp(detail.id, iso, followUpNote.trim() || null)
                setDueAt('')
                setFollowUpNote('')
              })
            }}
          >
            Schedule follow-up
          </Button>
        </div>
      </div>
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono text-2xs uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
        {label}
      </p>
      <p className="mt-0.5 break-words" style={{ color: 'var(--c-ink-2)' }}>
        {value}
      </p>
    </div>
  )
}
