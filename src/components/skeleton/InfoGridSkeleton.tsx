import Skeleton from '@/src/components/skeleton/Skeleton'

type Props = {
  items?: number
}

/**
 * The skeleton of a block of "label + value" pairs (the data of a company)
 */
const InfoGridSkeleton = ({ items = 6 }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6" role="status" aria-busy="true" aria-live="polite">
    {Array.from({ length: items }, (_, index) => (
      <div key={index}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4 mt-3" />
      </div>
    ))}
  </div>
)

export default InfoGridSkeleton
