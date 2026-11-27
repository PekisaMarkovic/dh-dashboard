import { useTranslation } from 'react-i18next'
import DrinkImage from '@/src/components/drinks/DrinkImage'
import IconButton from '@/src/components/website/IconButton'
import { IWebsiteSection } from '@/src/interfaces'

type Props = {
  drink: IWebsiteSection['drinks'][number]
  // the place of the drink on the site, from 1
  position: number
  isFirst: boolean
  isLast: boolean
  onMove: (step: -1 | 1) => void
  onRemove: () => void
}

// a picked recommended drink: its place, image and name, with up, down and remove
const PickedDrinkRow = ({ drink, position, isFirst, isLast, onMove, onRemove }: Props) => {
  const { t } = useTranslation(['website'])

  return (
    <li className="flex items-center gap-3 rounded-lg border-1 border-solid border-light-grey-alt bg-white p-2 pr-3 transition-shadow hover:shadow-md">
      <span className="font-poppins flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-transparent text-xs font-semibold text-green">
        {position}
      </span>
      <DrinkImage src={drink.imageUrl} alt={drink.name} size="md" />
      <span className="font-poppins min-w-0 flex-1 truncate text-sm font-medium text-black">{drink.name}</span>
      <span className="flex shrink-0 items-center gap-1.5">
        <IconButton label={t('website:featured.up')} disabled={isFirst} onClick={() => onMove(-1)}>
          <path d="m18 15-6-6-6 6" />
        </IconButton>
        <IconButton label={t('website:featured.down')} disabled={isLast} onClick={() => onMove(1)}>
          <path d="m6 9 6 6 6-6" />
        </IconButton>
        <IconButton danger label={t('website:featured.remove')} onClick={onRemove}>
          <path d="M18 6 6 18M6 6l12 12" />
        </IconButton>
      </span>
    </li>
  )
}

export default PickedDrinkRow
