import { useMemo } from 'react'
import InvitationApis from '@/src/api/invitations'
import { useApi } from '@/src/hooks/use-api'
import { IInvitation, PageParams, Paginated } from '@/src/interfaces'

export const useInvitationService = () => {
  const api = useApi()

  return useMemo(() => {
    const invite = async (email: string) => {
      await api.post(InvitationApis.invite(), { email })
    }

    const getInvitations = async ({ search, ...paging }: PageParams) => {
      const { data } = await api.get<Paginated<IInvitation>>(InvitationApis.getInvitations(), { params: { ...paging, search: search || undefined } })

      return data
    }

    const resendInvitation = async (invitationId: string) => {
      await api.post(InvitationApis.resend(invitationId))
    }

    const isInvitationValid = async (invitationId: string) => {
      const { data } = await api.get<boolean>(InvitationApis.isValid(invitationId))

      return data
    }

    return { invite, getInvitations, resendInvitation, isInvitationValid }
  }, [api])
}
