import { useEffect, useState } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DrinkApis from '@/src/api/drinks'
import WarehouseApis from '@/src/api/warehouses'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import { useApi } from '@/src/hooks/use-api'
import { IDrink, IWarehouse, SelectOption } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { refresh, removeModal, selectModal } from '@/src/state/shared/modal'
import { DRINK_VALIDATION } from '@/src/validations/inventory/drink'

const toOption = (w: IWarehouse): SelectOption => ({ id: String(w.warehouseId), name: w.name, value: String(w.warehouseId) })

type DrinkModalData = { warehouseId?: number; drink?: IDrink } | null

const DrinkModal = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const { data } = useAppSelector(selectModal)
  const { warehouseId: presetWarehouseId, drink } = (data as DrinkModalData) || {}
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  // the warehouse can be picked only when adding a drink and none was preselected
  const needsWarehouse = !drink && !presetWarehouseId
  const api = useApi()
  const dispatch = useAppDispatch()
  const methods = useForm<FieldValues>({
    resolver: DRINK_VALIDATION as unknown as Resolver<FieldValues>,
    defaultValues: {
      name: drink?.name || '',
      price: drink ? String(drink.price) : '',
      quantity: drink ? String(drink.quantity) : '',
      warehouse: undefined,
    },
  })

  useEffect(() => {
    if (!needsWarehouse) return

    api
      .get<IWarehouse[]>(WarehouseApis.getWarehouses())
      .then(({ data: list }) => {
        setWarehouses(list)
        if (list.length) methods.setValue('warehouse', toOption(list[0]))
      })
      .catch(() => customToast.error(t('g:errorMessage')))
  }, [])

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const body = { name: values.name, price: Number(values.price), quantity: Number(values.quantity) }

    try {
      if (drink) {
        await api.patch(DrinkApis.patchDrink(drink.drinkId), body)
      } else {
        await api.post(DrinkApis.createDrink(), { ...body, warehouseId: Number(values.warehouse?.value || presetWarehouseId) })
      }

      dispatch(refresh())
      dispatch(removeModal())
    } catch {
      customToast.error(t('g:errorMessage'))
    }
  }

  return (
    <FormProvider {...methods}>
      <Heading text={drink ? t('warehouse:drinkModal.editTitle') : t('warehouse:drinkModal.addTitle')} variant="2" size="base" color="grey" />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 mt-6">
        {needsWarehouse && (
          <SingleSelect
            isRequired
            name="warehouse"
            label={t('warehouse:drinkModal.warehouse')}
            placeholder={t('warehouse:drinkModal.warehousePlh')}
            options={warehouses.map(toOption)}
          />
        )}

        <InputText
          isRequired
          name="name"
          initValue={drink?.name}
          label={t('warehouse:drinkModal.name')}
          placeholder={t('warehouse:drinkModal.namePlh')}
        />

        <InputText
          isRequired
          name="price"
          initValue={drink ? String(drink.price) : undefined}
          label={t('warehouse:drinkModal.price')}
          placeholder={t('warehouse:drinkModal.pricePlh')}
        />

        <InputText
          isRequired
          name="quantity"
          initValue={drink ? String(drink.quantity) : undefined}
          label={t('warehouse:drinkModal.quantity')}
          placeholder={t('warehouse:drinkModal.quantityPlh')}
        />

        <div className="flex justify-center">
          <MainButton text={t('g:button.submit')} variant="contained" size="medium" htmlType="submit" />
        </div>
      </form>
    </FormProvider>
  )
}

export default DrinkModal
