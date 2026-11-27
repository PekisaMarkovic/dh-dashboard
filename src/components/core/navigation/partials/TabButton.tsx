import WarningDot from '@/src/components/core/indicators/WarningDot'

type Props = {
  label: string
  isActive: boolean
  // something on the tab is missing: a small orange dot
  hasWarning?: boolean
  onClick: () => void
}

// one tab of the TabBar
const TabButton = ({ label, isActive, hasWarning, onClick }: Props) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    onClick={onClick}
    className={`font-poppins flex items-center gap-2 text-sm whitespace-nowrap px-4 py-3 -mb-px border-b-2 border-solid ${
      isActive ? 'text-green border-b-green' : 'text-dark-grey border-b-transparent hover:text-black'
    }`}
  >
    {label}
    {hasWarning && <WarningDot label="!" />}
  </button>
)

export default TabButton
