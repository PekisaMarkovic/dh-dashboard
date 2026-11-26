import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputTextarea from '@/src/components/core/input/InputTextarea'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useOrderService } from '@/src/services/use-order-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, removeModal, selectModal } from '@/src/state/shared/modal'

// the same as the api (UpdateOrderStatusDto)
const MAX_REASON = 500

/** Cancels an order: the reason (can be empty) goes to the buyer in an email */
const CancelOrderModal = () => {
  const { t } = useTranslation(['order'])
  const showError = useErrorToast()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectModal)
  // fromDetail: it was opened from the window of the order, "back" goes there; from the list it only closes
  const { orderId, fromDetail } = data as { orderId: number; fromDetail?: boolean }
  const { updateOrderStatus } = useOrderService()
  const { afterOrderChange } = useRefreshData()
  const methods = useForm<{ reason: string }>({ defaultValues: { reason: '' } })
  const [isSaving, setIsSaving] = useState(false)

  // nothing changes
  const handleBack = () => dispatch(fromDetail ? openModal({ modal: ModalEnums.ORDER_DETAIL, data: { orderId } }) : removeModal())

  const handleConfirm = methods.handleSubmit(async ({ reason }) => {
    setIsSaving(true)

    try {
      await updateOrderStatus(orderId, 'cancelled', reason.trim().slice(0, MAX_REASON))
      await afterOrderChange()
      customToast.success(t('order:cancel.done', { number: orderId }))
      dispatch(removeModal())
    } catch (error) {
      showError(error)
    } finally {
      setIsSaving(false)
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleConfirm} className="w-[480px] max-w-full">
        <Heading text={t('order:cancel.title', { number: orderId })} variant="2" size="base" color="black" />
        <Paragraph text={t('order:cancel.message')} size="sm" color="grey" className="mt-3" />

        <div className="mt-6">
          <InputTextarea name="reason" rows={4} maxChar={MAX_REASON} label={t('order:cancel.reason')} placeholder={t('order:cancel.reasonPlh')} />
        </div>

        <div className="flex flex-wrap justify-end gap-4 mt-8">
          <MainButton text={t('order:cancel.back')} variant="alternative" size="medium" onClick={handleBack} />
          <MainButton text={t('order:cancel.confirm')} variant="error" size="medium" htmlType="submit" disabled={isSaving} />
        </div>
      </form>
    </FormProvider>
  )
}

export default CancelOrderModal
