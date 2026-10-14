import { useState } from 'react'
import { ArrowUpRight, Eye } from 'lucide-react'
import { projects, type Project } from '../data/projects'
import { ProjectPreview } from './ProjectPreview'
import { ProjectModal } from './ProjectModal'
import { Reveal } from './ui/Reveal'

const sizeClasses: Record<Project['size'], { span: string; aspect: string }> = {
  large: { span: 'lg:col-span-7', aspect: 'aspect-[16/11]' },
  medium: { span: 'lg:col-span-5', aspect: 'aspect-[4/3]' },
  small: { span: 'lg:col-span-5', aspect: 'aspect-[4/3]' },
}

export function Work() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="work" className="section relative">
      <div className="shell">
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                03
              </span>
              <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                Selected work
              </span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.02]">
                Built with intention.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-2xl" style={{ color: 'var(--c-ink-2)' }}>
                A look at how we approach different kinds of businesses. These are{' '}
                <span style={{ color: 'var(--c-ink)' }}>self-initiated concept projects</span> —
                honest explorations, not client deployments.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          {projects.map((project, index) => {
            const { span, aspect } = sizeClasses[project.size]
            return (
              <Reveal
                key={project.id}
                delay={(index % 2) * 0.08}
                className={`${span} lg:pt-2`}
              >
                <article className="group flex h-full flex-col">
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    aria-label={`Open preview: ${project.title}`}
                    className="relative block w-full overflow-hidden text-left"
                    style={{ border: '1px solid var(--c-line)', background: 'var(--c-surface)' }}
                  >
                    <div className={aspect}>
                      <ProjectPreview kind={project.preview} />
                    </div>
                    <span
                      className="pointer-events-none absolute inset-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                      style={{ background: 'linear-gradient(to top, rgba(5,7,5,0.72), transparent 55%)' }}
                    >
                      <span
                        className="mono inline-flex items-center gap-2 text-2xs uppercase"
                        style={{ color: 'var(--c-lime)' }}
                      >
                        <Eye size={13} aria-hidden="true" />
                        View preview
                      </span>
                    </span>
                  </button>

                  <div className="mt-5 flex flex-1 flex-col">
                    <div className="flex items-center gap-3">
                      <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                        {project.number}
                      </span>
                      <span className="tag">{project.status}</span>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <h3 className="text-xl sm:text-2xl">{project.title}</h3>
                      <button
                        type="button"
                        onClick={() => setSelected(project)}
                        aria-label={`Open preview: ${project.title}`}
                        className="mt-1 shrink-0 transition-colors duration-300 hover:text-lime"
                      >
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: 'var(--c-ink-2)' }}>
                      {project.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 pt-0.5">
                      <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                        {project.category}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
