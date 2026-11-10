import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import UserProfile from '@/src/modules/profiles/UserProfile'
import { useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectAuthUser } from '@/src/state/user/authSlice'
import { UPDATE_PROFILE_VALIDATION } from '@/src/validations/users/profile'
import { useUserService } from '@/src/services/use-user-service'
import { languageToOption } from '@/src/utils/language'
import { formatDate } from '@/src/utils/date'

const UserProfilePage = () => {
  const { user } = useAppSelector(selectAuthUser)
  const { getProfile } = useUserService()
  const { i18n } = useTranslation()
  const methods = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      language: languageToOption(user?.language),
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth ? formatDate(user.dateOfBirth) : '',
    },
    resolver: UPDATE_PROFILE_VALIDATION,
  })

  // the token can be stale, so load the current values from the API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile()

        methods.reset({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          language: languageToOption(profile.language),
          phoneNumber: profile.phoneNumber || '',
          dateOfBirth: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : '',
        })
      } catch {
        // the values from the token stay in the form
      }
    }

    fetchProfile()
  }, [])

  // keep the field in sync when the language is changed from the top menu
  useEffect(() => {
    methods.setValue('language', languageToOption(i18n.resolvedLanguage))
  }, [i18n.resolvedLanguage])

  return (
    <FormProvider {...methods}>
      <UserProfile />
    </FormProvider>
  )
}

export default UserProfilePage
