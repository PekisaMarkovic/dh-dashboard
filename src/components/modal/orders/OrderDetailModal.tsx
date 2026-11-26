import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import OrderItemRow from '@/src/components/orders/OrderItemRow'
import OrderStatusSelect from '@/src/components/orders/OrderStatusSelect'
import Skeleton from '@/src/components/skeleton/Skeleton'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import { useOrderQuery } from '@/src/hooks/queries/use-order-queries'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'
import { formatMoney } from '@/src/utils/money'

// the buyer, the address, the day and the drinks of an order, and its status (a select that changes it)
const OrderDetailModal = () => {
  const { t } = useTranslation(['order', 'g'])
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectModal)
  const orderId = (data as { orderId: number } | null)?.orderId
  const { data: order, isError } = useOrderQuery(orderId)

  // the message about the error comes from the cache, the window is of no use then
  useEffect(() => {
    if (isError) dispatch(removeModal())
  }, [isError, dispatch])

  const handleClose = () => dispatch(removeModal())

  if (!order) {
    return (
      <div className="w-[720px] max-w-full">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-96 max-w-full mt-3" />
        <div className="mt-6">
          <TableSkeleton columns={[2, 1, 1, 1]} rows={4} />
        </div>
      </div>
    )
  }

  const details: [string, string][] = [
    [t('order:detail.pickupDate'), formatDate(order.pickupDate)],
    [t('order:detail.buyer'), order.fullName],
    [t('order:detail.address'), order.address],
    [t('order:detail.phone'), order.phone],
    [t('order:detail.email'), order.email],
    [t('order:detail.createdAt'), formatDate(order.createdAt)],
    ...(order.status === 'cancelled' ? ([[t('order:detail.cancelReason'), order.cancelReason || t('order:detail.noReason')]] as [string, string][]) : []),
  ]

  return (
    <div className="w-[720px] max-w-full">
      <div className="flex flex-wrap items-center gap-3">
        <Heading text={t('order:detail.title', { number: order.orderId })} variant="2" size="base" color="black" />
      </div>

      {/* the status is changed here; the employee moves the order on, a cancellation asks for the reason */}
      <div className="mt-4 w-full sm:w-64">
        <OrderStatusSelect key={order.status} order={order} />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="font-poppins text-xs text-grey">{label}</dt>
            <dd className="font-poppins text-sm text-black break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <div className="hidden md:grid grid-cols-5 gap-x-4 border-b-1 border-b-light-grey-alt border-solid pb-2">
          <div className="col-span-2">
            <Heading text={t('order:items.name')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
          <Heading text={t('order:items.quantity')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('order:items.price')} variant="2" size="sm" color="grey" weight="medium" />
          <div className="flex justify-end">
            <Heading text={t('order:items.amount')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
        </div>

        {order.items?.map((item) => <OrderItemRow key={item.orderItemId} item={item} />)}

        <div className="flex justify-between pt-4">
          <Paragraph text={t('order:items.total')} size="base" color="black" weight="medium" />
          <Paragraph text={formatMoney(order.total)} size="base" color="black" weight="medium" />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 mt-8">
        <MainButton text={t('g:button.okey')} variant="alternative" size="medium" onClick={handleClose} />
      </div>
    </div>
  )
}

export default OrderDetailModal
