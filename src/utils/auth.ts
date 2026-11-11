import { TokenData } from '@/src/interfaces'
import { store } from '@/src/state/store'
import { queryClient } from '@/src/state/query-client'
import { setUserData } from '@/src/state/user/authSlice'
import { applyLanguage } from '@/src/utils/language'
import { decodeToken, setLocalStorageTokens } from './token'

export const signIn = (data: TokenData) => {
  const { dispatch } = store
  const { access_token, refresh_token } = data

  setLocalStorageTokens(access_token, refresh_token)

  const tokenPayload = decodeToken(access_token)

  dispatch(setUserData({ tokenPayload, accessToken: access_token }))
  // every user keeps their own language, apply it as soon as they are signed in
  applyLanguage(tokenPayload.language)
}

/**
 * A person signs in (login, first registration): the cached data of anybody before is thrown away.
 * (signIn alone is also used when the token is renewed, then the cache has to stay.)
 */
export const startSession = (data: TokenData) => {
  queryClient.clear()
  signIn(data)
}
