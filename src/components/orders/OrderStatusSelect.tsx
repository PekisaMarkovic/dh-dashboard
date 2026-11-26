import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import customToast from '@/src/components/core/toast/CustomToast'
import { ModalEnums } from '@/src/enum'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { IOrder, OrderStatus, SelectOption } from '@/src/interfaces'
import { useOrderService } from '@/src/services/use-order-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { ORDER_STATUSES } from '@/src/utils/order-status'

/**
 * The status of an order as a select with all the statuses (also back, after a wrong click).
 * A picked status is saved at once; "cancelled" opens the window for the reason first (the buyer gets an email).
 */
const OrderStatusSelect = ({ order }: { order: IOrder }) => {
  const { t } = useTranslation(['order'])
  const showError = useErrorToast()
  const dispatch = useAppDispatch()
  const { updateOrderStatus } = useOrderService()
  const { afterOrderChange } = useRefreshData()
  const toOption = (status: OrderStatus): SelectOption => ({ id: status, name: t(`order:status.${status}`), value: status })
  const current = toOption(order.status)
  const methods = useForm<{ status: SelectOption | Record<string, never> }>({ defaultValues: { status: current } })
  const picked = useWatch({ control: methods.control, name: 'status' })
  const pickedStatus = (picked as SelectOption | undefined)?.value as OrderStatus | undefined
  // a new key draws the select again with the current status (after a failed save or a click on the current one)
  const [resetKey, setResetKey] = useState(0)

  const showCurrent = () => {
    methods.setValue('status', current)
    setResetKey((key) => key + 1)
  }

  useEffect(() => {
    // a click on the selected option clears the select, the status stays
    if (!pickedStatus) return showCurrent()
    if (pickedStatus === order.status) return

    if (pickedStatus === 'cancelled') {
      dispatch(openModal({ modal: ModalEnums.ORDER_CANCEL, data: { orderId: order.orderId, fromDetail: true } }))

      return
    }

    updateOrderStatus(order.orderId, pickedStatus)
      .then(() => afterOrderChange())
      .then(() => customToast.success(t('order:statusChanged', { number: order.orderId, status: t(`order:status.${pickedStatus}`) })))
      .catch((error) => {
        showError(error)
        showCurrent()
      })
    // only a new pick is a change of the status, not a new order object after the save
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedStatus])

  return (
    <FormProvider {...methods}>
      <SingleSelect
        key={resetKey}
        name="status"
        label={t('order:table.status')}
        initValue={current}
        options={ORDER_STATUSES.map(toOption)}
      />
    </FormProvider>
  )
}

export default OrderStatusSelect
