import { FieldValues, SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import UserApis from '@/src/api/user'
import customToast from '@/src/components/core/toast/CustomToast'
import { SaveDisabledEnums } from '@/src/enum'
import { useApi } from '@/src/hooks/use-api'
import GeneralLayout from '@/src/layouts/GeneralLayout'
import UserInfo from '@/src/pages/profile/partials/UserInfo'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { handleAllowSave, handleDisableSave } from '@/src/state/shared/behaviours'
import { selectAuthUser, setUserProfileData } from '@/src/state/user/authSlice'
import { applyLanguage } from '@/src/utils/language'
import { formatToIsoDate } from '@/src/utils/date'

const UserProfile = () => {
  const { user } = useAppSelector(selectAuthUser)
  const { t } = useTranslation(['g'])
  const api = useApi()
  const dispatch = useAppDispatch()

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // empty values are sent as null, so the fields can be cleared
    const body = {
      language: values.language?.value,
      phoneNumber: values.phoneNumber?.trim() || null,
      dateOfBirth: values.dateOfBirth ? formatToIsoDate(values.dateOfBirth) : null,
    }

    try {
      dispatch(handleDisableSave(SaveDisabledEnums.EDIT_PROFILE))

      await api.patch(UserApis.patchUserProfile(), body)

      if (user) {
        dispatch(setUserProfileData({ user: { ...user, ...body, dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null } }))
      }

      applyLanguage(body.language)
      customToast.success(t('g:profileSaved'))
    } catch {
      customToast.error(t('g:errorMessage'))
    } finally {
      dispatch(handleAllowSave(SaveDisabledEnums.EDIT_PROFILE))
    }
  }

  return (
    <GeneralLayout type="GENERAL_FORM" submit={onSubmit}>
      <UserInfo />
    </GeneralLayout>
  )
}

export default UserProfile
