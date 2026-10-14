import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Info, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { ProjectPreview } from './ProjectPreview'
import { useEnquiry } from './enquiry/EnquiryContext'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const { openEnquiry } = useEnquiry()

  useEffect(() => {
    if (!project) return
    const previous = document.activeElement
    const { overflow, paddingRight } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      ;(previous as HTMLElement | null)?.focus?.()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="fixed inset-0"
            style={{ background: 'rgba(5,7,5,0.8)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            tabIndex={-1}
            className="relative z-10 w-full max-w-4xl border sm:my-6"
            style={{
              background: 'var(--c-surface)',
              borderColor: 'var(--c-line-strong)',
              borderRadius: 'var(--radius-lg)',
            }}
            initial={reduce ? undefined : { opacity: 0, y: 24, scale: 0.985 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="flex items-start justify-between gap-4 border-b p-5 sm:p-6"
              style={{ borderColor: 'var(--c-line)' }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="mono text-2xs" style={{ color: 'var(--c-lime)' }}>
                  {project.number}
                </span>
                <span className="tag tag-lime">{project.status}</span>
                <span className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                  {project.category}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project preview"
                className="btn btn-ghost shrink-0 px-2"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="aspect-[4/3]" style={{ border: '1px solid var(--c-line)' }}>
                  <ProjectPreview kind={project.preview} />
                </div>
              </div>

              <div className="lg:col-span-5">
                <h2 id="project-title" className="text-2xl sm:text-3xl">
                  {project.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                  {project.description}
                </p>

                <div className="mt-6">
                  <p className="mono text-2xs uppercase" style={{ color: 'var(--c-muted)' }}>
                    Focus areas
                  </p>
                  <ul className="mt-3 space-y-2">
                    {project.focus.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--c-ink-2)' }}>
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0" style={{ background: 'var(--c-lime)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="flex flex-col gap-4 border-t p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              style={{ borderColor: 'var(--c-line)' }}
            >
              <p className="flex items-start gap-2 text-xs" style={{ color: 'var(--c-muted)' }}>
                <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                {project.status.toLowerCase().includes('prototype')
                  ? 'An internal prototype — not a live client deployment.'
                  : 'A self-initiated studio concept, not live client work.'}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose()
                  openEnquiry()
                }}
              >
                Discuss something like this
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
