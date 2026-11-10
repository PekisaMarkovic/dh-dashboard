import { RoleEnums } from '@/src/enum'
import { useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectAuthUser } from '@/src/state/user/authSlice'

export const useRoles = () => {
  const { user } = useAppSelector(selectAuthUser)
  const roles = (user?.roles || []).map((role) => role.name)

  return {
    isAdmin: roles.includes(RoleEnums.ADMIN) || roles.includes(RoleEnums.SUPER_ADMIN),
    isSuperAdmin: roles.includes(RoleEnums.SUPER_ADMIN),
  }
}
