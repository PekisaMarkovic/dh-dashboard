import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import QuantityInput from '@/src/components/core/input/QuantityInput'
import TableCell from '@/src/components/table/TableCell'
import { IDrink } from '@/src/interfaces'
import { formatCents, formatPrice } from '@/src/utils/money'
import { getStockLevel, STOCK_ROW_CLASS, STOCK_TEXT_CLASS } from '@/src/utils/stock'

type Props = {
  drink: IDrink
  price: number
  quantity: number
  lineCents: number
  onQuantityChange: (value: number) => void
}

// a drink in the "pick drinks" step: how many of it should go on the proforma
const ProformaPickRow = ({ drink, price, quantity, lineCents, onQuantityChange }: Props) => {
  const { t } = useTranslation(['proforma'])
  const level = getStockLevel(drink)

  return (
    <div
      className={`grid grid-cols-2 gap-x-3 gap-y-2 md:grid-cols-[minmax(0,1fr)_110px_110px_150px_110px] md:gap-x-4 items-center px-2 py-3 md:py-2 border-b-1 border-b-light-grey-alt border-solid last:border-b-0 ${STOCK_ROW_CLASS[level]}`}
    >
      <TableCell isDense className="col-span-2 md:col-span-1">
        <Paragraph text={drink.name} size="sm" color="black" />
      </TableCell>
      <TableCell isDense label={t('proforma:table.inStock')}>
        <p className={`font-poppins text-sm ${level === 'ok' && drink.quantity === 0 ? 'text-red' : STOCK_TEXT_CLASS[level]}`}>
          {drink.quantity === 0 ? t('proforma:outOfStock') : drink.quantity}
        </p>
      </TableCell>
      <TableCell isDense label={t('proforma:table.unitPrice')}>
        <Paragraph text={formatPrice(price)} size="sm" color="black" />
      </TableCell>
      <TableCell isDense label={t('proforma:table.quantity')}>
        <QuantityInput ariaLabel={drink.name} value={quantity} max={drink.quantity} disabled={drink.quantity === 0} onChange={onQuantityChange} />
      </TableCell>
      <TableCell isDense label={t('proforma:table.lineTotal')} className="md:flex md:justify-end">
        <Paragraph text={quantity ? formatCents(lineCents) : '-'} size="sm" color="black" />
      </TableCell>
    </div>
  )
}

export default ProformaPickRow
