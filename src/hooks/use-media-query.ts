import { useEffect, useState } from 'react'

/**
 * True while the screen matches a CSS media query, e.g. useMediaQuery('(max-width: 767px)').
 * For the things that classes cannot do (inline styles of a library).
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
