import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { PageParams } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'

/** The website of the company of the user, null when the company has none. Only admins can have the data. */
export const useWebsiteQuery = (enabled = true) => {
  const { getWebsite } = useWebsiteService()

  return useQuery({
    queryKey: QUERY_KEYS.website,
    queryFn: getWebsite,
    enabled,
    staleTime: STALE_TIMES.rarelyChanges,
  })
}

// the messages of the contact form, a page at a time, newest first
export const useWebsiteContactsQuery = (params: PageParams, enabled = true) => {
  const { getContacts } = useWebsiteService()

  return useQuery({
    queryKey: [...QUERY_KEYS.websiteContacts, params],
    queryFn: () => getContacts(params),
    enabled,
    // a new message can come at any time
    staleTime: STALE_TIMES.stock,
    placeholderData: keepPreviousData,
  })
}
