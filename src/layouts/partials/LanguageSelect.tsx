import { useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import UserApis from '@/src/api/user'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import customToast from '@/src/components/core/toast/CustomToast'
import { useApi } from '@/src/hooks/use-api'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectAuthUser, setUserProfileData } from '@/src/state/user/authSlice'
import { applyLanguage, isLanguage, LANGUAGE_OPTIONS, languageToOption } from '@/src/utils/language'

/**
 * Switches the language immediately and saves it as the preference of the logged in user
 */
const LanguageSelect = () => {
  const { t, i18n } = useTranslation(['g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectAuthUser)
  const methods = useForm({ defaultValues: { language: languageToOption(i18n.resolvedLanguage) } })
  const selected = useWatch({ control: methods.control, name: 'language' })

  // the user picked another language in the dropdown
  useEffect(() => {
    const next = selected?.value

    if (!next || !isLanguage(next) || next === i18n.resolvedLanguage) return

    applyLanguage(next)

    if (!user) return

    dispatch(setUserProfileData({ user: { ...user, language: next } }))

    api.patch(UserApis.patchUserProfile(), { language: next }).catch(() => customToast.error(t('g:errorMessage')))
  }, [selected?.value])

  // the language changed somewhere else (login, profile page), keep the dropdown in sync
  useEffect(() => {
    methods.setValue('language', languageToOption(i18n.resolvedLanguage))
  }, [i18n.resolvedLanguage])

  return (
    <FormProvider {...methods}>
      <div className="w-36">
        <SingleSelect compact isLabelHidden name="language" label={t('g:language')} options={LANGUAGE_OPTIONS} />
      </div>
    </FormProvider>
  )
}

export default LanguageSelect
