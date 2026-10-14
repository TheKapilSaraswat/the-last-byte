import { principles } from '../data/principles'
import { Reveal } from './ui/Reveal'

export function Approach() {
  return (
    <section id="about" className="section relative" style={{ background: 'var(--c-surface)' }}>
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Sticky intro */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="mb-5 flex items-center gap-3">
              <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                04
              </span>
              <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                Why The Last Byte
              </span>
            </div>
            <h2 className="text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.02]">
              A studio that thinks in systems.
            </h2>
            <p className="mt-5 max-w-md" style={{ color: 'var(--c-ink-2)' }}>
              We are an independent studio, which means you talk to the people doing the work. No
              account managers, no hand-offs — just careful, hands-on building.
            </p>
            <div
              className="mt-8 border p-4"
              style={{ borderColor: 'var(--c-line)', background: 'var(--c-obsidian)' }}
            >
              <p className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                Specification
              </p>
              <dl className="mt-4 space-y-3">
                {[
                  ['Mode', 'Independent studio'],
                  ['Focus', 'SMB digital systems'],
                  ['Base', 'Mathura, India · Remote'],
                  ['Scope', 'Web · Software · Automation'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 text-sm">
                    <dt style={{ color: 'var(--c-muted)' }}>{k}</dt>
                    <dd className="mono text-right text-2xs" style={{ color: 'var(--c-ink)' }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Principles */}
        <ol className="lg:col-span-8">
          {principles.map((principle, index) => (
            <Reveal key={principle.number} as="li" delay={index * 0.05}>
              <div
                className="group grid grid-cols-12 items-baseline gap-4 border-t py-7 transition-colors duration-300 sm:gap-6"
                style={{ borderColor: 'var(--c-line)' }}
              >
                <div className="col-span-2 sm:col-span-1">
                  <span
                    className="mono text-lg transition-colors duration-300 group-hover:text-lime sm:text-xl"
                    style={{ color: 'var(--c-line-strong)' }}
                  >
                    {principle.number}
                  </span>
                </div>
                <div className="col-span-10 sm:col-span-7">
                  <h3 className="text-xl transition-colors duration-300 group-hover:text-lime sm:text-2xl">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--c-ink-2)' }}>
                    {principle.body}
                  </p>
                </div>
                <div className="col-span-12 sm:col-span-4 sm:text-right">
                  <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                    {principle.spec}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
