import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { useDrinkService } from '@/src/services/use-drink-service'

/**
 * The drinks of one warehouse, or of all warehouses when no warehouse is given.
 * Every warehouse has its own cached list.
 */
export const useDrinksQuery = (warehouseId?: number, enabled = true) => {
  const { getDrinks } = useDrinkService()

  return useQuery({
    queryKey: [...QUERY_KEYS.drinks, warehouseId ?? 'all'],
    queryFn: () => getDrinks(warehouseId),
    enabled,
    staleTime: STALE_TIMES.stock,
  })
}
