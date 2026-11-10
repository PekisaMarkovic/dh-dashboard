const base = 'auth'

const logIn = () => `${base}/login`
const refresh = () => `${base}/refresh`
const logout = () => `${base}/logout`
const isUserTokenValid = () => `${base}/is-user-token-valid`
const firstTimeRegister = () => `${base}/first-time-register`

const AuthApis = {
  logIn,
  firstTimeRegister,
  refresh,
  logout,
  isUserTokenValid,
}

export default AuthApis
