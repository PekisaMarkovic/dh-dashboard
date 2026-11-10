import { RoleEnums } from '@/src/enum'
import { store } from '@/src/state/store'

export const getUserRoles = () => {
  const roleNames = store.getState().auth.user?.roles.map((r) => r.name) || []

  const isRegularUser = roleNames.includes(RoleEnums.USER)
  const isAdmin = roleNames.includes(RoleEnums.ADMIN)
  const isSuperAdmin = roleNames.includes(RoleEnums.SUPER_ADMIN)
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin

  return {
    isRegularUser,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
  }
}
