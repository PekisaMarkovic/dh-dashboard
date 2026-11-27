import { useTranslation } from 'react-i18next'
import IconButton from '@/src/components/core/buttons/IconButton'
import { ICONS } from '@/src/components/core/icons/paths'
import Badge from '@/src/components/core/indicators/Badge'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DrinkImage from '@/src/components/drinks/DrinkImage'
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
      <Badge text={String(position)} tone="green" />
      <DrinkImage src={drink.imageUrl} alt={drink.name} size="md" />
      <div className="min-w-0 flex-1">
        <Paragraph text={drink.name} size="sm" color="black" weight="medium" noWrap />
      </div>
      <span className="flex shrink-0 items-center gap-1.5">
        <IconButton label={t('website:featured.up')} icon={ICONS.up} disabled={isFirst} onClick={() => onMove(-1)} />
        <IconButton label={t('website:featured.down')} icon={ICONS.down} disabled={isLast} onClick={() => onMove(1)} />
        <IconButton danger label={t('website:featured.remove')} icon={ICONS.close} onClick={onRemove} />
      </span>
    </li>
  )
}

export default PickedDrinkRow
