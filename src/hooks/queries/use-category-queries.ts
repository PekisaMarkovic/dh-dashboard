import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { useCategoryService } from '@/src/services/use-category-service'

export const useCategoriesQuery = () => {
  const { getCategories } = useCategoryService()

  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: getCategories,
    staleTime: STALE_TIMES.rarelyChanges,
  })
}
