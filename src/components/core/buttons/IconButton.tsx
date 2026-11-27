import LineIcon from '@/src/components/core/icons/LineIcon'

type Props = {
  // for screen readers and the tooltip
  label: string
  // the path of a 24 x 24 line icon
  icon: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}

// a small square button with a line icon (move, show, edit, remove, add)
const IconButton = ({ label, icon, onClick, disabled, danger }: Props) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-1 border-solid border-light-grey-alt bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      danger ? 'text-red hover:border-red hover:bg-red/5' : 'text-grey-secondary hover:border-green hover:text-green'
    }`}
  >
    <LineIcon d={icon} />
  </button>
)

export default IconButton
