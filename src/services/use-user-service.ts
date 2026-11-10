import { useMemo } from 'react'
import UserApis from '@/src/api/user'
import { useApi } from '@/src/hooks/use-api'
import { User } from '@/src/interfaces'

type UpdateProfileBody = {
  language?: string
  phoneNumber?: string | null
  dateOfBirth?: string | null
}

export const useUserService = () => {
  const api = useApi()

  return useMemo(() => {
    const getProfile = async () => {
      const { data } = await api.get<User>(UserApis.getProfile())

      return data
    }

    const updateProfile = async (body: UpdateProfileBody) => {
      const { data } = await api.patch(UserApis.patchUserProfile(), body)

      return data
    }

    return { getProfile, updateProfile }
  }, [api])
}
