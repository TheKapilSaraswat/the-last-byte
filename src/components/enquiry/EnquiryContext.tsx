/* eslint-disable react-refresh/only-export-components -- provider paired with its hook */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { track } from '../../analytics/analytics'
import { services } from '../../data/services'

interface EnquiryOptions {
  /** Preselect a service in the enquiry form. */
  service?: string
}

/** Best-effort mapping from a service title to its stable id for analytics. */
function serviceIdFromTitle(title?: string): string | undefined {
  if (!title) return undefined
  return services.find((service) => service.title === title)?.id
}

interface EnquiryContextValue {
  isOpen: boolean
  presetService: string | null
  openEnquiry: (options?: EnquiryOptions) => void
  closeEnquiry: () => void
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null)

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [presetService, setPresetService] = useState<string | null>(null)

  const openEnquiry = useCallback((options?: EnquiryOptions) => {
    setPresetService(options?.service ?? null)
    setIsOpen(true)
    track('enquiry_open', { service: serviceIdFromTitle(options?.service) })
  }, [])

  const closeEnquiry = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, presetService, openEnquiry, closeEnquiry }),
    [isOpen, presetService, openEnquiry, closeEnquiry],
  )

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}

export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext)
  if (!ctx) throw new Error('useEnquiry must be used within an EnquiryProvider')
  return ctx
}
