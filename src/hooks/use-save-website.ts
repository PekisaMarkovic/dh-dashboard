import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { IWebsiteUpdate } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'

/** Saves a change of the website, shows the result and loads the website again. Returns true when it was saved. */
export const useSaveWebsite = () => {
  const { t } = useTranslation(['website'])
  const showError = useErrorToast()
  const { updateWebsite } = useWebsiteService()
  const { afterWebsiteChange } = useRefreshData()

  return useCallback(
    async (body: IWebsiteUpdate) => {
      try {
        await updateWebsite(body)
        await afterWebsiteChange()
        customToast.success(t('website:saved'))

        return true
      } catch (error) {
        showError(error)

        return false
      }
    },
    [updateWebsite, afterWebsiteChange, showError, t],
  )
}
