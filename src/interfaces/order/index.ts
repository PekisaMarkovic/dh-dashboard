// new until the courier takes it (in progress), then delivered; or cancelled
export type OrderStatus = 'new' | 'in_progress' | 'delivered' | 'cancelled'

// one drink of an order, the name and the price as they were when the order came
export interface IOrderItem {
  orderItemId: number
  drinkId: number | null
  code: string | null
  name: string
  unitPrice: number
  quantity: number
}

// an order a visitor sent from the website of the company
export interface IOrder {
  orderId: number
  fullName: string
  email: string
  phone: string
  // where the courier delivers it
  address: string
  // the day of the delivery, "2026-11-27"
  pickupDate: string
  status: OrderStatus
  // why it was cancelled (the buyer got it in an email), null otherwise
  cancelReason: string | null
  total: number
  createdAt: string
  // only in the detail of an order
  items?: IOrderItem[]
}
