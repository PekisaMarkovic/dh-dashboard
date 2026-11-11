import { QueryCache, QueryClient } from '@tanstack/react-query'
import i18n from 'i18next'
import customToast from '@/src/components/core/toast/CustomToast'
import { getApiErrorMessage } from '@/src/utils/api-error'

const MINUTE = 60 * 1000

/**
 * The cache of the data from the api. A page that was visited shows its data right away
 * and the data is loaded again in the background when it is older than its "staleTime"
 * (set per query in src/hooks/queries, the times are in src/constatns/stale-times.ts).
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // a failed refresh in the background is not worth a message while there is data to show
    onError: (error, query) => {
      if (query.state.data === undefined) {
        customToast.error(getApiErrorMessage(error, i18n.t('g:errorMessage')))
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: MINUTE,
      gcTime: 10 * MINUTE,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})
