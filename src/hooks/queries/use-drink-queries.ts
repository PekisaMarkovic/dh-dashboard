import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { DrinkListParams, useDrinkService } from '@/src/services/use-drink-service'

/**
 * One page of drinks, of one warehouse or of all of them, optionally searched by name or code.
 * Every page and every search has its own cached entry; the previous page stays on the screen
 * while the next one loads.
 */
export const useDrinksQuery = (params: DrinkListParams, enabled = true) => {
  const { getDrinks } = useDrinkService()

  return useQuery({
    queryKey: [...QUERY_KEYS.drinks, params],
    queryFn: () => getDrinks(params),
    enabled,
    staleTime: STALE_TIMES.stock,
    placeholderData: keepPreviousData,
  })
}
