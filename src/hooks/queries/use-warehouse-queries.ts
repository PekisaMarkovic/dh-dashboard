import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { useWarehouseService } from '@/src/services/use-warehouse-service'

export const useWarehousesQuery = () => {
  const { getWarehouses } = useWarehouseService()

  return useQuery({
    queryKey: QUERY_KEYS.warehouses,
    queryFn: getWarehouses,
    staleTime: STALE_TIMES.rarelyChanges,
  })
}
