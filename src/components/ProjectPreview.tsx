import type { FC, ReactNode } from 'react'
import type { PreviewKind } from '../data/projects'

/**
 * Art-directed, code-drawn previews for the concept projects. No external
 * images — every element is HTML/CSS so it stays crisp, themed and honest.
 * Previews are decorative, so they are marked aria-hidden with a caption
 * provided by the surrounding card.
 */

function Frame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{ background: 'var(--c-obsidian)', border: '1px solid var(--c-line)' }}
      aria-hidden="true"
    >
      <div
        className="flex shrink-0 items-center gap-2 px-3 py-2"
        style={{ background: 'var(--c-surface-2)', borderBottom: '1px solid var(--c-line)' }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: '#3a4a2c' }} />
        <span className="h-2 w-2 rounded-full" style={{ background: '#2a3324' }} />
        <span className="h-2 w-2 rounded-full" style={{ background: '#2a3324' }} />
        <span
          className="mono ml-2 truncate rounded px-2 py-0.5 text-[9px]"
          style={{ color: 'var(--c-muted)', background: 'var(--c-obsidian)' }}
        >
          {url}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  )
}

function HospitalityMock() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(180deg,#0d120e,#090b0a)' }}>
      <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <path d="M0 190 L90 110 L150 165 L230 80 L320 170 L400 120 L400 240 L0 240 Z" fill="var(--c-surface-2)" />
        <path d="M0 210 L120 150 L210 200 L300 140 L400 190 L400 240 L0 240 Z" fill="var(--c-surface)" />
        <circle cx="320" cy="52" r="20" fill="var(--c-lime)" opacity="0.18" />
      </svg>
      <div className="relative flex h-full flex-col p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="mono text-[10px] tracking-[0.3em]" style={{ color: 'var(--c-lime)' }}>
            RIVERSTONE
          </span>
          <div className="hidden gap-3 sm:flex">
            {['Rooms', 'Dining', 'Location'].map((t) => (
              <span key={t} className="text-[9px]" style={{ color: 'var(--c-ink-2)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="my-auto max-w-[70%]">
          <h4 className="text-lg leading-[1.05] sm:text-3xl" style={{ color: 'var(--c-ink)' }}>
            Stay where the river runs quiet.
          </h4>
          <span
            className="mono mt-3 inline-block px-3 py-1.5 text-[9px] uppercase"
            style={{ background: 'var(--c-lime)', color: '#080a06' }}
          >
            Check availability
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Deluxe', 'Suite', 'Family'].map((t) => (
            <div
              key={t}
              className="p-2"
              style={{ background: 'rgba(17,21,18,0.8)', border: '1px solid var(--c-line)' }}
            >
              <div className="mb-2 h-8" style={{ background: 'var(--c-surface-2)' }} />
              <span className="text-[8px]" style={{ color: 'var(--c-ink-2)' }}>
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MenuMock() {
  const dishes = [
    ['Paneer Tikka', '₹280'],
    ['Dal Makhani', '₹240'],
    ['Wood-fired Pizza', '₹360'],
    ['Cold Brew', '₹180'],
  ]
  return (
    <div className="h-full w-full p-4 sm:p-6" style={{ background: 'linear-gradient(160deg,#101511,#090b0a)' }}>
      <div className="flex items-center justify-between">
        <span className="mono text-[10px] tracking-[0.28em]" style={{ color: 'var(--c-lime)' }}>
          SPICE ROOM
        </span>
        <span className="mono text-[8px]" style={{ color: 'var(--c-muted)' }}>
          QR MENU
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        {['Starters', 'Mains', 'Drinks'].map((t, i) => (
          <span
            key={t}
            className="mono rounded-full px-2.5 py-1 text-[8px] uppercase"
            style={
              i === 0
                ? { background: 'var(--c-lime)', color: '#080a06' }
                : { color: 'var(--c-ink-2)', border: '1px solid var(--c-line)' }
            }
          >
            {t}
          </span>
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {dishes.map(([name, price]) => (
          <li
            key={name}
            className="flex items-center justify-between border-b pb-2"
            style={{ borderColor: 'var(--c-line)' }}
          >
            <div>
              <p className="text-[11px]" style={{ color: 'var(--c-ink)' }}>
                {name}
              </p>
              <p className="text-[8px]" style={{ color: 'var(--c-muted)' }}>
                Chef&apos;s special
              </p>
            </div>
            <span className="mono text-[10px]" style={{ color: 'var(--c-lime)' }}>
              {price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DashboardMock() {
  const bars = [40, 62, 48, 78, 56, 88, 70]
  return (
    <div className="flex h-full w-full" style={{ background: 'var(--c-obsidian)' }}>
      <div
        className="hidden w-1/4 flex-col gap-2 p-3 sm:flex"
        style={{ background: 'var(--c-surface-2)', borderRight: '1px solid var(--c-line)' }}
      >
        <span className="mono mb-2 text-[8px]" style={{ color: 'var(--c-lime)' }}>
          PIPELINE
        </span>
        {['Overview', 'Leads', 'Reports', 'Team'].map((t, i) => (
          <span
            key={t}
            className="rounded px-2 py-1 text-[8px]"
            style={i === 1 ? { background: 'var(--c-lime-14)', color: 'var(--c-lime)' } : { color: 'var(--c-ink-2)' }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex-1 p-3 sm:p-4">
        <div className="grid grid-cols-3 gap-2">
          {[['Leads', '128'], ['Won', '46'], ['Rate', '36%']].map(([label, value], i) => (
            <div key={label} className="p-2" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-line)' }}>
              <p className="mono text-[7px] uppercase" style={{ color: 'var(--c-muted)' }}>
                {label}
              </p>
              <p className="text-sm" style={{ color: i === 1 ? 'var(--c-lime)' : 'var(--c-ink)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-20 items-end gap-1.5 p-2" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-line)' }}>
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1"
              style={{ height: `${h}%`, background: i === 5 ? 'var(--c-lime)' : 'var(--c-line-strong)' }}
            />
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {[80, 64, 72].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--c-lime)' }} />
              <span className="h-2 rounded" style={{ width: `${w}%`, background: 'var(--c-line)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EducationMock() {
  return (
    <div className="h-full w-full p-4 sm:p-6" style={{ background: 'linear-gradient(180deg,#101511,#090b0a)' }}>
      <div className="flex items-center justify-between">
        <span className="mono text-[10px] tracking-[0.28em]" style={{ color: 'var(--c-lime)' }}>
          ASCENT
        </span>
        <div className="hidden gap-3 sm:flex">
          {['Programmes', 'Faculty', 'Results'].map((t) => (
            <span key={t} className="text-[9px]" style={{ color: 'var(--c-ink-2)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <h4 className="mt-4 max-w-[80%] text-base leading-tight sm:text-2xl" style={{ color: 'var(--c-ink)' }}>
        Focused coaching, measured results.
      </h4>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {['Foundation', 'Advanced', 'Crash Course', 'Weekend'].map((t) => (
          <div key={t} className="p-2" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-line)' }}>
            <div className="mb-2 h-6" style={{ background: 'var(--c-surface-2)' }} />
            <p className="text-[9px]" style={{ color: 'var(--c-ink)' }}>
              {t}
            </p>
            <p className="mono text-[7px]" style={{ color: 'var(--c-lime)' }}>
              Enquire →
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const MOCKS: Record<PreviewKind, FC> = {
  hospitality: HospitalityMock,
  menu: MenuMock,
  dashboard: DashboardMock,
  education: EducationMock,
}

const URLS: Record<PreviewKind, string> = {
  hospitality: 'riverstone.example — concept',
  menu: 'menu.spiceroom — concept',
  dashboard: 'app.pipeline — prototype',
  education: 'ascent.institute — concept',
}

export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  const Mock = MOCKS[kind]
  return (
    <Frame url={URLS[kind]}>
      <Mock />
    </Frame>
  )
}
