import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import Heading from '@/src/components/core/typography/Heading'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { ICustomer } from '@/src/interfaces'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useCustomerService } from '@/src/services/use-customer-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { CUSTOMER_VALIDATION } from '@/src/validations/inventory/customer'

type CustomerModalData = { customer?: ICustomer } | null

const CustomerModal = () => {
  const { t } = useTranslation(['customer', 'g'])
  const showError = useErrorToast()
  const { data } = useAppSelector(selectModal)
  const customer = (data as CustomerModalData)?.customer
  const { createCustomer, updateCustomer } = useCustomerService()
  const dispatch = useAppDispatch()
  const { afterCustomerChange } = useRefreshData()
  const methods = useForm({ resolver: CUSTOMER_VALIDATION, defaultValues: { name: customer?.name || '' } })

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      if (customer) {
        await updateCustomer(customer.customerId, { name: values.name })
      } else {
        await createCustomer({ name: values.name })
      }

      afterCustomerChange()
      dispatch(removeModal())
    } catch (error) {
      showError(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <Heading text={customer ? t('customer:modal.editTitle') : t('customer:modal.addTitle')} variant="2" size="base" color="grey" />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 mt-6">
        <InputText isRequired name="name" initValue={customer?.name} label={t('customer:modal.name')} placeholder={t('customer:modal.namePlh')} />

        <div className="flex justify-center">
          <MainButton text={t('g:button.submit')} variant="contained" size="medium" htmlType="submit" />
        </div>
      </form>
    </FormProvider>
  )
}

export default CustomerModal
