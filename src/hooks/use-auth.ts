import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { removeUserData, setUserData } from '@/src/state/user/authSlice'
import { clearLocalStorageTokens, getAccessToken, getTokenPayload } from '@/src/utils/token'
import { queryClient } from '@/src/state/query-client'
import { useAuthService } from '@/src/services/use-auth-service'

const unprotectedRoutes = [ROUTE_NAMES.index, ROUTE_NAMES.notFound]

export const useAuth = () => {
  const { isTokenValid } = useAuthService()
  const [isLoad, setIsLoad] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleUnauthorized = useCallback(() => {
    queryClient.clear()
    dispatch(removeUserData())
    clearLocalStorageTokens()
    navigate(ROUTE_NAMES.index)
  }, [dispatch, navigate])

  const initializeAuth = useCallback(async () => {
    try {
      if (!getAccessToken() || !getTokenPayload()) {
        if (!unprotectedRoutes.includes(pathname) && !pathname.includes('/first-time-register')) {
          handleUnauthorized()
        }
        return
      }

      const isValid = await isTokenValid()

      // read the tokens again, the call above may have renewed them
      const accessToken = getAccessToken()
      const tokenPayload = getTokenPayload()

      if (isValid && accessToken && tokenPayload) {
        dispatch(setUserData({ tokenPayload, accessToken }))
      } else {
        handleUnauthorized()
      }
    } catch {
      handleUnauthorized()
    } finally {
      setIsLoad(true)
    }
  }, [dispatch, handleUnauthorized])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return { isLoad }
}
