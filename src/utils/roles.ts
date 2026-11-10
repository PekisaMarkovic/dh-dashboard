import { RoleEnums } from '@/src/enum'
import { IRole } from '@/src/interfaces'

// strongest first: a super admin also has the admin and user roles, but is shown as super admin
const ROLE_PRIORITY = [RoleEnums.SUPER_ADMIN, RoleEnums.ADMIN, RoleEnums.USER]

// keys in translations/*/general.json -> roles (the role names contain a dot, which i18n reads as a path)
const ROLE_TRANSLATION_KEYS: Record<RoleEnums, string> = {
  [RoleEnums.SUPER_ADMIN]: 'superAdmin',
  [RoleEnums.ADMIN]: 'admin',
  [RoleEnums.USER]: 'user',
}

export const getTopRole = (roles: IRole[] = []) => ROLE_PRIORITY.find((role) => roles.some((r) => r.name === role)) ?? null

/**
 * The translation key of the strongest role of a user, e.g. 'g:roles.superAdmin'
 */
export const getRoleTranslationKey = (roles: IRole[] = []) => {
  const role = getTopRole(roles)

  return role ? `g:roles.${ROLE_TRANSLATION_KEYS[role]}` : null
}
