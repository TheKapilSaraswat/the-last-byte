/* eslint-disable react-refresh/only-export-components -- provider paired with its hook */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface EnquiryOptions {
  /** Preselect a service in the enquiry form. */
  service?: string
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
