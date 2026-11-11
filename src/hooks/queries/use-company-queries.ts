import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PageParams } from '@/src/interfaces'
import { QUERY_KEYS } from '@/src/constatns/query-keys'
import { STALE_TIMES } from '@/src/constatns/stale-times'
import { useCompanyService } from '@/src/services/use-company-service'
import { useInvitationService } from '@/src/services/use-invitation-service'

export const useCompanyQuery = (companyId?: number | null) => {
  const { getCompany } = useCompanyService()

  return useQuery({
    queryKey: [...QUERY_KEYS.company, companyId],
    queryFn: () => getCompany(companyId as number),
    // a user without a company has nothing to load
    enabled: !!companyId,
    staleTime: STALE_TIMES.rarelyChanges,
  })
}

export const useCompanyUsersQuery = (companyId: number | null | undefined, params: PageParams) => {
  const { getCompanyUsers } = useCompanyService()

  return useQuery({
    queryKey: [...QUERY_KEYS.companyUsers, companyId, params],
    queryFn: () => getCompanyUsers(companyId as number, params),
    enabled: !!companyId,
    staleTime: STALE_TIMES.rarelyChanges,
    placeholderData: keepPreviousData,
  })
}

export const useInvitationsQuery = (params: PageParams) => {
  const { getInvitations } = useInvitationService()

  return useQuery({
    queryKey: [...QUERY_KEYS.invitations, params],
    queryFn: () => getInvitations(params),
    staleTime: STALE_TIMES.rarelyChanges,
    placeholderData: keepPreviousData,
  })
}
