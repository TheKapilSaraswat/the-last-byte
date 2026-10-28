import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ApiError, adminApi, errorMessage } from '../api'
import type { Quote, QuoteStatus } from '../types'
import { QUOTE_STATUSES, QUOTE_STATUS_LABELS } from '../types'
import { formatPaise } from '../../lib/pricing'
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
import { formatDate, formatDateTime } from '../lib/format'

interface ItemDraft {
  description: string
  quantity: string
  unitPrice: string
}

const emptyItem = (): ItemDraft => ({ description: '', quantity: '1', unitPrice: '' })

export function QuotesPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | ''>('')
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await adminApi.quotes({ status: statusFilter || undefined })
      setQuotes(result.quotes)
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
  }, [statusFilter, onUnauthorized])

  useEffect(() => {
    void load()
  }, [load])

  async function changeStatus(quote: Quote, status: QuoteStatus) {
    try {
      await adminApi.setQuoteStatus(quote.id, status)
      await load()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setError(errorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Quotations"
        description="Draft, send and track quotations. Totals are always recomputed on the server."
        actions={
          <>
            <Button variant="outline" onClick={() => void load()}>
              Refresh
            </Button>
            <Button onClick={() => setShowForm((value) => !value)}>
              <Plus size={14} aria-hidden="true" />
              {showForm ? 'Close' : 'New quotation'}
            </Button>
          </>
        }
      />

      {error && <ErrorNote message={error} />}

      {showForm && (
        <QuoteForm
          onUnauthorized={onUnauthorized}
          onCreated={async () => {
            setShowForm(false)
            await load()
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <select
          className="field-input max-w-[12rem]"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as QuoteStatus | '')}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {QUOTE_STATUSES.map((value) => (
            <option key={value} value={value}>
              {QUOTE_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
        <span className="mono text-xs uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
          {total} quotation{total === 1 ? '' : 's'}
        </span>
      </div>

      {loading ? (
        <Spinner label="Loading quotations…" />
      ) : quotes.length === 0 ? (
        <EmptyState title="No quotations yet." message="Create one from a lead or from scratch." />
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <Card key={quote.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mono text-sm" style={{ color: 'var(--c-lime)' }}>
                      {quote.reference}
                    </span>
                    <StatusBadge status={quote.status} label={QUOTE_STATUS_LABELS[quote.status]} />
                  </div>
                  <p className="mt-1 text-sm" style={{ color: 'var(--c-ink)' }}>
                    {quote.customerName}
                    {quote.customerBusiness ? (
                      <span style={{ color: 'var(--c-muted)' }}> · {quote.customerBusiness}</span>
                    ) : null}
                  </p>
                  <p className="mono text-xs" style={{ color: 'var(--c-muted)' }}>
                    {quote.customerContact ?? 'No contact'} · {quote.items.length} item
                    {quote.items.length === 1 ? '' : 's'} · {formatDateTime(quote.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mono text-lg" style={{ color: 'var(--c-ink)' }}>
                    {formatPaise(quote.totalPaise)}
                  </p>
                  <p className="mono text-2xs" style={{ color: 'var(--c-muted)' }}>
                    Subtotal {formatPaise(quote.subtotalPaise)}
                    {quote.discountPaise > 0 ? ` · −${formatPaise(quote.discountPaise)}` : ''}
                    {quote.taxPercent > 0 ? ` · ${quote.taxPercent}% tax` : ''}
                  </p>
                  {quote.validUntil && (
                    <p className="mono text-2xs" style={{ color: 'var(--c-muted)' }}>
                      Valid until {formatDate(quote.validUntil)}
                    </p>
                  )}
                </div>
              </div>

              <ul className="mt-3 space-y-1">
                {quote.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 text-sm" style={{ color: 'var(--c-ink-2)' }}>
                    <span className="min-w-0 truncate">
                      {item.quantity} × {item.description}
                    </span>
                    <span className="mono shrink-0">{formatPaise(item.lineTotalPaise)}</span>
                  </li>
                ))}
              </ul>

              {quote.notes && (
                <p className="mt-2 whitespace-pre-wrap text-xs" style={{ color: 'var(--c-muted)' }}>
                  {quote.notes}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="mono text-2xs uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
                  Status
                </span>
                <select
                  className="field-input max-w-[10rem]"
                  value={quote.status}
                  onChange={(event) => void changeStatus(quote, event.target.value as QuoteStatus)}
                >
                  {QUOTE_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {QUOTE_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function QuoteForm({
  onUnauthorized,
  onCreated,
}: {
  onUnauthorized: () => void
  onCreated: () => Promise<void>
}) {
  const [customerName, setCustomerName] = useState('')
  const [customerBusiness, setCustomerBusiness] = useState('')
  const [customerContact, setCustomerContact] = useState('')
  const [enquiryId, setEnquiryId] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [notes, setNotes] = useState('')
  const [discountRupees, setDiscountRupees] = useState('')
  const [taxPercent, setTaxPercent] = useState('0')
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateItem(index: number, patch: Partial<ItemDraft>) {
    setItems((current) =>
      current.map((item, position) => (position === index ? { ...item, ...patch } : item)),
    )
  }

  async function submit() {
    setError(null)
    if (!customerName.trim()) {
      setError('Add the customer name.')
      return
    }
    const prepared = items
      .filter((item) => item.description.trim())
      .map((item) => {
        const quantity = Number.parseInt(item.quantity || '1', 10)
        const unitPrice = Number(item.unitPrice || '0')
        return {
          description: item.description.trim(),
          quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
          unitPricePaise: Number.isFinite(unitPrice) && unitPrice >= 0 ? Math.round(unitPrice * 100) : 0,
        }
      })
    if (prepared.length === 0) {
      setError('Add at least one line item with a description.')
      return
    }

    setSaving(true)
    try {
      await adminApi.createQuote({
        enquiryId: enquiryId.trim() || null,
        customerName: customerName.trim(),
        customerBusiness: customerBusiness.trim() || null,
        customerContact: customerContact.trim() || null,
        items: prepared,
        discountPaise: Math.round(Math.max(0, Number(discountRupees || '0')) * 100),
        taxPercent: Number.isFinite(Number(taxPercent)) ? Math.max(0, Math.min(100, Number(taxPercent))) : 0,
        notes: notes.trim() || null,
        validUntil: validUntil || null,
      })
      setCustomerName('')
      setCustomerBusiness('')
      setCustomerContact('')
      setEnquiryId('')
      setValidUntil('')
      setNotes('')
      setDiscountRupees('')
      setTaxPercent('0')
      setItems([emptyItem()])
      await onCreated()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-lg">New quotation</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Customer name">
          <input
            className="field-input"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Business (optional)">
          <input
            className="field-input"
            value={customerBusiness}
            onChange={(event) => setCustomerBusiness(event.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Contact (optional)">
          <input
            className="field-input"
            value={customerContact}
            onChange={(event) => setCustomerContact(event.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Linked enquiry ID (optional)" hint="Paste a lead's UUID to link it.">
          <input
            className="field-input"
            value={enquiryId}
            onChange={(event) => setEnquiryId(event.target.value)}
          />
        </Field>
        <Field label="Valid until (optional)">
          <input
            type="date"
            className="field-input"
            value={validUntil}
            onChange={(event) => setValidUntil(event.target.value)}
          />
        </Field>
        <Field label="Tax percent">
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            className="field-input"
            value={taxPercent}
            onChange={(event) => setTaxPercent(event.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <p className="eyebrow mb-2" style={{ color: 'var(--c-muted)' }}>
          Line items
        </p>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_5rem_8rem_auto]">
              <input
                className="field-input"
                placeholder="Description"
                maxLength={400}
                value={item.description}
                onChange={(event) => updateItem(index, { description: event.target.value })}
              />
              <input
                className="field-input"
                type="number"
                min={1}
                max={1000}
                value={item.quantity}
                onChange={(event) => updateItem(index, { quantity: event.target.value })}
                aria-label="Quantity"
              />
              <input
                className="field-input"
                type="number"
                min={0}
                step="0.01"
                placeholder="Unit ₹"
                value={item.unitPrice}
                onChange={(event) => updateItem(index, { unitPrice: event.target.value })}
                aria-label="Unit price in rupees"
              />
              <Button
                variant="ghost"
                onClick={() => setItems((current) => current.filter((_, position) => position !== index))}
                disabled={items.length === 1}
              >
                <Trash2 size={15} aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <Button variant="outline" onClick={() => setItems((current) => [...current, emptyItem()])}>
            <Plus size={14} aria-hidden="true" />
            Add item
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Discount (₹, optional)">
          <input
            type="number"
            min={0}
            step="0.01"
            className="field-input"
            value={discountRupees}
            onChange={(event) => setDiscountRupees(event.target.value)}
          />
        </Field>
        <Field label="Notes (optional)">
          <input
            className="field-input"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={4000}
          />
        </Field>
      </div>

      {error && <div className="mt-4"><ErrorNote message={error} /></div>}

      <div className="mt-5">
        <Button onClick={() => void submit()} loading={saving}>
          Create quotation
        </Button>
      </div>
    </Card>
  )
}
