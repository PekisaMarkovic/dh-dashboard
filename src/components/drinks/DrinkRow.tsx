import { useTranslation } from 'react-i18next'
import DrinkImage from '@/src/components/drinks/DrinkImage'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown, IDrink } from '@/src/interfaces'
import { formatPrice } from '@/src/utils/money'
import { getStockLevel, STOCK_ROW_CLASS, STOCK_TEXT_CLASS } from '@/src/utils/stock'
import Tag from '@/src/components/core/indicators/Tag'

type Props = {
  drink: IDrink
  warehouseName: string
  dropdownOptions: CustomDropdown[]
}

const DrinkRow = ({ drink, warehouseName, dropdownOptions }: Props) => {
  const { t } = useTranslation(['drink'])
  const level = getStockLevel(drink)

  return (
    <DefaultTableRowContainer isCentered cols={6} className={STOCK_ROW_CLASS[level]} dropdownOptions={dropdownOptions}>
      <TableCell label={t('drink:table.code')}>
        {/* the image first, then the code */}
        <div className="flex items-center gap-x-3">
          <DrinkImage src={drink.image?.url} alt={drink.image?.altText || drink.name} />
          <Paragraph text={drink.code || '-'} size="sm" color="black" noWrap />
        </div>
      </TableCell>
      <TableCell isTitle label={t('drink:table.name')} className="col-span-2 order-first md:order-none">
        <Paragraph text={drink.name} size="sm" color="black" />
        {!!drink.categories?.length && (
          <div className="mt-1 flex flex-wrap gap-1">
            {[...drink.categories]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((category) => (
                <Tag key={category.categoryId} text={category.name} />
              ))}
          </div>
        )}
      </TableCell>
      <TableCell label={t('drink:table.warehouse')}>
        <Paragraph text={warehouseName} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('drink:table.price')}>
        <Paragraph text={formatPrice(drink.price)} size="sm" color="black" noWrap />
      </TableCell>
      <TableCell label={t('drink:table.quantity')}>
        <p className={`font-poppins text-sm whitespace-nowrap ${level === 'ok' && drink.quantity === 0 ? 'text-red' : STOCK_TEXT_CLASS[level]}`}>
          {drink.quantity === 0 ? t('drink:lowStock') : drink.quantity}
        </p>
      </TableCell>
    </DefaultTableRowContainer>
  )
}

export default DrinkRow
