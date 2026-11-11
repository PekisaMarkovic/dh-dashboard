import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { useCustomerService } from '@/src/services/use-customer-service'

export const useCustomersQuery = () => {
  const { getCustomers } = useCustomerService()

  return useQuery({
    queryKey: QUERY_KEYS.customers,
    queryFn: getCustomers,
    staleTime: STALE_TIMES.rarelyChanges,
  })
}
