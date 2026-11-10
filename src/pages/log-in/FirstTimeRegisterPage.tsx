import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import LandingLayout from '@/src/layouts/LandingLayout'
import FirstTimeRegisterDetails from '@/src/modules/log-in/FirstTimeRegisterDetails'
import { FIRST_TIME_REGISTER_VALIDATION } from '@/src/validations/log-in/first-time-register'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '@/src/hooks/use-api'
import { useEffect, useState } from 'react'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import InvitationApis from '@/src/api/invitations'
import InvalidFistTimeRegisterToken from '@/src/modules/log-in/partials/InvalidFistTimeRegisterToken'

const FirstTimeRegisterPage = () => {
  const methods = useForm({ resolver: FIRST_TIME_REGISTER_VALIDATION })
  const { t } = useTranslation(['log-in'])
  const navigate = useNavigate()
  const { invitationId } = useParams()
  const api = useApi()
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<boolean>(false)

  const checkInvitation = async () => {
    try {
      const { data } = await api.get(InvitationApis.isValid(invitationId!))
      setIsValid(data)
    } catch {
      navigate(ROUTE_NAMES.index)
    } finally {
      setIsLoad(true)
    }
  }

  useEffect(() => {
    if (!invitationId) {
      navigate(ROUTE_NAMES.index)
    } else {
      checkInvitation()
    }
  }, [])

  return (
    <FormProvider {...methods}>
      <LandingLayout title={t('log-in:titleInvitation')}>
        {isLoad && <>{isValid ? <FirstTimeRegisterDetails /> : <InvalidFistTimeRegisterToken />}</>}
      </LandingLayout>
    </FormProvider>
  )
}

export default FirstTimeRegisterPage
