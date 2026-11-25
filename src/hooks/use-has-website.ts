import { useWebsiteQuery } from '@/src/hooks/queries/use-website-queries'
import { useRoles } from '@/src/hooks/use-roles'

/** True when the user is an admin of a company that has a white label website, the menu item "Web sajt" is shown only then */
export const useHasWebsite = () => {
  const { isAdmin } = useRoles()
  const { data } = useWebsiteQuery(isAdmin)

  return isAdmin && !!data
}
