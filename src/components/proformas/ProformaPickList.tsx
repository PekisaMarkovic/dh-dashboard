import { useTranslation } from 'react-i18next'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import ProformaPickRow from '@/src/components/proformas/ProformaPickRow'
import { IDrink } from '@/src/interfaces'

type Props = {
  drinks: IDrink[]
  // the chosen quantity of every drink (by drinkId)
  quantities: Record<number, number>
  priceOf: (drink: IDrink) => number
  lineCentsOf: (drink: IDrink, quantity: number) => number
  onQuantityChange: (drinkId: number, value: number) => void
}

// the "pick drinks" step: a table of the drinks of the warehouse with a quantity for each
const ProformaPickList = ({ drinks, quantities, priceOf, lineCentsOf, onQuantityChange }: Props) => {
  const { t } = useTranslation(['proforma', 'drink'])

  return (
    <div>
      <div className="hidden md:block sticky top-0 z-2 bg-white border-b-1 border-b-light-grey-alt border-solid px-2 pb-3">
        <div className="grid grid-cols-[minmax(0,1fr)_110px_110px_150px_110px] gap-x-4">
          <div>
            <Heading text={t('proforma:table.name')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
          <Heading text={t('proforma:table.inStock')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:table.unitPrice')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
          <div className="flex justify-end">
            <Heading text={t('proforma:table.lineTotal')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
        </div>
      </div>

      {drinks.map((drink) => {
        const quantity = quantities[drink.drinkId] || 0

        return (
          <ProformaPickRow
            key={drink.drinkId}
            drink={drink}
            price={priceOf(drink)}
            quantity={quantity}
            lineCents={lineCentsOf(drink, quantity)}
            onQuantityChange={(value) => onQuantityChange(drink.drinkId, value)}
          />
        )
      })}

      {!drinks.length && <Paragraph text={t('drink:empty')} size="sm" color="grey" className="py-4" />}
    </div>
  )
}

export default ProformaPickList
