import axios from 'axios'

type ApiErrorBody = {
  statusCode?: number
  message?: string | string[]
  errors?: string[]
}

/**
 * Reads the message the API sent (`message`, or the `errors` list for validation problems).
 * Returns the fallback when there is no response (network down) or the API sent nothing readable.
 */
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  // the api client cancels a request when the session could not be renewed
  if (axios.isCancel(error)) return error.message || fallback
  if (!axios.isAxiosError<ApiErrorBody>(error)) return fallback

  const body = error.response?.data

  if (!body || typeof body !== 'object') return fallback

  if (Array.isArray(body.errors) && body.errors.length) return body.errors.join('. ')
  if (Array.isArray(body.message) && body.message.length) return body.message.join('. ')
  if (typeof body.message === 'string' && body.message.trim()) return body.message

  return fallback
}
