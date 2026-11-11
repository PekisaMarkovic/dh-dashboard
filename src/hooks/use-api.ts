import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import AuthApis from '@/src/api/auth'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { store } from '@/src/state/store'
import { queryClient } from '@/src/state/query-client'
import { endRequest, startRequest } from '@/src/state/api-loading'
import { removeUserData } from '@/src/state/user/authSlice'
import { signIn } from '@/src/utils/auth'
import { ACCESS_TOKEN, REFRESH_TOKEN, clearLocalStorageTokens, isTokenExpired } from '@/src/utils/token'

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

// these calls must never trigger a refresh, they are part of signing in/out
const AUTH_URLS = [AuthApis.logIn(), AuthApis.refresh(), AuthApis.firstTimeRegister()]
const isAuthUrl = (url?: string) => !!url && AUTH_URLS.some((authUrl) => url.includes(authUrl))

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN) || ''

  // plain axios on purpose: the instance below would try to refresh again
  const { data } = await axios.post(AuthApis.refresh(), { refreshToken }, { baseURL: import.meta.env.VITE_API_URL })

  return data
}

// The refresh token works only once, so when several requests find the token expired
// at the same time they all have to wait for the same refresh call.
let refreshing: Promise<string> | null = null

const refreshAccessToken = () => {
  if (!refreshing) {
    refreshing = refreshToken()
      .then((data) => {
        signIn(data)

        return data.access_token as string
      })
      .finally(() => {
        refreshing = null
      })
  }

  return refreshing
}

const logOut = () => {
  // the next person must never see the data of this one
  queryClient.clear()
  store.dispatch(removeUserData())
  clearLocalStorageTokens()

  if (window.location.pathname !== ROUTE_NAMES.index) {
    window.location.assign(ROUTE_NAMES.index)
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config: RetriableConfig) => {
  // the loader is shown from now on, the response handlers below end it (also when this one rejects)
  startRequest()

  let token = localStorage.getItem(ACCESS_TOKEN) || ''

  if (token && !isAuthUrl(config.url) && isTokenExpired(token)) {
    try {
      token = await refreshAccessToken()
    } catch {
      // the refresh token is gone or too old, the user has to sign in again
      logOut()

      return Promise.reject(new axios.Cancel('Session expired'))
    }
  }

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    endRequest()

    return response
  },
  async (error: AxiosError) => {
    // this request is over, a retry below starts (and counts) a new one
    endRequest()

    const config = error.config as RetriableConfig | undefined

    // the server did not accept the token (for example it was revoked): try once with a fresh one
    if (error.response?.status === 401 && config && !isAuthUrl(config.url) && localStorage.getItem(ACCESS_TOKEN)) {
      if (config._retried) {
        logOut()

        return Promise.reject(error)
      }

      try {
        const token = await refreshAccessToken()

        config._retried = true
        config.headers.set('Authorization', `Bearer ${token}`)

        return api(config)
      } catch {
        logOut()
      }
    }

    return Promise.reject(error)
  },
)

export const useApi = () => api
