import { useMemo } from 'react'
import OrderApis from '@/src/api/orders'
import { useApi } from '@/src/hooks/use-api'
import { IOrder, OrderStatus, PageParams, Paginated } from '@/src/interfaces'

export type OrderListParams = PageParams & { status?: OrderStatus }

export const useOrderService = () => {
  const api = useApi()

  return useMemo(() => {
    // one page of the orders, the newest first
    const getOrders = async ({ search, ...params }: OrderListParams) => {
      const { data } = await api.get<Paginated<IOrder>>(OrderApis.getOrders(), { params: { ...params, search: search || undefined } })

      return data
    }

    // an order with its drinks
    const getOrder = async (orderId: number) => {
      const { data } = await api.get<IOrder>(OrderApis.getOrder(orderId))

      return data
    }

    // reason: only for a cancelled order, the buyer gets it in the email (empty = none)
    const updateOrderStatus = async (orderId: number, status: OrderStatus, reason?: string) => {
      const { data } = await api.patch<IOrder>(OrderApis.patchOrderStatus(orderId), { status, reason: reason || undefined })

      return data
    }

    // true when the website of the company lets the visitors order: the menu item "Porudžbine" is shown only then
    const getOrdersEnabled = async () => {
      const { data } = await api.get<{ isOrderingAllowed: boolean }>(OrderApis.getOrdersEnabled())

      return data.isOrderingAllowed
    }

    return { getOrders, getOrder, updateOrderStatus, getOrdersEnabled }
  }, [api])
}
