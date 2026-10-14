import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Wordmark } from './ui/BrandMark'
import { useEnquiry } from './enquiry/EnquiryContext'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { cn } from '../lib/cn'

const NAV_LINKS = [
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Process', href: '#process', id: 'process' },
  { label: 'About', href: '#about', id: 'about' },
]

const SECTION_IDS = ['services', 'work', 'process', 'about']

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openEnquiry } = useEnquiry()
  const reduce = useReducedMotion()
  const activeId = useScrollSpy(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleEnquiry = () => {
    setMenuOpen(false)
    openEnquiry()
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
      )}
      style={{
        backgroundColor: scrolled ? 'rgba(9,11,10,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--c-line)' : 'transparent'}`,
      }}
    >
      <div className="shell flex h-[68px] items-center justify-between gap-6">
        <a
          href="#top"
          className="shrink-0"
          aria-label="The Last Byte — back to top"
          onClick={() => setMenuOpen(false)}
        >
          <Wordmark size={32} />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className="relative px-3.5 py-2 text-sm transition-colors duration-300"
                style={{ color: isActive ? 'var(--c-ink)' : 'var(--c-ink-2)' }}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left transition-transform duration-300"
                  style={{
                    background: 'var(--c-lime)',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 xl:flex" aria-hidden="true">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--c-lime)', animation: 'pulse-node 2.6s ease-in-out infinite' }}
            />
            <span className="eyebrow" style={{ color: 'var(--c-muted)', fontSize: '0.625rem' }}>
              Available for projects
            </span>
          </span>

          <button
            type="button"
            onClick={handleEnquiry}
            className="btn btn-primary hidden sm:inline-flex"
          >
            Start a Project
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="btn btn-ghost px-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[68px] bottom-0 lg:hidden"
            style={{ background: 'var(--c-obsidian)' }}
            initial={reduce ? undefined : { opacity: 0, y: -12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="shell flex h-full flex-col py-8">
              <nav aria-label="Mobile" className="flex flex-col">
                {NAV_LINKS.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline justify-between border-b py-5"
                    style={{ borderColor: 'var(--c-line)' }}
                  >
                    <span
                      className="text-3xl"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                    >
                      {link.label}
                    </span>
                    <span className="mono text-2xs" style={{ color: 'var(--c-muted)' }}>
                      0{index + 1}
                    </span>
                  </a>
                ))}
              </nav>

              <button
                type="button"
                onClick={handleEnquiry}
                className="btn btn-primary mt-8 w-full"
              >
                Start a Project
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>

              <p className="mt-auto pt-8 text-xs" style={{ color: 'var(--c-muted)' }}>
                <span className="mono">INDEPENDENT DIGITAL STUDIO</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
