import GeneralIcons from '@/src/icons/general'
import Heading from '@/src/components/core/typography/Heading'

export type SortDirection = 'asc' | 'desc'

type Props = {
  text: string
  direction?: SortDirection
  onChange: (direction?: SortDirection) => void
}

// click cycles: off -> ascending -> descending -> off
const NEXT: Record<string, SortDirection | undefined> = { off: 'asc', asc: 'desc', desc: undefined }

/** A table column heading with up/down arrows; the active arrow is highlighted. */
const SortableHeading = ({ text, direction, onChange }: Props) => (
  <button
    type="button"
    className="flex items-center gap-1 cursor-pointer"
    aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}
    onClick={() => onChange(NEXT[direction ?? 'off'])}
  >
    <Heading text={text} variant="2" size="sm" color="grey" weight="medium" />
    <span className="flex flex-col -space-y-3">
      <GeneralIcons type="ArrowSelect" className={`h-5 w-5 rotate-180 ${direction === 'asc' ? '' : 'opacity-30'}`} />
      <GeneralIcons type="ArrowSelect" className={`h-5 w-5 ${direction === 'desc' ? '' : 'opacity-30'}`} />
    </span>
  </button>
)

export default SortableHeading
