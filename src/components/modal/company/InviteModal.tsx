import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useInvitationService } from '@/src/services/use-invitation-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal } from '@/src/state/shared/modal'
import { INVITE_VALIDATION } from '@/src/validations/inventory/invite'

const InviteModal = () => {
  const { t } = useTranslation(['company', 'g'])
  const showError = useErrorToast()
  const { invite } = useInvitationService()
  const dispatch = useAppDispatch()
  const { afterInvitationChange } = useRefreshData()
  const methods = useForm({ resolver: INVITE_VALIDATION, defaultValues: { email: '' } })

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      await invite(values.email)
      customToast.success(t('company:invite.sent'))
      afterInvitationChange()
      dispatch(removeModal())
    } catch (error) {
      showError(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-96 max-w-full flex flex-col items-center text-center gap-y-6">
        <div className="flex flex-col items-center gap-y-2">
          <Heading text={t('company:invite.title')} variant="2" size="base" color="black" />
          <Paragraph text={t('company:invite.subtitle')} size="sm" color="grey" className="text-center" />
        </div>

        <div className="w-full text-left">
          <InputText isRequired name="email" label={t('company:invite.email')} placeholder={t('company:invite.emailPlh')} />
        </div>

        <MainButton text={t('company:invite.button')} variant="contained" size="medium" htmlType="submit" />
      </form>
    </FormProvider>
  )
}

export default InviteModal
