import { useEffect, useState } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import { useDrinkService } from '@/src/services/use-drink-service'
import { useWarehouseService } from '@/src/services/use-warehouse-service'
import { IDrink, IWarehouse, SelectOption } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { refresh, removeModal, selectModal } from '@/src/state/shared/modal'
import { formatPrice, parsePriceInput } from '@/src/utils/money'
import { DRINK_VALIDATION } from '@/src/validations/inventory/drink'

const toOption = (w: IWarehouse): SelectOption => ({ id: String(w.warehouseId), name: w.name, value: String(w.warehouseId) })

type DrinkModalData = { warehouseId?: number; drink?: IDrink } | null

const DrinkModal = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const showError = useErrorToast()
  const { data } = useAppSelector(selectModal)
  const { warehouseId: presetWarehouseId, drink } = (data as DrinkModalData) || {}
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  // the warehouse can be picked only when adding a drink and none was preselected
  const needsWarehouse = !drink && !presetWarehouseId
  const { getWarehouses } = useWarehouseService()
  const { createDrink, updateDrink } = useDrinkService()
  const dispatch = useAppDispatch()
  const methods = useForm<FieldValues>({
    resolver: DRINK_VALIDATION as unknown as Resolver<FieldValues>,
    defaultValues: {
      code: drink?.code || '',
      name: drink?.name || '',
      price: drink ? formatPrice(drink.price) : '',
      quantity: drink ? String(drink.quantity) : '',
      warningQuantity: String(drink?.warningQuantity ?? 0),
      criticalQuantity: String(drink?.criticalQuantity ?? 0),
      warehouse: undefined,
    },
  })

  useEffect(() => {
    if (!needsWarehouse) return

    const fetchWarehouses = async () => {
      try {
        const list = await getWarehouses()

        setWarehouses(list)
        if (list.length) methods.setValue('warehouse', toOption(list[0]))
      } catch (error) {
        showError(error)
      }
    }

    fetchWarehouses()
  }, [])

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const body = {
      code: values.code.trim(),
      name: values.name,
      price: parsePriceInput(values.price) ?? 0,
      quantity: Number(values.quantity),
      warningQuantity: Number(values.warningQuantity),
      criticalQuantity: Number(values.criticalQuantity),
    }

    try {
      if (drink) {
        await updateDrink(drink.drinkId, body)
      } else {
        await createDrink({ ...body, warehouseId: Number(values.warehouse?.value || presetWarehouseId) })
      }

      dispatch(refresh())
      dispatch(removeModal())
    } catch (error) {
      showError(error)
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
          name="code"
          initValue={drink?.code}
          label={t('warehouse:drinkModal.code')}
          placeholder={t('warehouse:drinkModal.codePlh')}
        />

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
          initValue={drink ? formatPrice(drink.price) : undefined}
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

        <InputText
          isRequired
          name="warningQuantity"
          initValue={String(drink?.warningQuantity ?? 0)}
          label={t('warehouse:drinkModal.warningQuantity')}
          placeholder={t('warehouse:drinkModal.warningQuantityPlh')}
        />

        <InputText
          isRequired
          name="criticalQuantity"
          initValue={String(drink?.criticalQuantity ?? 0)}
          label={t('warehouse:drinkModal.criticalQuantity')}
          placeholder={t('warehouse:drinkModal.criticalQuantityPlh')}
        />

        <div className="flex justify-center">
          <MainButton text={t('g:button.submit')} variant="contained" size="medium" htmlType="submit" />
        </div>
      </form>
    </FormProvider>
  )
}

export default DrinkModal
