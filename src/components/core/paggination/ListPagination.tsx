import PagginationWithoutUrl from '@/src/components/core/paggination/PagginationWithoutUrl'

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * Page buttons under a list, nothing is shown when everything fits on one page
 */
const ListPagination = ({ page, totalPages, onPageChange }: Props) =>
  totalPages > 1 ? (
    <div className="flex flex-row-reverse pt-4">
      <PagginationWithoutUrl totalPages={totalPages} page={page} onPageChange={onPageChange} />
    </div>
  ) : null

export default ListPagination
