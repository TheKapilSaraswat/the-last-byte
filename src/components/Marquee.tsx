interface MarqueeProps {
  items: string[]
}

/**
 * Editorial capability ticker. Duplicated track for a seamless loop; the
 * animation is disabled under prefers-reduced-motion via global CSS.
 */
export function Marquee({ items }: MarqueeProps) {
  const track = [...items, ...items]
  return (
    <div
      className="relative overflow-hidden border-y py-4"
      style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
      aria-hidden="true"
    >
      <div className="mask-fade-r flex w-max animate-marquee items-center gap-10 pr-10">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            <span
              className="mono whitespace-nowrap text-xs uppercase tracking-[0.18em]"
              style={{ color: 'var(--c-ink-2)' }}
            >
              {item}
            </span>
            <span style={{ color: 'var(--c-lime)' }}>✳</span>
          </span>
        ))}
      </div>
    </div>
  )
}
