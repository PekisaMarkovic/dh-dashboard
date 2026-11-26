import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import OrderStatusPill from '@/src/components/orders/OrderStatusPill'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown, IOrder } from '@/src/interfaces'
import { formatDate } from '@/src/utils/date'
import { formatMoney } from '@/src/utils/money'

type Props = {
  order: IOrder
  dropdownOptions: CustomDropdown[]
  onClick: () => void
}

const OrderRow = ({ order, dropdownOptions, onClick }: Props) => {
  const { t } = useTranslation(['order'])

  return (
    <DefaultTableRowContainer cols={6} onRowClick={onClick} dropdownOptions={dropdownOptions}>
      <TableCell isTitle label={t('order:table.number')}>
        <Paragraph text={`#${order.orderId}`} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('order:table.buyer')} className="col-span-2 md:col-span-1">
        <Paragraph text={order.fullName} size="sm" color="black" />
        <Paragraph text={order.phone} size="xs" color="grey" />
      </TableCell>
      <TableCell label={t('order:table.pickupDate')}>
        <Paragraph text={formatDate(order.pickupDate)} size="sm" color="black" noWrap />
      </TableCell>
      <TableCell label={t('order:table.createdAt')}>
        <Paragraph text={formatDate(order.createdAt)} size="sm" color="black" noWrap />
      </TableCell>
      <TableCell label={t('order:table.total')}>
        <Paragraph text={formatMoney(order.total)} size="sm" color="black" noWrap />
      </TableCell>
      <TableCell label={t('order:table.status')}>
        <OrderStatusPill status={order.status} />
      </TableCell>
    </DefaultTableRowContainer>
  )
}

export default OrderRow
