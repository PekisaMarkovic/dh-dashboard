import { useTranslation } from 'react-i18next'
import Badge, { BadgeTone } from '@/src/components/core/indicators/Badge'
import { OrderStatus } from '@/src/interfaces'

const TONE: Record<OrderStatus, BadgeTone> = {
  new: 'blue',
  in_progress: 'orange',
  delivered: 'green',
  cancelled: 'red',
}

const OrderStatusPill = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation(['order'])

  return <Badge text={t(`order:status.${status}`)} tone={TONE[status]} />
}

export default OrderStatusPill
