import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PageParams } from '@/src/interfaces'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { useProformaService } from '@/src/services/use-proforma-service'

export const useProformasQuery = (params: PageParams) => {
  const { getProformas } = useProformaService()

  return useQuery({
    queryKey: [...QUERY_KEYS.proformas, params],
    queryFn: () => getProformas(params),
    staleTime: STALE_TIMES.proformas,
    placeholderData: keepPreviousData,
  })
}

export const useProformaQuery = (proformaId?: number) => {
  const { getProforma } = useProformaService()

  return useQuery({
    queryKey: [...QUERY_KEYS.proforma, proformaId],
    queryFn: () => getProforma(proformaId as number),
    enabled: !!proformaId,
    staleTime: STALE_TIMES.proformaDetail,
  })
}
