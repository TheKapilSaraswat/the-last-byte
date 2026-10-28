import { useCallback, useEffect, useState } from 'react'
import { ApiError, adminApi, errorMessage } from '../api'
import type { PricingPlan } from '../types'
import { services } from '../../data/services'
import { formatPaise } from '../../lib/pricing'
import {
  Button,
  Card,
  ErrorNote,
  Field,
  PanelHeader,
  Spinner,
  StatusBadge,
} from '../components/ui'

const SERVICE_TITLES: Record<string, string> = Object.fromEntries(
  services.map((service) => [service.id, service.title]),
)

const MAX_PERCENT = 90

function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromLocalInput(value: string): string | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function PricingPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      setPlans(await adminApi.pricingPlans())
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [onUnauthorized])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) return <Spinner label="Loading pricing…" />

  // Group plans by service, preserving their order.
  const groups = new Map<string, PricingPlan[]>()
  for (const plan of plans) {
    const list = groups.get(plan.serviceId) ?? []
    list.push(plan)
    groups.set(plan.serviceId, list)
  }

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Pricing & discounts"
        description="Prices are stored in integer paise and published to the site. A discount only applies to the public price while it is enabled and inside its date window."
        actions={
          <Button variant="outline" onClick={() => void load()}>
            Refresh
          </Button>
        }
      />

      {error && <ErrorNote message={error} />}

      {plans.length === 0 && !error && (
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
          No plans found. Run the database seed migration.
        </p>
      )}

      <div className="space-y-8">
        {[...groups.entries()].map(([serviceId, servicePlans]) => (
          <div key={serviceId}>
            <h3 className="mb-3 text-lg">{SERVICE_TITLES[serviceId] ?? serviceId}</h3>
            <div className="space-y-4">
              {servicePlans.map((plan) => (
                <PlanRow key={plan.id} plan={plan} onSaved={load} onUnauthorized={onUnauthorized} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlanRow({
  plan,
  onSaved,
  onUnauthorized,
}: {
  plan: PricingPlan
  onSaved: () => Promise<void>
  onUnauthorized: () => void
}) {
  const [priceRupees, setPriceRupees] = useState(
    plan.pricePaise === null ? '' : String(plan.pricePaise / 100),
  )
  const [isActive, setIsActive] = useState(plan.isActive)
  const [priceSaving, setPriceSaving] = useState(false)
  const [priceError, setPriceError] = useState<string | null>(null)

  const [discountEnabled, setDiscountEnabled] = useState(plan.discount?.enabled ?? false)
  const [percent, setPercent] = useState(String(plan.discount?.percent ?? 0))
  const [label, setLabel] = useState(plan.discount?.label ?? '')
  const [startsAt, setStartsAt] = useState(toLocalInput(plan.discount?.startsAt ?? null))
  const [expiresAt, setExpiresAt] = useState(toLocalInput(plan.discount?.expiresAt ?? null))
  const [discountSaving, setDiscountSaving] = useState(false)
  const [discountError, setDiscountError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const label2 = plan.name ?? `${plan.serviceId}/${plan.planKey}`
  const deprecated = plan.discount?.enabled && !isLive(plan)

  async function savePrice() {
    setPriceSaving(true)
    setPriceError(null)
    setNotice(null)
    try {
      let pricePaise: number | null = null
      const trimmed = priceRupees.trim()
      if (trimmed !== '') {
        const rupees = Number(trimmed)
        if (!Number.isFinite(rupees) || rupees < 0) {
          setPriceError('Enter a valid price in rupees, or leave it empty for a custom quote.')
          return
        }
        pricePaise = Math.round(rupees * 100)
      }
      await adminApi.updatePlanPrice(plan.id, { pricePaise, isActive })
      setNotice('Price saved.')
      await onSaved()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setPriceError(errorMessage(err))
    } finally {
      setPriceSaving(false)
    }
  }

  async function saveDiscount() {
    setDiscountSaving(true)
    setDiscountError(null)
    setNotice(null)
    try {
      const parsedPercent = Number(percent)
      if (!Number.isInteger(parsedPercent) || parsedPercent < 0 || parsedPercent > MAX_PERCENT) {
        setDiscountError(`Enter a whole percentage between 0 and ${MAX_PERCENT}.`)
        return
      }
      await adminApi.updateDiscount(plan.id, {
        enabled: discountEnabled,
        percent: parsedPercent,
        label: label.trim() ? label.trim() : null,
        startsAt: fromLocalInput(startsAt),
        expiresAt: fromLocalInput(expiresAt),
      })
      setNotice('Discount saved.')
      await onSaved()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      setDiscountError(errorMessage(err))
    } finally {
      setDiscountSaving(false)
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg">{label2}</h4>
            {!plan.isActive && <StatusBadge status="archived" label="Hidden" />}
            {isLive(plan) && (
              <StatusBadge status="won" label={`${plan.discount?.percent ?? 0}% live`} />
            )}
            {deprecated && <StatusBadge status="expired" label="Scheduled / inactive" />}
          </div>
          <p className="mono mt-1 text-xs" style={{ color: 'var(--c-muted)' }}>
            {plan.serviceId} / {plan.planKey}
          </p>
        </div>
        <div className="text-right">
          <p className="mono text-sm" style={{ color: 'var(--c-ink-2)' }}>
            Base:{' '}
            {plan.pricePaise === null ? 'Custom quote' : formatPaise(plan.pricePaise)}
          </p>
          {isLive(plan) && plan.discount && plan.pricePaise !== null && (
            <p className="mono text-xs" style={{ color: 'var(--c-lime)' }}>
              Live:{' '}
              {formatPaise(Math.round(plan.pricePaise * (1 - plan.discount.percent / 100)))}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Base price */}
        <div className="space-y-3">
          <p className="eyebrow" style={{ color: 'var(--c-muted)' }}>
            Base price
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[10rem] flex-1">
              <Field
                label="Price (₹)"
                hint="Leave empty for a custom quote."
                error={priceError ?? undefined}
              >
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="field-input"
                  value={priceRupees}
                  onChange={(event) => setPriceRupees(event.target.value)}
                  placeholder="Custom quote"
                />
              </Field>
            </div>
            <label className="mono flex items-center gap-2 pb-3 text-xs uppercase tracking-widest" style={{ color: 'var(--c-ink-2)' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              Published
            </label>
            <div className="pb-2">
              <Button onClick={() => void savePrice()} loading={priceSaving}>
                Save price
              </Button>
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className="space-y-3">
          <p className="eyebrow" style={{ color: 'var(--c-muted)' }}>
            Discount
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Percent (0–${MAX_PERCENT})`} error={discountError ?? undefined}>
              <input
                type="number"
                min={0}
                max={MAX_PERCENT}
                step={1}
                className="field-input"
                value={percent}
                onChange={(event) => setPercent(event.target.value)}
              />
            </Field>
            <Field label="Promo label">
              <input
                type="text"
                maxLength={80}
                className="field-input"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="e.g. Launch offer"
              />
            </Field>
            <Field label="Starts (optional)">
              <input
                type="datetime-local"
                className="field-input"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
              />
            </Field>
            <Field label="Expires (optional)">
              <input
                type="datetime-local"
                className="field-input"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="mono flex items-center gap-2 text-xs uppercase tracking-widest" style={{ color: 'var(--c-ink-2)' }}>
              <input
                type="checkbox"
                checked={discountEnabled}
                onChange={(event) => setDiscountEnabled(event.target.checked)}
              />
              Enabled
            </label>
            <Button onClick={() => void saveDiscount()} loading={discountSaving} variant="outline">
              Save discount
            </Button>
            {notice && (
              <span className="text-xs" style={{ color: 'var(--c-lime)' }}>
                {notice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

/** True when the discount is enabled and currently inside its date window. */
function isLive(plan: PricingPlan): boolean {
  const discount = plan.discount
  if (!discount || !discount.enabled) return false
  const now = Date.now()
  if (discount.startsAt && new Date(discount.startsAt).getTime() > now) return false
  if (discount.expiresAt && new Date(discount.expiresAt).getTime() <= now) return false
  return true
}
