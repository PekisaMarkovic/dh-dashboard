import { PropsWithChildren } from 'react'

type Props = {
  /** the name of the column, shown above the value on a phone (the header of the table is hidden there) */
  label?: string
  className?: string
  /** less space above and below (the rows of the proforma are tighter than the lists) */
  isDense?: boolean
  /** the main value of the card on a phone (the name): shown as a title, without the label */
  isTitle?: boolean
}

/**
 * One cell of a row. On a wide screen it is a cell of the table, on a phone the row is a card
 * and every value has the name of its column above it.
 */
const TableCell = ({ label, className = '', isDense = false, isTitle = false, children }: PropsWithChildren<Props>) => (
  <div className={`${isDense ? 'py-0.5 md:py-0' : 'py-1.5 md:py-3'} min-w-0 ${className}`}>
    {label && !isTitle && <span className="md:hidden block mb-0.5 font-poppins text-xs text-grey">{label}</span>}
    {children}
  </div>
)

export default TableCell
