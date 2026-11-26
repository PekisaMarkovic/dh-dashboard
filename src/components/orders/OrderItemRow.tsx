import Paragraph from '@/src/components/core/typography/Paragraph'
import { IOrderItem } from '@/src/interfaces'
import { formatCents, formatPrice, lineCents } from '@/src/utils/money'

// one drink of an order in its detail: name, quantity, price and amount
const OrderItemRow = ({ item }: { item: IOrderItem }) => (
  <div className="grid grid-cols-5 gap-x-4 items-center border-b-1 border-b-light-grey-alt border-solid py-3">
    <div className="col-span-2">
      <Paragraph text={item.name} size="sm" color="black" />
      {item.code && <Paragraph text={item.code} size="xs" color="grey" />}
    </div>
    <Paragraph text={String(item.quantity)} size="sm" color="black" />
    <Paragraph text={formatPrice(item.unitPrice)} size="sm" color="black" noWrap />
    <Paragraph text={formatCents(lineCents(item.unitPrice, item.quantity))} size="sm" color="black" noWrap className="text-right" />
  </div>
)

export default OrderItemRow
