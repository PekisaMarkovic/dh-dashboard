import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { OrderListParams, useOrderService } from '@/src/services/use-order-service'

// a new order can come at any time, so the list is fresh only shortly
export const useOrdersQuery = (params: OrderListParams) => {
  const { getOrders } = useOrderService()

  return useQuery({
    queryKey: [...QUERY_KEYS.orders, params],
    queryFn: () => getOrders(params),
    staleTime: STALE_TIMES.stock,
    placeholderData: keepPreviousData,
  })
}

export const useOrderQuery = (orderId?: number) => {
  const { getOrder } = useOrderService()

  return useQuery({
    queryKey: [...QUERY_KEYS.order, orderId],
    queryFn: () => getOrder(orderId as number),
    enabled: !!orderId,
    staleTime: STALE_TIMES.stock,
  })
}

/** True when the website of the company lets the visitors order (every employee can ask) */
export const useOrdersEnabledQuery = () => {
  const { getOrdersEnabled } = useOrderService()

  return useQuery({
    queryKey: QUERY_KEYS.ordersEnabled,
    queryFn: getOrdersEnabled,
    staleTime: STALE_TIMES.rarelyChanges,
  })
}
