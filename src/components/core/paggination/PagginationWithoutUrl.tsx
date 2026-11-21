import { ReactNode } from 'react'
import SinglePage from './partials/SinglePage'
import PagginationDots from './partials/PagginationDots'
import PagginationArrow from './partials/PagginationArrow'
import { useSearchParams } from 'react-router-dom'
import { useMediaQuery } from '@/src/hooks/use-media-query'

type Props = {
  totalPages: number
  // controlled mode: without them the page is kept in the ?page= param of the url
  page?: number
  onPageChange?: (page: number) => void
}

const PagginationWithoutUrl = ({ totalPages, page: controlledPage, onPageChange }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = controlledPage ?? (Number(searchParams.get('page')) || 1)
  // a narrow phone has room for the first page, the current one and the last one only
  const isCompact = useMediaQuery('(max-width: 479px)')

  const handlePageClick = (pageNumber: number) => {
    if (onPageChange) {
      onPageChange(pageNumber)
      return
    }

    setSearchParams((params) => {
      params.set('page', `${pageNumber}`)

      return params
    })
  }

  // the first, the current and the last page, with dots where pages are left out
  const generateCompactLinks = () => {
    const pages = [...new Set([1, currentPage, totalPages])].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
    const links: ReactNode[] = []

    pages.forEach((pageNumber, index) => {
      if (index > 0 && pageNumber - pages[index - 1] > 1) links.push(<PagginationDots key={`dots-${pageNumber}`} />)

      links.push(<SinglePage key={pageNumber} isActive={currentPage === pageNumber} page={pageNumber} setPage={handlePageClick} />)
    })

    return links
  }

  const generateLinks = () => {
    if (isCompact) return generateCompactLinks()

    const links = []

    if (totalPages <= 3) {
      if (totalPages >= 1) links.push(<SinglePage key={1} isActive={currentPage === 1} page={1} setPage={handlePageClick} />)

      if (totalPages >= 2) links.push(<SinglePage key={2} isActive={currentPage === 2} page={2} setPage={handlePageClick} />)

      if (totalPages >= 3) links.push(<SinglePage key={3} isActive={currentPage === 3} page={3} setPage={handlePageClick} />)

      return links
    }

    if (currentPage < 3) {
      links.push(<SinglePage key={1} isActive={currentPage === 1} page={1} setPage={handlePageClick} />)

      links.push(<SinglePage key={2} isActive={currentPage === 2} page={2} setPage={handlePageClick} />)

      links.push(<SinglePage key={3} isActive={currentPage === 3} page={3} setPage={handlePageClick} />)

      links.push(<PagginationDots key={'f-dots'} />)

      links.push(<SinglePage key={totalPages} isActive={currentPage === totalPages} page={totalPages} setPage={handlePageClick} />)

      return links
    }

    if (currentPage >= 3 && currentPage <= totalPages - 2) {
      links.push(<SinglePage key={1} isActive={currentPage === 1} page={1} setPage={handlePageClick} />)

      links.push(<PagginationDots key={'f-dots-1'} />)

      links.push(<SinglePage key={currentPage - 1} isActive={false} page={currentPage - 1} setPage={handlePageClick} />)

      links.push(<SinglePage key={currentPage} isActive page={currentPage} setPage={handlePageClick} />)

      links.push(<SinglePage key={currentPage + 1} isActive={false} page={currentPage + 1} setPage={handlePageClick} />)

      links.push(<PagginationDots key={'f-dots-2'} />)

      links.push(<SinglePage key={totalPages} isActive={currentPage === totalPages} page={totalPages} setPage={handlePageClick} />)

      return links
    }

    if (currentPage > totalPages - 2) {
      links.push(<SinglePage key={1} isActive={currentPage === 1} page={1} setPage={handlePageClick} />)

      links.push(<PagginationDots key={'f-dots'} />)

      links.push(<SinglePage key={totalPages - 2} isActive={currentPage === totalPages - 2} page={totalPages - 2} setPage={handlePageClick} />)

      links.push(<SinglePage key={totalPages - 1} isActive={currentPage === totalPages - 1} page={totalPages - 1} setPage={handlePageClick} />)

      links.push(<SinglePage key={totalPages} isActive={currentPage === totalPages} page={totalPages} setPage={handlePageClick} />)

      return links
    }
  }

  return (
    <div>
      {totalPages > 0 ? (
        <>
          {/* Pagination links */}
          <ul className="flex flex-wrap justify-center gap-1 md:gap-2 list-none">
            <PagginationArrow
              disabled={currentPage === 1}
              reverse
              setPage={() => {
                if (currentPage === 1) return
                handlePageClick(currentPage - 1)
              }}
            />

            {generateLinks()}

            <PagginationArrow
              disabled={currentPage === totalPages}
              reverse={false}
              setPage={() => {
                if (currentPage === totalPages) return

                handlePageClick(currentPage + 1)
              }}
            />
          </ul>
        </>
      ) : null}
    </div>
  )
}

export default PagginationWithoutUrl
