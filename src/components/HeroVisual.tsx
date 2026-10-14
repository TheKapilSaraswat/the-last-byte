import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'

interface Module {
  id: string
  label: string
  x: number
  y: number
  path: string
  delay: number
}

const CORE = { x: 320, y: 250, size: 116 }

const MODULES: Module[] = [
  {
    id: 'web',
    label: 'WEB',
    x: 92,
    y: 116,
    delay: 0.5,
    path: 'M 150 145 H 246 V 268 H 320',
  },
  {
    id: 'menu',
    label: 'MENU',
    x: 596,
    y: 104,
    delay: 0.68,
    path: 'M 596 133 H 500 V 268 H 436',
  },
  {
    id: 'data',
    label: 'DATA',
    x: 108,
    y: 424,
    delay: 0.86,
    path: 'M 166 453 H 262 V 348 H 320',
  },
  {
    id: 'auto',
    label: 'AUTO',
    x: 588,
    y: 424,
    delay: 1.04,
    path: 'M 588 453 H 492 V 348 H 436',
  },
]

const moduleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

/**
 * The hero's signature visual: a modular digital system assembling itself.
 * Built entirely in SVG so it stays crisp, themeable and lightweight.
 */
export function HeroVisual() {
  const reduce = useReducedMotion()

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 760 580"
        className="w-full"
        style={{ overflow: 'visible' }}
        role="img"
        aria-label="Diagram of a modular digital system: a central core connecting website, menu, data and automation modules"
      >
        <defs>
          <linearGradient id="coreFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--c-surface-2)" />
            <stop offset="100%" stopColor="var(--c-surface)" />
          </linearGradient>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Registration crosses */}
        {[
          [40, 40],
          [720, 40],
          [40, 540],
          [720, 540],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`} stroke="var(--c-line-strong)" strokeWidth="1">
            <line x1={x - 7} y1={y} x2={x + 7} y2={y} />
            <line x1={x} y1={y - 7} x2={x} y2={y + 7} />
          </g>
        ))}

        {/* Coordinate annotations */}
        <text x="320" y="34" fill="var(--c-muted)" fontSize="10" className="mono" textAnchor="middle">
          X:0380 / Y:0300
        </text>
        <text x="40" y="300" fill="var(--c-muted)" fontSize="10" className="mono" transform="rotate(-90 40 300)" textAnchor="middle">
          SYSTEM / CORE
        </text>

        {/* Connector paths — dashed "signal" flow driven purely by CSS */}
        <g fill="none" strokeLinecap="square">
          {MODULES.map((m) => (
            <path
              key={m.id}
              d={m.path}
              stroke="var(--c-lime)"
              strokeOpacity="0.5"
              strokeWidth="1.25"
              strokeDasharray="4 8"
              style={
                reduce
                  ? undefined
                  : {
                      animation: `signal-dash 3s linear ${m.delay}s infinite`,
                      strokeDashoffset: 24,
                    }
              }
            />
          ))}
        </g>

        {/* Central core */}
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '378px 308px' }}
        >
          <rect
            x={CORE.x}
            y={CORE.y}
            width={CORE.size}
            height={CORE.size}
            rx="6"
            fill="url(#coreFill)"
            stroke="var(--c-lime)"
            strokeWidth="1.5"
            filter="url(#softGlow)"
          />
          {/* Pixel grid inside core */}
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((__, col) => {
              const filled = (row + col) % 3 === 0 || (row === 1 && col === 2)
              return (
                <rect
                  key={`${row}-${col}`}
                  x={CORE.x + 16 + col * 21}
                  y={CORE.y + 16 + row * 21}
                  width="14"
                  height="14"
                  fill={filled ? 'var(--c-lime)' : 'var(--c-line)'}
                  opacity={filled ? 0.9 : 1}
                />
              )
            }),
          )}
          <text
            x={CORE.x + CORE.size / 2}
            y={CORE.y + CORE.size + 20}
            fill="var(--c-ink)"
            fontSize="11"
            className="mono"
            textAnchor="middle"
          >
            CORE / TLB
          </text>
        </motion.g>

        {/* Rotating signal ring */}
        <motion.circle
          cx="378"
          cy="308"
          r="96"
          fill="none"
          stroke="var(--c-lime)"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="2 10"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '378px 308px' }}
        />

        {/* Satellite modules */}
        {MODULES.map((m) => (
          <motion.g
            key={m.id}
            custom={m.delay}
            variants={moduleVariants}
            initial={reduce ? false : 'hidden'}
            whileInView={reduce ? undefined : 'show'}
            viewport={{ once: true }}
            style={{ transformOrigin: `${m.x + 29}px ${m.y + 29}px` }}
          >
            <rect
              x={m.x}
              y={m.y}
              width="58"
              height="58"
              rx="3"
              fill="var(--c-surface)"
              stroke="var(--c-line-strong)"
              strokeWidth="1"
            />
            <rect x={m.x + 10} y={m.y + 10} width="9" height="9" fill="var(--c-lime)" />
            <line
              x1={m.x + 10}
              y1={m.y + 30}
              x2={m.x + 48}
              y2={m.y + 30}
              stroke="var(--c-line-strong)"
            />
            <line
              x1={m.x + 10}
              y1={m.y + 40}
              x2={m.x + 36}
              y2={m.y + 40}
              stroke="var(--c-line)"
            />
            <text
              x={m.x + 29}
              y={m.y + 56}
              fill="var(--c-muted)"
              fontSize="9"
              className="mono"
              textAnchor="middle"
              letterSpacing="1.5"
            >
              {m.label}
            </text>
            <circle
              cx={m.x + 29}
              cy={m.y}
              r="2.6"
              fill="var(--c-lime)"
              style={{ animation: 'pulse-node 3.2s ease-in-out infinite' }}
            />
          </motion.g>
        ))}
      </svg>

      {/* Scan line + grain overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-x-0 h-24"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(198,255,94,0.05), transparent)',
            animation: reduce ? undefined : 'scan 7s linear infinite',
          }}
        />
      </div>
    </div>
  )
}
