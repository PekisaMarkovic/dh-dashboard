import { useTranslation } from 'react-i18next'
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
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-poppins truncate text-sm font-medium text-black">{drink.name}</span>
        <span className="font-poppins truncate text-xs text-dark-grey">{drink.code}</span>
      </span>
      {isAdded ? (
        <span className="font-poppins flex items-center gap-1 text-xs font-medium text-green">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 5 5 9-10" />
          </svg>
          {t('website:featured.added')}
        </span>
      ) : (
        !isDisabled && <span className="font-poppins text-xs font-medium text-green">+ {t('website:featured.add')}</span>
      )}
    </li>
  )
}

export default FeaturedDrinkOption
