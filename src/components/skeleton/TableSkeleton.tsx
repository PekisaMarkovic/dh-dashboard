import Skeleton from '@/src/components/skeleton/Skeleton'

type Props = {
  /** the relative width of every column, like the columns of the real table */
  columns?: number[]
  rows?: number
  withHeader?: boolean
}

// the lines are not all equally long, so it looks like text
const WIDTHS = ['w-3/4', 'w-1/2', 'w-2/3', 'w-5/6', 'w-1/2', 'w-3/5']

/**
 * The skeleton of a table: a header line and some rows, in the same columns as the real one.
 */
const TableSkeleton = ({ columns = [2, 1, 1], rows = 6, withHeader = true }: Props) => {
  const template = columns.map((c) => `${c}fr`).join(' ')

  return (
    <div role="status" aria-busy="true" aria-live="polite">
      {withHeader && (
        <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
          <div className="grid gap-x-4" style={{ gridTemplateColumns: template }}>
            {columns.map((_, index) => (
              <Skeleton key={index} className="h-3 w-1/2" />
            ))}
          </div>
        </div>
      )}

      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="grid grid-cols-2 gap-x-4 gap-y-3 items-center px-4 py-4 border-b-1 border-b-light-grey-alt border-solid md:[grid-template-columns:var(--columns)]"
          style={{ ['--columns' as string]: template }}
        >
          {columns.map((_, column) => (
            <Skeleton key={column} className={`h-4 ${WIDTHS[(row + column) % WIDTHS.length]}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton
