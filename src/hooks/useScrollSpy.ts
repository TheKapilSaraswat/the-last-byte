import { useEffect, useState } from 'react'

/**
 * Highlights the section currently in view. Returns the id of the most
 * relevant section, or null when above the first one.
 */
export function useScrollSpy(ids: string[], offset = 140): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const onScroll = () => {
      let current: string | null = null
      for (const el of elements) {
        const top = el.getBoundingClientRect().top
        if (top - offset <= 0) current = el.id
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return activeId
}
