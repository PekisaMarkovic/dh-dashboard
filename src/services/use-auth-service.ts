import { useMemo } from 'react'
import AuthApis from '@/src/api/auth'
import { useApi } from '@/src/hooks/use-api'
import { TokenData } from '@/src/interfaces'

type LogInBody = {
  email: string
  password: string
}

type FirstTimeRegisterBody = Record<string, unknown>

export const useAuthService = () => {
  const api = useApi()

  return useMemo(() => {
    const logIn = async (body: LogInBody) => {
      const { data } = await api.post<TokenData>(AuthApis.logIn(), body)

      return data
    }

    const firstTimeRegister = async (body: FirstTimeRegisterBody) => {
      const { data } = await api.post<TokenData>(AuthApis.firstTimeRegister(), body)

      return data
    }

    const logOut = async () => {
      await api.post(AuthApis.logout())
    }

    const isTokenValid = async () => {
      const { data } = await api.post<boolean>(AuthApis.isUserTokenValid())

      return data
    }

    return { logIn, firstTimeRegister, logOut, isTokenValid }
  }, [api])
}
