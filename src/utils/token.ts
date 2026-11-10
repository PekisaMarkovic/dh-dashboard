import { jwtDecode, JwtDecodeOptions } from 'jwt-decode'
import { TokenPayload } from '@/src/interfaces'

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

// treat the token as expired a few seconds early, so it never dies while the request is on its way
const EXPIRE_SKEW_MS = 10_000

export const isTokenExpired = (token: string) => {
  if (!token) return true

  try {
    const { exp } = jwtDecode<TokenPayload>(token)

    // `exp` is in seconds
    return !exp || exp * 1000 - EXPIRE_SKEW_MS < Date.now()
  } catch {
    return true
  }
}

export const setLocalStorageTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken)
  localStorage.setItem(REFRESH_TOKEN, refreshToken)
}

export const decodeToken = (token: string, options?: JwtDecodeOptions) => {
  return jwtDecode<TokenPayload>(token, options)
}

export const clearLocalStorageTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN)
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN)
}

export const getTokenPayload = (): TokenPayload | null => {
  const token = localStorage.getItem(ACCESS_TOKEN)

  return token ? decodeToken(token) : null
}
