import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { IWebsiteUpdate } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'

/** Runs a change of the website, loads the website again and shows the result. Returns true when it worked. */
export const useWebsiteAction = () => {
  const { t } = useTranslation(['website'])
  const showError = useErrorToast()
  const { afterWebsiteChange } = useRefreshData()

  return useCallback(
    async (action: () => Promise<unknown>, doneText: string = t('website:saved')) => {
      try {
        await action()
        await afterWebsiteChange()
        customToast.success(doneText)

        return true
      } catch (error) {
        showError(error)

        return false
      }
    },
    [afterWebsiteChange, showError, t],
  )
}

/** Saves the general info of the website */
export const useSaveWebsite = () => {
  const run = useWebsiteAction()
  const { updateWebsite } = useWebsiteService()

  return useCallback((body: IWebsiteUpdate) => run(() => updateWebsite(body)), [run, updateWebsite])
}
