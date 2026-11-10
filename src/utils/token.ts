import { jwtDecode, JwtDecodeOptions } from 'jwt-decode'
import { TokenPayload } from '@/src/interfaces'

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

export const isTokenExpired = (token: string) => {
  if (!token) return true
  try {
    const decoded = jwtDecode(token) as TokenPayload

    const currentTime = new Date().getTime()

    if (decoded.expires && decoded.expires < currentTime) {
      return true
    }

    return false
  } catch {
    return false
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
