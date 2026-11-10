import { useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useUserService } from '@/src/services/use-user-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectAuthUser, setUserProfileData } from '@/src/state/user/authSlice'
import { applyLanguage, isLanguage, LANGUAGE_OPTIONS, languageToOption } from '@/src/utils/language'

/**
 * Switches the language immediately and saves it as the preference of the logged in user
 */
const LanguageSelect = () => {
  const { t, i18n } = useTranslation(['g'])
  const showError = useErrorToast()
  const { updateProfile } = useUserService()
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

    const saveLanguage = async () => {
      try {
        await updateProfile({ language: next })
      } catch (error) {
        showError(error)
      }
    }

    saveLanguage()
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
