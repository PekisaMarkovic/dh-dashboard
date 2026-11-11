import { IRole } from '@/src/interfaces/user'

export interface ICompany {
  companyId: number
  // the name is printed on the documents too (the proforma)
  name: string
  street: string
  city: string
  pib: string
  registrationNumber: string
  phone: string | null
  bankAccount: string
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
  // when the email went out last (changes when the invitation is sent again)
  sentAt: string
  expiresAt: string
  acceptedAt: string | null
}
