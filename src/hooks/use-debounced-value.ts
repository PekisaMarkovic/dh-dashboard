import { useEffect, useState } from 'react'

/**
 * The value follows with a delay, so a request is not sent for every typed letter
 */
export const useDebouncedValue = <T>(value: T, delay = 400) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
