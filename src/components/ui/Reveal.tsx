/* eslint-disable react-refresh/only-export-components -- shared motion variants live with Reveal */
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger delay in seconds. */
  delay?: number
  /** Direction the element travels in from. */
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li'
}

/**
 * Subtle in-view reveal. Content is always present in the DOM (rendered as a
 * plain element when reduced motion is preferred), so the page stays usable if
 * animations are disabled or fail.
 */
export function Reveal({ children, delay = 0, y = 22, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}

/** Shared stagger container for lists of revealed children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
