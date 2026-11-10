import SinglePage from './partials/SinglePage'
import PagginationDots from './partials/PagginationDots'
import PagginationArrow from './partials/PagginationArrow'
import { useSearchParams } from 'react-router-dom'

type Props = {
  totalPages: number
  // controlled mode: without them the page is kept in the ?page= param of the url
  page?: number
  onPageChange?: (page: number) => void
}

const PagginationWithoutUrl = ({ totalPages, page: controlledPage, onPageChange }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = controlledPage ?? (Number(searchParams.get('page')) || 1)

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

  const generateLinks = () => {
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
          <ul className="flex gap-x-2 list-none">
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
