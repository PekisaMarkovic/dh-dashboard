import Skeleton from '@/src/components/skeleton/Skeleton'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'

type Props = {
  columns?: number[]
  rows?: number
}

/**
 * The skeleton of a white card with a title and a table, like the cards of the warehouses
 */
const CardSkeleton = ({ columns = [1, 2, 1, 1], rows = 4 }: Props) => (
  <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid mt-4 mb-4 px-6 py-4">
    <Skeleton className="h-5 w-48 mb-2" />
    <Skeleton className="h-3 w-64 mb-6" />
    <TableSkeleton columns={columns} rows={rows} />
  </div>
)

export default CardSkeleton
