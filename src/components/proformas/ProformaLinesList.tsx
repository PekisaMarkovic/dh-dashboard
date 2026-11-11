import { useTranslation } from 'react-i18next'
import Heading from '@/src/components/core/typography/Heading'
import ProformaLineRow from '@/src/components/proformas/ProformaLineRow'
import { IDrink } from '@/src/interfaces'

type Props = {
  drinks: IDrink[]
  // the quantity of every drink that is on the proforma (by drinkId)
  quantities: Record<number, number>
  priceOf: (drink: IDrink) => number
  discountOf: (drink: IDrink) => number
  lineCentsOf: (drink: IDrink, quantity: number) => number
  onQuantityChange: (drinkId: number, value: number) => void
  onPriceChange: (drinkId: number, value: number) => void
  onDiscountChange: (drinkId: number, value: number) => void
  onRemove: (drinkId: number) => void
}

// the drinks that are on the proforma, with their quantity, price and discount
const ProformaLinesList = ({
  drinks,
  quantities,
  priceOf,
  discountOf,
  lineCentsOf,
  onQuantityChange,
  onPriceChange,
  onDiscountChange,
  onRemove,
}: Props) => {
  const { t } = useTranslation(['proforma'])

  return (
    <div>
      <div className="hidden md:block sticky top-0 z-2 bg-white border-b-1 border-b-light-grey-alt border-solid px-2 pb-3">
        <div className="grid grid-cols-[minmax(0,1fr)_150px_120px_100px_110px_80px] gap-x-4">
          <div>
            <Heading text={t('proforma:table.name')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
          <Heading text={t('proforma:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:table.unitPrice')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:table.discount')} variant="2" size="sm" color="grey" weight="medium" />
          <div className="flex justify-end">
            <Heading text={t('proforma:table.lineTotal')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
          <span />
        </div>
      </div>

      {drinks.map((drink) => (
        <ProformaLineRow
          key={drink.drinkId}
          drink={drink}
          quantity={quantities[drink.drinkId]}
          price={priceOf(drink)}
          discount={discountOf(drink)}
          lineCents={lineCentsOf(drink, quantities[drink.drinkId])}
          onQuantityChange={(value) => onQuantityChange(drink.drinkId, value)}
          onPriceChange={(value) => onPriceChange(drink.drinkId, value)}
          onDiscountChange={(value) => onDiscountChange(drink.drinkId, value)}
          onRemove={() => onRemove(drink.drinkId)}
        />
      ))}
    </div>
  )
}

export default ProformaLinesList
