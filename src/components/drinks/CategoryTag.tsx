import LineIcon from '@/src/components/core/icons/LineIcon'
import { ICONS } from '@/src/components/core/icons/paths'

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
    {isOn && <LineIcon d={ICONS.check} className="h-3 w-3" strokeWidth={3} />}
    {name}
  </button>
)

export default CategoryTag
