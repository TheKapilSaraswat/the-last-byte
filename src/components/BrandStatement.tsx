import { Reveal } from './ui/Reveal'

export function BrandStatement() {
  return (
    <section id="studio" className="section relative">
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Index rail */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 lg:sticky lg:top-28">
            <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
              01
            </span>
            <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
              Positioning
            </span>
          </div>
        </div>

        {/* Statement */}
        <div className="lg:col-span-9">
          <Reveal>
            <h2 className="text-[clamp(2rem,5.2vw,4.1rem)] leading-[1.02]">
              Good technology should do{' '}
              <span style={{ color: 'var(--c-lime)' }}>more</span> than look good.
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
            <Reveal delay={0.1} className="md:col-span-7">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                Your website is often the first impression someone gets of your business. We make
                that first impression clear, welcoming and easy to act on — so people call, message
                or walk in.
              </p>
            </Reveal>

            <Reveal delay={0.18} className="md:col-span-5">
              <div
                className="h-full border-l pl-6"
                style={{ borderColor: 'var(--c-line)' }}
              >
                <p className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                  How we think
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                  Every choice — the words, the layout, the speed — comes back to one question:
                  does this help your business?
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
