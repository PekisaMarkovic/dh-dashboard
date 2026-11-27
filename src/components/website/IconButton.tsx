import { ReactNode } from 'react'

type Props = {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  // the paths of a 24 x 24 stroke icon
  children: ReactNode
}

// a small square button with a line icon (move, show, edit, remove)
const IconButton = ({ label, onClick, disabled, danger, children }: Props) => (
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  </button>
)

export default IconButton
