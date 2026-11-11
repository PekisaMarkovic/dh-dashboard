import { useTranslation } from 'react-i18next'
import DecimalInput from '@/src/components/core/input/DecimalInput'
import QuantityInput from '@/src/components/core/input/QuantityInput'
import Paragraph from '@/src/components/core/typography/Paragraph'
import TableCell from '@/src/components/table/TableCell'
import { IDrink } from '@/src/interfaces'
import { formatCents } from '@/src/utils/money'
import { getStockLevel, STOCK_ROW_CLASS } from '@/src/utils/stock'

type Props = {
  drink: IDrink
  quantity: number
  price: number
  discount: number
  lineCents: number
  onQuantityChange: (value: number) => void
  onPriceChange: (value: number) => void
  onDiscountChange: (value: number) => void
  onRemove: () => void
}

// a drink that is on the proforma, its quantity, price and discount can still be changed
const ProformaLineRow = ({ drink, quantity, price, discount, lineCents, onQuantityChange, onPriceChange, onDiscountChange, onRemove }: Props) => {
  const { t } = useTranslation(['proforma'])

  return (
    <div
      className={`grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-[minmax(0,1fr)_150px_120px_100px_110px_80px] md:gap-x-4 items-center px-2 py-3 md:py-2 border-b-1 border-b-light-grey-alt border-solid last:border-b-0 ${STOCK_ROW_CLASS[getStockLevel(drink)]}`}
    >
      <TableCell isDense className="col-span-2 md:col-span-1">
        <Paragraph text={drink.name} size="sm" color="black" />
      </TableCell>
      <TableCell isDense label={t('proforma:table.quantity')}>
        <QuantityInput ariaLabel={drink.name} value={quantity} min={1} max={drink.quantity} onChange={onQuantityChange} />
      </TableCell>
      <TableCell isDense label={t('proforma:table.unitPrice')}>
        <DecimalInput ariaLabel={`${t('proforma:table.unitPrice')} ${drink.name}`} value={price} decimals={3} isPrice onChange={onPriceChange} />
      </TableCell>
      <TableCell isDense label={t('proforma:table.discount')}>
        <DecimalInput ariaLabel={`${t('proforma:table.discount')} ${drink.name}`} value={discount} max={100} suffix="%" onChange={onDiscountChange} />
      </TableCell>
      <TableCell isDense label={t('proforma:table.lineTotal')} className="md:flex md:justify-end">
        <Paragraph text={formatCents(lineCents)} size="sm" color="black" />
      </TableCell>
      <div className="flex justify-end">
        <button type="button" className="font-poppins text-sm text-red hover:underline py-1 px-2" onClick={onRemove}>
          {t('proforma:remove')}
        </button>
      </div>
    </div>
  )
}

export default ProformaLineRow
