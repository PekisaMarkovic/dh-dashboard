import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { useAuthService } from '@/src/services/use-auth-service'
import { signIn } from '@/src/utils/auth'
import { decodeToken } from '@/src/utils/token'
import { SaveDisabledEnums } from '@/src/enum'
import { handleAllowSave, handleDisableSave, selectBehaviours } from '@/src/state/shared/behaviours'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'

const LogInDetails = () => {
  const { t } = useTranslation(['log-in', 'g'])
  const showError = useErrorToast()
  const { handleSubmit } = useFormContext()
  const dispatch = useAppDispatch()
  const { logIn } = useAuthService()
  const navigate = useNavigate()
  const { isSaveDisabled } = useAppSelector(selectBehaviours)

  const handleSubmitForm: SubmitHandler<FieldValues> = async (values) => {
    dispatch(handleDisableSave(SaveDisabledEnums.LOGIN_IN))

    try {
      const data = await logIn({ email: values.email, password: values.password })
      const tokenPayload = decodeToken(data.access_token)

      signIn(data)
      customToast.success(t('static:welcome', { name: `${tokenPayload.firstName} ${tokenPayload.lastName}` }))
      navigate(ROUTE_NAMES.proformas)
    } catch (error) {
      showError(error)
    } finally {
      dispatch(handleAllowSave(SaveDisabledEnums.LOGIN_IN))
    }
  }

  return (
    <form className="w-full flex flex-col gap-y-4 mt-8" onSubmit={handleSubmit(handleSubmitForm)}>
      <InputText isRequired name="email" label={t('log-in:fields.email')} placeholder={t('log-in:fields.emailPlh')} />
      <InputText isRequired name="password" label={t('log-in:fields.password')} placeholder={t('log-in:fields.passwordPlh')} typeHtml="password" />

      <MainButton
        text={t('g:button.signIn')}
        disabled={isSaveDisabled.includes(SaveDisabledEnums.LOGIN_IN)}
        variant="contained"
        size="medium"
        htmlType="submit"
        className="justify-center"
      />
    </form>
  )
}

export default LogInDetails
