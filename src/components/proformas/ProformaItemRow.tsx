import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import TableCell from '@/src/components/table/TableCell'
import { IProformaItem } from '@/src/interfaces'
import { formatMoney, formatPrice } from '@/src/utils/money'

type Props = {
  item: IProformaItem
}

const ProformaItemRow = ({ item }: Props) => {
  const { t } = useTranslation(['proforma'])

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-1 py-2.5 border-b-1 border-b-light-grey-alt border-solid last:border-b-0">
      <div className="col-span-2">
        <Paragraph text={item.name} size="sm" color="black" />
      </div>
      <TableCell isDense label={t('proforma:table.quantity')}>
        <Paragraph text={`${item.quantity}`} size="sm" color="black" />
      </TableCell>
      <TableCell isDense label={t('proforma:table.unitPrice')}>
        <Paragraph text={formatPrice(item.unitPrice)} size="sm" color="black" />
      </TableCell>
      <TableCell isDense label={t('proforma:table.discount')}>
        <Paragraph text={`${formatMoney(item.discountPercent)}%`} size="sm" color="black" />
      </TableCell>
      <TableCell isDense label={t('proforma:table.lineTotal')} className="md:flex md:justify-end">
        <Paragraph text={formatMoney(item.lineTotal)} size="sm" color="black" />
      </TableCell>
    </div>
  )
}

export default ProformaItemRow
