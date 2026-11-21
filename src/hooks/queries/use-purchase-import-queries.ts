import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PageParams } from '@/src/interfaces'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { usePurchaseImportService } from '@/src/services/use-purchase-import-service'

export const usePurchaseImportsQuery = (params: PageParams) => {
  const { getHistory } = usePurchaseImportService()

  return useQuery({
    queryKey: [...QUERY_KEYS.purchaseImports, 'list', params],
    queryFn: () => getHistory(params),
    staleTime: STALE_TIMES.proformas,
    // the page before stays visible while the next one loads
    placeholderData: keepPreviousData,
  })
}

// one document with its lines, under the key of the history so one reload refreshes both
export const usePurchaseImportQuery = (purchaseImportId?: number) => {
  const { getImport } = usePurchaseImportService()

  return useQuery({
    queryKey: [...QUERY_KEYS.purchaseImports, 'detail', purchaseImportId],
    queryFn: () => getImport(purchaseImportId as number),
    enabled: !!purchaseImportId,
    staleTime: 0,
  })
}
