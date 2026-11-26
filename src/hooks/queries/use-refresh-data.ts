import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'

/**
 * Call the right one after something was changed, so the lists that show it load again.
 * It says in one place what depends on what:
 * - a drink changed: the lists of drinks and the categories (their numbers of drinks)
 * - a category changed: the categories and the drinks (they show their categories)
 * - a warehouse changed: the warehouses and the drinks
 * - a proforma was made or returned: the proformas and the drinks (the stock changed)
 * - the status of an order changed: the orders
 * - a customer, the company or an invitation changed: only their own data
 */
export const useRefreshData = () => {
  const queryClient = useQueryClient()

  return useMemo(() => {
    const reload = (...keys: (readonly unknown[])[]) => {
      return Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
    }

    return {
      afterDrinkChange: () => reload(QUERY_KEYS.drinks, QUERY_KEYS.categories),
      afterCategoryChange: () => reload(QUERY_KEYS.categories, QUERY_KEYS.drinks),
      afterWarehouseChange: () => reload(QUERY_KEYS.warehouses, QUERY_KEYS.drinks),
      afterProformaChange: () => reload(QUERY_KEYS.proformas, QUERY_KEYS.proforma, QUERY_KEYS.drinks),
      // a document was read (a new line of the history) or added to the stock (the drinks changed too)
      afterPurchaseImport: () => reload(QUERY_KEYS.purchaseImports, QUERY_KEYS.drinks),
      afterOrderChange: () => reload(QUERY_KEYS.orders, QUERY_KEYS.order),
      afterCustomerChange: () => reload(QUERY_KEYS.customers),
      afterCompanyChange: () => reload(QUERY_KEYS.company),
      // the content of the website changed (texts, pictures) or a message came
      afterWebsiteChange: () => reload(QUERY_KEYS.website, QUERY_KEYS.websiteContacts),
      afterInvitationChange: () => reload(QUERY_KEYS.invitations, QUERY_KEYS.companyUsers),
    }
  }, [queryClient])
}
