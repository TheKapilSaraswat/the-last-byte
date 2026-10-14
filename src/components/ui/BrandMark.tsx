interface BrandMarkProps {
  size?: number
  className?: string
  /** Use the full-colour lime mark (default) or a single-colour ink version. */
  tone?: 'lime' | 'ink'
  title?: string
}

/**
 * Custom "The Last Byte" monogram: an L formed from pixel blocks with a
 * terminal cursor. Designed in SVG — no emoji, no raster assets.
 */
export function BrandMark({
  size = 34,
  className,
  tone = 'lime',
  title = 'The Last Byte',
}: BrandMarkProps) {
  const accent = tone === 'lime' ? 'var(--c-lime)' : 'var(--c-ink)'
  const soft = tone === 'lime' ? 'var(--c-lime-soft)' : 'var(--c-ink-2)'
  const ghost = tone === 'lime' ? 'var(--c-ink-2)' : 'var(--c-muted)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <rect x="1.5" y="1.5" width="61" height="61" rx="12" fill="var(--c-surface)" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="12"
        fill="none"
        stroke={accent}
        strokeOpacity="0.28"
      />
      {/* "L" stem + foot */}
      <rect x="15" y="16" width="6.5" height="30" fill={accent} />
      <rect x="15" y="40" width="20" height="6.5" fill={accent} />
      {/* "B"-ish pixel column */}
      <rect x="40" y="16" width="6.5" height="6.5" fill={soft} />
      <rect x="40" y="25.5" width="6.5" height="6.5" fill={ghost} />
      <rect x="40" y="35" width="6.5" height="6.5" fill={soft} />
      <rect x="40" y="44.5" width="6.5" height="6.5" fill={accent} />
      {/* Terminal cursor */}
      <rect x="49" y="44.5" width="6.5" height="6.5" fill={accent} opacity="0.55" />
    </svg>
  )
}

interface WordmarkProps {
  size?: number
  className?: string
}

export function Wordmark({ size = 34, className }: WordmarkProps) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 11 }}>
      <BrandMark size={size} />
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          letterSpacing: '-0.01em',
          fontSize: size * 0.46,
          lineHeight: 1,
        }}
      >
        THE LAST <span style={{ color: 'var(--c-lime)' }}>BYTE</span>
      </span>
    </span>
  )
}
