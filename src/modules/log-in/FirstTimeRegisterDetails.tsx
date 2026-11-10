import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import AuthApis from '@/src/api/auth'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import customToast from '@/src/components/core/toast/CustomToast'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { useApi } from '@/src/hooks/use-api'
import { signIn } from '@/src/utils/auth'
import { decodeToken } from '@/src/utils/token'

const FirstTimeRegisterDetails = () => {
  const { t } = useTranslation(['log-in', 'g', 'static'])
  const { handleSubmit } = useFormContext()
  const api = useApi()
  const navigate = useNavigate()
  const { invitationId } = useParams()

  const handleSubmitForm: SubmitHandler<FieldValues> = async (values) => {
    try {
      const { data } = await api.post(AuthApis.firstTimeRegister(), { invitationId, ...values })
      const tokenPayload = decodeToken(data.access_token)

      signIn(data)
      customToast.success(t('static:welcome', { name: `${tokenPayload.firstName} ${tokenPayload.lastName}` }))
      navigate(ROUTE_NAMES.proformas)
    } catch {
      customToast.error(t('g:errorMessage'))
    }
  }

  return (
    <form className="w-full flex flex-col gap-y-4 mt-8" onSubmit={handleSubmit(handleSubmitForm)}>
      <InputText isRequired name="firstName" label={t('log-in:fields.firstName')} placeholder={t('log-in:fields.firstNamePlh')} />

      <InputText isRequired name="lastName" label={t('log-in:fields.lastName')} placeholder={t('log-in:fields.lastNamePlh')} />

      <InputText isRequired name="password" label={t('log-in:fields.password')} placeholder={t('log-in:fields.passwordPlh')} typeHtml="password" />

      <MainButton text={t('log-in:register')} variant="contained" size="medium" htmlType="submit" className="justify-center" />
    </form>
  )
}

export default FirstTimeRegisterDetails
