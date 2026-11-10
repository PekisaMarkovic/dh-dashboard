import { IRole } from '@/src/interfaces/user'

export interface ICompany {
  companyId: number
  name: string
  createdAt: string
}

export interface ICompanyUser {
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  createdAt: string
  roles: IRole[]
}

export type InvitationStatus = 'pending' | 'accepted' | 'expired'

export interface IInvitation {
  invitationId: string
  email: string
  status: InvitationStatus
  createdAt: string
  expiresAt: string
  acceptedAt: string | null
}
