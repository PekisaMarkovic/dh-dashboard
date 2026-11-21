import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import Checkbox from '@/src/components/core/checkbox/Checkbox'
import InputText from '@/src/components/core/input/InputText'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useWarehouseService } from '@/src/services/use-warehouse-service'
import { IWarehouse } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { WAREHOUSE_VALIDATION } from '@/src/validations/inventory/warehouse'
import { selectAuthUser } from '@/src/state/user/authSlice'

type WarehouseModalData = { warehouse?: IWarehouse } | null

const WarehouseModal = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const showError = useErrorToast()
  const { data } = useAppSelector(selectModal)
  const { user } = useAppSelector(selectAuthUser)
  const warehouse = (data as WarehouseModalData)?.warehouse
  const { createWarehouse, updateWarehouse } = useWarehouseService()
  const dispatch = useAppDispatch()
  const { afterWarehouseChange } = useRefreshData()
  const methods = useForm<FieldValues>({ resolver: WAREHOUSE_VALIDATION as unknown as Resolver<FieldValues>, defaultValues: { name: warehouse?.name || '', isDefault: { checked: warehouse?.isDefault || false } } })

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      if (warehouse) {
        await updateWarehouse(warehouse.warehouseId, { name: values.name, isDefault: !!values.isDefault?.checked })
      } else {
        await createWarehouse({ name: values.name, companyId: user?.companyId, isDefault: !!values.isDefault?.checked })
      }

      afterWarehouseChange()
      dispatch(removeModal())
    } catch (error) {
      showError(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <Heading
        text={warehouse ? t('warehouse:warehouseModal.editTitle') : t('warehouse:warehouseModal.addTitle')}
        variant="2"
        size="base"
        color="grey"
      />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 mt-6">
        <InputText
          isRequired
          name="name"
          initValue={warehouse?.name}
          label={t('warehouse:warehouseModal.name')}
          placeholder={t('warehouse:warehouseModal.namePlh')}
        />

        {/* the default one can not be unchecked, another warehouse has to become the default instead */}
        <Checkbox
          name="isDefault"
          initValue={warehouse?.isDefault}
          disabled={warehouse?.isDefault}
          label={t('warehouse:warehouseModal.isDefault')}
        />

        <div className="flex justify-center">
          <MainButton text={t('g:button.submit')} variant="contained" size="medium" htmlType="submit" />
        </div>
      </form>
    </FormProvider>
  )
}

export default WarehouseModal
