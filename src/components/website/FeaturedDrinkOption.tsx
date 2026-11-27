import { useTranslation } from 'react-i18next'
import LineIcon from '@/src/components/core/icons/LineIcon'
import { ICONS } from '@/src/components/core/icons/paths'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DrinkImage from '@/src/components/drinks/DrinkImage'
import { IDrink } from '@/src/interfaces'

type Props = {
  drink: IDrink
  // already picked: a click takes it out
  isAdded: boolean
  // the list is full and this one is not picked
  isDisabled: boolean
  // the arrow keys are on it
  isActive: boolean
  onToggle: () => void
  onHover: () => void
}

// a drink in the list of the drink picker: its image, name and code, and whether it is added
const FeaturedDrinkOption = ({ drink, isAdded, isDisabled, isActive, onToggle, onHover }: Props) => {
  const { t } = useTranslation(['website'])

  return (
    <li
      role="option"
      aria-selected={isAdded}
      aria-disabled={isDisabled}
      // keeps the focus in the search so the list stays open
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => !isDisabled && onToggle()}
      onMouseEnter={onHover}
      className={`flex items-center gap-3 px-3 py-2 transition-colors ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${
        isActive && !isDisabled ? 'bg-green-transparent' : ''
      }`}
    >
      <DrinkImage src={drink.image?.url} alt={drink.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Paragraph text={drink.name} size="sm" color="black" weight="medium" noWrap />
        <Paragraph text={drink.code} color="dark-grey" noWrap />
      </div>
      {isAdded ? (
        <Paragraph text={t('website:featured.added')} color="green" weight="medium" leftIcon={<LineIcon d={ICONS.check} strokeWidth={2.5} />} />
      ) : (
        !isDisabled && <Paragraph text={`+ ${t('website:featured.add')}`} color="green" weight="medium" />
      )}
    </li>
  )
}

export default FeaturedDrinkOption
