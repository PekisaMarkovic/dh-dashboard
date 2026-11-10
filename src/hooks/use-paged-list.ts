import { useEffect, useMemo, useState } from 'react'

export const PAGE_SIZE = 10

/**
 * Splits a list into pages of 10. The page goes back to 1 when something in resetOn
 * changes (e.g. the search text) and never points past the last page.
 */
export const usePagedList = <T>(items: T[], resetOn: unknown[] = [], pageSize = PAGE_SIZE) => {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetOn)

  const pageItems = useMemo(() => items.slice((currentPage - 1) * pageSize, currentPage * pageSize), [items, currentPage, pageSize])

  return { pageItems, page: currentPage, setPage, totalPages }
}
