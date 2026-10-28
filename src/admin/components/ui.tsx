import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn('border', className)}
      style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)', borderRadius: 'var(--radius-lg)' }}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm" style={{ color: 'var(--c-ink-2)' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <Card className="p-5">
      <p className="eyebrow" style={{ color: 'var(--c-muted)' }}>
        {label}
      </p>
      <p className="mono mt-3 text-3xl" style={{ color: 'var(--c-ink)' }}>
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs" style={{ color: 'var(--c-muted)' }}>
          {hint}
        </p>
      )}
    </Card>
  )
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--c-ink-2)' }}>
      <Loader2 size={15} className="animate-spin" aria-hidden="true" />
      {label ?? 'Loading…'}
    </span>
  )
}

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  className,
}: {
  children: ReactNode
  variant?: ButtonVariant
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}) {
  const variantClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'outline'
        ? 'btn-outline'
        : variant === 'danger'
          ? 'btn-outline'
          : 'btn-ghost'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn('btn', variantClass, className)}
      style={variant === 'danger' ? { borderColor: 'rgba(255,107,107,0.5)', color: '#ff8b8b' } : undefined}
    >
      {loading && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs" style={{ color: '#ff8b8b' }}>
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs" style={{ color: 'var(--c-muted)' }}>
          {hint}
        </span>
      ) : null}
    </label>
  )
}

const STATUS_TINTS: Record<string, { bg: string; color: string; border: string }> = {
  new: { bg: 'var(--c-lime-08)', color: 'var(--c-lime)', border: 'var(--c-lime-24)' },
  contacted: { bg: 'rgba(120,170,255,0.08)', color: '#9cc0ff', border: 'rgba(120,170,255,0.3)' },
  qualified: { bg: 'rgba(120,170,255,0.12)', color: '#9cc0ff', border: 'rgba(120,170,255,0.4)' },
  quoted: { bg: 'rgba(255,210,120,0.1)', color: '#ffd278', border: 'rgba(255,210,120,0.34)' },
  won: { bg: 'var(--c-lime-14)', color: 'var(--c-lime)', border: 'var(--c-lime-24)' },
  lost: { bg: 'rgba(255,107,107,0.08)', color: '#ff8b8b', border: 'rgba(255,107,107,0.3)' },
  archived: { bg: 'var(--c-ink-04)', color: 'var(--c-muted)', border: 'var(--c-line)' },
  draft: { bg: 'var(--c-ink-06)', color: 'var(--c-ink-2)', border: 'var(--c-line)' },
  sent: { bg: 'rgba(120,170,255,0.1)', color: '#9cc0ff', border: 'rgba(120,170,255,0.32)' },
  accepted: { bg: 'var(--c-lime-14)', color: 'var(--c-lime)', border: 'var(--c-lime-24)' },
  declined: { bg: 'rgba(255,107,107,0.08)', color: '#ff8b8b', border: 'rgba(255,107,107,0.3)' },
  expired: { bg: 'var(--c-ink-04)', color: 'var(--c-muted)', border: 'var(--c-line)' },
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const tint = STATUS_TINTS[status] ?? STATUS_TINTS.archived
  return (
    <span
      className="mono inline-flex items-center rounded-full border px-2.5 py-1 text-2xs uppercase tracking-widest"
      style={{ background: tint.bg, color: tint.color, borderColor: tint.border }}
    >
      {label}
    </span>
  )
}

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div
      className="border p-10 text-center"
      style={{ borderColor: 'var(--c-line)', borderStyle: 'dashed', borderRadius: 'var(--radius-lg)' }}
    >
      <p className="text-lg" style={{ color: 'var(--c-ink)' }}>
        {title}
      </p>
      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: 'var(--c-muted)' }}>
          {message}
        </p>
      )}
    </div>
  )
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border px-4 py-3 text-sm"
      style={{
        borderColor: 'rgba(255,107,107,0.5)',
        background: 'rgba(255,107,107,0.06)',
        color: '#ffb4b4',
        borderRadius: 'var(--radius)',
      }}
    >
      {message}
    </p>
  )
}
