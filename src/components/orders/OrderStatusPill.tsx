import { useTranslation } from 'react-i18next'
import { OrderStatus } from '@/src/interfaces'

const STYLE: Record<OrderStatus, string> = {
  new: 'bg-blue-transparent text-blue',
  in_progress: 'bg-orange-50 text-dark-orange',
  delivered: 'bg-green-transparent text-green',
  cancelled: 'bg-red-50 text-red',
}

const OrderStatusPill = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation(['order'])

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 font-poppins text-xs font-medium ${STYLE[status]}`}>
      {t(`order:status.${status}`)}
    </span>
  )
}

export default OrderStatusPill
