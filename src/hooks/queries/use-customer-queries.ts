import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { PageParams } from '@/src/interfaces'
import { useCustomerService } from '@/src/services/use-customer-service'

export const useCustomersQuery = (params: PageParams) => {
  const { getCustomers } = useCustomerService()

  return useQuery({
    queryKey: [...QUERY_KEYS.customers, 'list', params],
    queryFn: () => getCustomers(params),
    staleTime: STALE_TIMES.rarelyChanges,
    placeholderData: keepPreviousData,
  })
}

// all the customers (id and name only) for the select of a proforma
export const useCustomerOptionsQuery = () => {
  const { getCustomerOptions } = useCustomerService()

  return useQuery({
    queryKey: [...QUERY_KEYS.customers, 'options'],
    queryFn: getCustomerOptions,
    staleTime: STALE_TIMES.rarelyChanges,
  })
}
