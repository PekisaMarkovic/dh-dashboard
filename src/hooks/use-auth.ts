import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthApis from '@/src/api/auth'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { removeUserData, setUserData } from '@/src/state/user/authSlice'
import { clearLocalStorageTokens, getAccessToken, getTokenPayload } from '@/src/utils/token'
import { useApi } from '@/src/hooks/use-api'

const unprotectedRoutes = [ROUTE_NAMES.index, ROUTE_NAMES.notFound]

export const useAuth = () => {
  const api = useApi()
  const [isLoad, setIsLoad] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleUnauthorized = useCallback(() => {
    dispatch(removeUserData())
    clearLocalStorageTokens()
    navigate(ROUTE_NAMES.index)
  }, [dispatch, navigate])

  const initializeAuth = useCallback(async () => {
    try {
      const accessToken = getAccessToken()
      const tokenPayload = getTokenPayload()

      if (!tokenPayload || !accessToken) {
        if (!unprotectedRoutes.includes(pathname) && !pathname.includes('/first-time-register')) {
          handleUnauthorized()
        }
        return
      }

      const { data } = await api.post(AuthApis.isUserTokenValid())

      if (data) {
        dispatch(setUserData({ tokenPayload, accessToken }))
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
