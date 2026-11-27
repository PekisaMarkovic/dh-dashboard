type Props = {
  name: string
  isOn: boolean
  onClick: () => void
}

// a category of a drink that can be turned on and off: tags of the same height with slightly rounded corners,
// so a long name does not stretch into an oval
const CategoryTag = ({ name, isOn, onClick }: Props) => (
  <button
    type="button"
    aria-pressed={isOn}
    onClick={onClick}
    className={`font-poppins flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border-1 border-solid px-2.5 text-[13px] leading-none transition-colors ${
      isOn ? 'border-green bg-green-transparent font-medium text-green' : 'border-light-grey-alt bg-light-grey-transparent text-dark-grey hover:border-green hover:text-green'
    }`}
  >
    {isOn && (
      <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 12 5 5 9-10" />
      </svg>
    )}
    {name}
  </button>
)

export default CategoryTag
