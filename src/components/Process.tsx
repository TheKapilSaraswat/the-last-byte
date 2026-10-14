import { processSteps } from '../data/process'
import { Reveal } from './ui/Reveal'

export function Process() {
  return (
    <section id="process" className="section relative">
      <div className="shell">
        <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                05
              </span>
              <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                Process
              </span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.02]">
                A simple path, start to launch.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-2xl" style={{ color: 'var(--c-ink-2)' }}>
                Four clear stages keep projects predictable. Timelines and scope are agreed per
                project — a single page and a business system are not the same job.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="grid grid-cols-1 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-0">
          {processSteps.map((step, index) => (
            <Reveal
              key={step.number}
              as="li"
              delay={index * 0.08}
              className="relative"
            >
              <div className="relative border-t pt-8" style={{ borderColor: 'var(--c-line-strong)' }}>
                <span
                  className="absolute left-0 -top-[5px] h-2.5 w-2.5 rounded-full"
                  style={{
                    background: 'var(--c-lime)',
                    boxShadow: '0 0 0 4px rgba(198,255,94,0.12)',
                  }}
                  aria-hidden="true"
                />
                <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                  {step.number}
                </span>
                <h3 className="mt-3 text-xl sm:text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm" style={{ color: 'var(--c-ink-2)' }}>
                  {step.description}
                </p>
                <p className="mono mt-4 text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                  {step.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
