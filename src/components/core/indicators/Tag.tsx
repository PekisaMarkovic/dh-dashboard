import Badge from '@/src/components/core/indicators/Badge'
import LineIcon from '@/src/components/core/icons/LineIcon'
import { ICONS } from '@/src/components/core/icons/paths'

type Props = {
  text: string
  // green with a check; off it is grey
  isOn?: boolean
  // set: the tag is a button that turns it on and off
  onClick?: () => void
}

const SHAPE = 'font-poppins inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border-1 border-solid leading-none'
const ON = 'border-green bg-green-transparent font-medium text-green'
const OFF = 'border-light-grey-alt bg-light-grey-transparent text-dark-grey hover:border-green hover:text-green'

/**
 * A small label with slightly rounded corners, e.g. a category of a drink: a long name does not stretch into an oval.
 * With onClick it can be turned on and off (a check when it is on), without it is only shown (then it is a Badge, like every status).
 */
const Tag = ({ text, isOn = true, onClick }: Props) =>
  onClick ? (
    <button type="button" aria-pressed={isOn} onClick={onClick} className={`${SHAPE} h-8 px-2.5 text-[13px] transition-colors ${isOn ? ON : OFF}`}>
      {isOn && <LineIcon d={ICONS.check} className="h-3 w-3" strokeWidth={3} />}
      {text}
    </button>
  ) : (
    <Badge text={text} tone="green" />
  )

export default Tag
