import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'

/**
 * Call the right one after something was changed, so the lists that show it load again.
 * It says in one place what depends on what:
 * - a drink changed: the lists of drinks
 * - a warehouse changed: the warehouses and the drinks
 * - a proforma was made or returned: the proformas and the drinks (the stock changed)
 * - a customer, the company or an invitation changed: only their own data
 */
export const useRefreshData = () => {
  const queryClient = useQueryClient()

  return useMemo(() => {
    const reload = (...keys: (readonly unknown[])[]) => {
      return Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
    }

    return {
      afterDrinkChange: () => reload(QUERY_KEYS.drinks),
      afterWarehouseChange: () => reload(QUERY_KEYS.warehouses, QUERY_KEYS.drinks),
      afterProformaChange: () => reload(QUERY_KEYS.proformas, QUERY_KEYS.proforma, QUERY_KEYS.drinks),
      afterCustomerChange: () => reload(QUERY_KEYS.customers),
      afterCompanyChange: () => reload(QUERY_KEYS.company),
      afterInvitationChange: () => reload(QUERY_KEYS.invitations, QUERY_KEYS.companyUsers),
    }
  }, [queryClient])
}
