import { FormProvider, useForm } from 'react-hook-form'
import LogInDetails from '@/src/modules/log-in/LogInDetails'
import { LOG_IN_VALIDATION } from '@/src/validations/log-in/log-in'
import LandingLayout from '@/src/layouts/LandingLayout'
import { useTranslation } from 'react-i18next'

const LogInPage = () => {
  const methods = useForm({ resolver: LOG_IN_VALIDATION })
  const { t } = useTranslation(['log-in'])

  return (
    <FormProvider {...methods}>
      <LandingLayout title={t('log-in:title')}>
        <LogInDetails />
      </LandingLayout>
    </FormProvider>
  )
}

export default LogInPage
