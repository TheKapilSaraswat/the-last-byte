import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEnquiry } from './EnquiryContext'
import { EnquiryForm } from './EnquiryForm'
import { siteConfig } from '../../config/site'

export function EnquiryDialog() {
  const { isOpen, closeEnquiry, presetService } = useEnquiry()
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<Element | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement
    const { overflow, paddingRight } = document.body.style
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const panel = panelRef.current
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    focusables?.[0]?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeEnquiry()
        return
      }
      if (event.key !== 'Tab' || !focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      ;(previouslyFocused.current as HTMLElement | null)?.focus?.()
    }
  }, [isOpen, closeEnquiry])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="fixed inset-0"
            style={{ background: 'rgba(5,7,5,0.78)', backdropFilter: 'blur(6px)' }}
            onClick={closeEnquiry}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-title"
            className="relative z-10 my-0 w-full max-w-3xl border sm:my-6"
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
              className="flex items-start justify-between gap-4 border-b p-6 sm:p-8"
              style={{ borderColor: 'var(--c-line)' }}
            >
              <div>
                <p className="eyebrow mb-2" style={{ color: 'var(--c-lime)' }}>
                  Start a project
                </p>
                <h2 id="enquiry-title" className="text-2xl sm:text-3xl">
                  Tell us what you&apos;re building.
                </h2>
                <p className="mt-2 max-w-md text-sm" style={{ color: 'var(--c-ink-2)' }}>
                  Share a few details and we&apos;ll get back to you. {siteConfig.responseTime}.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEnquiry}
                aria-label="Close enquiry form"
                className="btn btn-ghost shrink-0 px-2"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <EnquiryForm key={presetService ?? 'none'} initialService={presetService} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
