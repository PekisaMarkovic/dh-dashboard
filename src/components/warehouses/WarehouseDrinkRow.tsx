import { useTranslation } from 'react-i18next'
import DrinkImage from '@/src/components/drinks/DrinkImage'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown, IDrink } from '@/src/interfaces'
import { formatPrice } from '@/src/utils/money'
import { getStockLevel, STOCK_ROW_CLASS, STOCK_TEXT_CLASS } from '@/src/utils/stock'

type Props = {
  drink: IDrink
  dropdownOptions: CustomDropdown[]
}

const WarehouseDrinkRow = ({ drink, dropdownOptions }: Props) => {
  const { t } = useTranslation(['warehouse'])
  const level = getStockLevel(drink)

  return (
    <DefaultTableRowContainer isCentered cols={5} className={STOCK_ROW_CLASS[level]} dropdownOptions={dropdownOptions}>
      <TableCell label={t('warehouse:table.code')}>
        <Paragraph text={drink.code || '-'} size="sm" color="black" noWrap />
      </TableCell>
      <TableCell isTitle label={t('warehouse:table.name')} className="col-span-2 order-first md:order-none">
        <div className="flex items-center gap-x-3">
          <DrinkImage src={drink.image?.url} alt={drink.image?.altText || drink.name} />
          <Paragraph text={drink.name} size="sm" color="black" />
        </div>
      </TableCell>
      <TableCell label={t('warehouse:table.price')}>
        <Paragraph text={formatPrice(drink.price)} size="sm" color="black" noWrap />
      </TableCell>
      <TableCell label={t('warehouse:table.quantity')}>
        <p className={`font-poppins text-sm whitespace-nowrap ${level === 'ok' && drink.quantity === 0 ? 'text-red' : STOCK_TEXT_CLASS[level]}`}>
          {drink.quantity}
        </p>
      </TableCell>
    </DefaultTableRowContainer>
  )
}

export default WarehouseDrinkRow
