import { PermissionEnums, RoleEnums } from '@/src/enum'
import { Language } from '@/src/utils/language'
import { Nullable } from '@/src/interfaces/general'

export interface IPermisions {
  id: number
  name: PermissionEnums
}

export interface IRole {
  id: number
  name: RoleEnums
  permissions: PermissionEnums[]
}

export type TokenData = {
  access_token: string
  refresh_token: string
}

export type TokenPayload = {
  email: string
  firstName: string
  lastName: string
  language: Language
  phoneNumber: Nullable<string>
  dateOfBirth: Nullable<Date>
  roles: IRole[]
  companyId: Nullable<number>
  exp: number
  iat: number
}

export interface User {
  userId: number
  firstName: string
  lastName: string
  language: Language
  dateOfBirth: Nullable<Date>
  createdAt: Nullable<Date>
  updatedAt: Nullable<Date>
  deletedAt: Nullable<Date>
  lastLoggedInAt: Nullable<Date>
  email: string
  phoneNumber: Nullable<string>
  isEmailConfirmed: boolean
}
