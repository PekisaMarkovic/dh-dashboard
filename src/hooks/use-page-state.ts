import { useEffect, useState } from 'react'

/**
 * The current page of a list that is paginated by the api.
 * It goes back to the first page when something in resetOn changes (the search, a filter).
 */
export const usePageState = (resetOn: unknown[] = []) => {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetOn)

  return [page, setPage] as const
}
