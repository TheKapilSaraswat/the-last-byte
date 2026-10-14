/* eslint-disable react-refresh/only-export-components -- art component map shares a file with its motifs */
/** Lightweight, art-directed SVG motifs — one per service. */

const line = 'var(--c-line)'
const strong = 'var(--c-line-strong)'
const lime = 'var(--c-lime)'
const surface = 'var(--c-surface)'

export function WebsitesArt() {
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full" role="img" aria-label="Website wireframe motif">
      <rect x="1" y="1" width="318" height="188" rx="6" fill={surface} stroke={strong} />
      <rect x="1" y="1" width="318" height="24" rx="6" fill="var(--c-surface-2)" />
      <circle cx="16" cy="13" r="3" fill={lime} />
      <circle cx="28" cy="13" r="3" fill={strong} />
      <circle cx="40" cy="13" r="3" fill={strong} />
      <rect x="60" y="9" width="120" height="8" rx="4" fill={line} />
      <rect x="16" y="40" width="150" height="14" rx="3" fill="var(--c-ink)" opacity="0.85" />
      <rect x="16" y="62" width="190" height="8" rx="3" fill={line} />
      <rect x="16" y="76" width="160" height="8" rx="3" fill={line} />
      <rect x="16" y="98" width="74" height="20" rx="3" fill={lime} />
      <rect x="16" y="132" width="88" height="42" rx="4" fill="var(--c-surface-2)" stroke={line} />
      <rect x="112" y="132" width="88" height="42" rx="4" fill="var(--c-surface-2)" stroke={line} />
      <rect x="208" y="132" width="96" height="42" rx="4" fill="var(--c-surface-2)" stroke={line} />
      <rect x="226" y="48" width="80" height="66" rx="5" fill="none" stroke={lime} strokeOpacity="0.5" />
      <path d="M232 100 L252 78 L266 90 L282 66 L300 84" fill="none" stroke={lime} strokeWidth="1.5" />
    </svg>
  )
}

export function MenuArt() {
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full" role="img" aria-label="Digital menu on a phone motif">
      <rect x="112" y="6" width="96" height="178" rx="14" fill={surface} stroke={strong} />
      <rect x="122" y="20" width="76" height="10" rx="3" fill="var(--c-ink)" opacity="0.8" />
      <rect x="122" y="38" width="34" height="8" rx="4" fill={lime} />
      <rect x="160" y="38" width="34" height="8" rx="4" fill={line} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="122" y={58 + i * 24} width="52" height="7" rx="3" fill={strong} />
          <rect x="122" y={69 + i * 24} width="66" height="5" rx="2" fill={line} />
          <text x="190" y={66 + i * 24} fill={lime} fontSize="9" className="mono" textAnchor="end">
            ₹
          </text>
        </g>
      ))}
      <rect x="122" y="160" width="76" height="0" fill="none" />
      {/* QR */}
      <rect x="26" y="58" width="60" height="60" rx="4" fill="var(--c-surface-2)" stroke={line} />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) =>
          (r * 5 + c) % 3 === 0 ? (
            <rect key={`${r}-${c}`} x={32 + c * 10} y={64 + r * 10} width="7" height="7" fill={r === 2 && c === 2 ? lime : strong} />
          ) : null,
        ),
      )}
      <text x="56" y="136" fill="var(--c-muted)" fontSize="8" className="mono" textAnchor="middle">
        SCAN
      </text>
      <path d="M234 88 H258" stroke={lime} strokeWidth="1.25" strokeDasharray="3 5" />
      <rect x="230" y="70" width="74" height="12" rx="3" fill={line} />
      <rect x="230" y="90" width="74" height="12" rx="3" fill={line} />
      <rect x="230" y="110" width="52" height="12" rx="3" fill={lime} opacity="0.5" />
    </svg>
  )
}

export function SoftwareArt() {
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full" role="img" aria-label="Business dashboard motif">
      <rect x="1" y="1" width="318" height="188" rx="6" fill={surface} stroke={strong} />
      <rect x="14" y="14" width="70" height="36" rx="4" fill="var(--c-surface-2)" stroke={line} />
      <rect x="92" y="14" width="70" height="36" rx="4" fill="var(--c-surface-2)" stroke={line} />
      <rect x="170" y="14" width="70" height="36" rx="4" fill="var(--c-surface-2)" stroke={line} />
      <rect x="248" y="14" width="58" height="36" rx="4" fill={lime} opacity="0.16" stroke={lime} strokeOpacity="0.4" />
      <rect x="22" y="22" width="26" height="6" rx="3" fill={line} />
      <rect x="22" y="34" width="40" height="10" rx="3" fill="var(--c-ink)" opacity="0.8" />
      <rect x="100" y="22" width="26" height="6" rx="3" fill={line} />
      <rect x="100" y="34" width="34" height="10" rx="3" fill="var(--c-ink)" opacity="0.55" />
      <rect x="178" y="22" width="26" height="6" rx="3" fill={line} />
      <rect x="178" y="34" width="44" height="10" rx="3" fill="var(--c-ink)" opacity="0.55" />
      <rect x="256" y="22" width="26" height="6" rx="3" fill={lime} />
      <rect x="256" y="34" width="30" height="10" rx="3" fill={lime} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const h = [30, 52, 40, 66, 48, 78, 58][i]
        return (
          <rect key={i} x={22 + i * 30} y={172 - h} width="16" height={h} rx="2" fill={i === 5 ? lime : strong} />
        )
      })}
      <line x1="14" y1="176" x2="306" y2="176" stroke={line} />
    </svg>
  )
}

export function AutomationArt() {
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full" role="img" aria-label="Automation flow motif">
      <rect x="18" y="20" width="86" height="34" rx="4" fill={surface} stroke={strong} />
      <rect x="18" y="78" width="86" height="34" rx="4" fill={surface} stroke={line} />
      <rect x="18" y="136" width="86" height="34" rx="4" fill={surface} stroke={line} />
      <text x="30" y="40" fill={strong} fontSize="8" className="mono">TRIGGER</text>
      <text x="30" y="98" fill={strong} fontSize="8" className="mono">PROCESS</text>
      <text x="30" y="156" fill={strong} fontSize="8" className="mono">DELIVER</text>
      <rect x="216" y="72" width="86" height="46" rx="4" fill={lime} opacity="0.14" stroke={lime} strokeOpacity="0.5" />
      <text x="228" y="92" fill={lime} fontSize="8" className="mono">AUTOMATED</text>
      <text x="228" y="104" fill={strong} fontSize="8" className="mono">OUTCOME</text>
      <path d="M104 37 H160 V95 H216" fill="none" stroke={lime} strokeWidth="1.25" strokeDasharray="4 6" />
      <path d="M104 95 H216" fill="none" stroke={lime} strokeWidth="1.25" strokeDasharray="4 6" />
      <path d="M104 153 H160 V95" fill="none" stroke={lime} strokeWidth="1.25" strokeDasharray="4 6" />
      <circle cx="160" cy="95" r="3.5" fill={lime} />
      <circle cx="104" cy="37" r="2.5" fill={lime} />
      <circle cx="104" cy="153" r="2.5" fill={lime} />
    </svg>
  )
}

export const serviceArt = {
  websites: WebsitesArt,
  menus: MenuArt,
  software: SoftwareArt,
  automation: AutomationArt,
} as const

export type ServiceArtKey = keyof typeof serviceArt
