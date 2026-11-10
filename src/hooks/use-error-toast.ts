import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import customToast from '@/src/components/core/toast/CustomToast'
import { getApiErrorMessage } from '@/src/utils/api-error'

/**
 * Shows the message the API sent for a failed request, or the general error text
 * when there is none. Use it in every catch block that talks to the API.
 */
export const useErrorToast = () => {
  const { t } = useTranslation('g')

  return useCallback((error: unknown) => customToast.error(getApiErrorMessage(error, t('errorMessage'))), [t])
}
