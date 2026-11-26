import { OrderStatus } from '@/src/interfaces'

// in the order they come one after the other; an employee can pick any of them, also back after a wrong click
export const ORDER_STATUSES: OrderStatus[] = ['new', 'in_progress', 'delivered', 'cancelled']
