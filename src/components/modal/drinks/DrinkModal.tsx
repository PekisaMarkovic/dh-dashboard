import { useEffect, useRef, useState } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import CategoryTag from '@/src/components/drinks/CategoryTag'
import DrinkImage from '@/src/components/drinks/DrinkImage'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import InputTextarea from '@/src/components/core/input/InputTextarea'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import { useWarehousesQuery } from '@/src/hooks/queries/use-warehouse-queries'
import { useCategoriesQuery } from '@/src/hooks/queries/use-category-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useDrinkService } from '@/src/services/use-drink-service'
import { ICategory, IDrink, IWarehouse, SelectOption } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { formatPrice, parsePriceInput } from '@/src/utils/money'
import { DRINK_VALIDATION } from '@/src/validations/inventory/drink'
import ErrorMessage from '@/src/components/core/typography/ErrorMessage'
import FieldTitle from '@/src/components/core/typography/FieldTitle'
import Paragraph from '@/src/components/core/typography/Paragraph'

const NO_WAREHOUSES: IWarehouse[] = []
const NO_CATEGORIES: ICategory[] = []

// the same numbers as the api (storage.constants.ts): the api never keeps an image bigger than this
const IMAGE_RECOMMENDED_SIZE = '1200 x 1200'
const IMAGE_MAX_MB = 5
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

// the same as the api (DRINK_DESCRIPTION_MAX): a short text for the detail of the drink on the site
const DESCRIPTION_MAX = 150

const toOption = (w: IWarehouse): SelectOption => ({ id: String(w.warehouseId), name: w.name, value: String(w.warehouseId) })

type DrinkModalData = { warehouseId?: number; drink?: IDrink } | null

const DrinkModal = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const showError = useErrorToast()
  const { data } = useAppSelector(selectModal)
  const { warehouseId: presetWarehouseId, drink } = (data as DrinkModalData) || {}
  // the warehouse can be picked only when adding a drink and none was preselected
  const needsWarehouse = !drink && !presetWarehouseId
  const { createDrink, updateDrink, uploadDrinkImage, deleteDrinkImage } = useDrinkService()
  const dispatch = useAppDispatch()
  const { afterDrinkChange } = useRefreshData()
  const imageInput = useRef<HTMLInputElement>(null)
  // a picked file is sent after the drink is saved; removeImage deletes the image the drink already has
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const [preview, setPreview] = useState('')
  // the categories of the drink, a click on a chip puts it in or takes it out
  const [categoryIds, setCategoryIds] = useState<number[]>(() => drink?.categories?.map((c) => c.categoryId) ?? [])
  const categories = useCategoriesQuery().data ?? NO_CATEGORIES
  const shownImage = preview || (removeImage ? '' : drink?.image?.url || '')
  const methods = useForm<FieldValues>({
    resolver: DRINK_VALIDATION as unknown as Resolver<FieldValues>,
    defaultValues: {
      code: drink?.code || '',
      name: drink?.name || '',
      description: drink?.description || '',
      price: drink ? formatPrice(drink.price) : '',
      quantity: drink ? String(drink.quantity) : '',
      warningQuantity: String(drink?.warningQuantity ?? 0),
      criticalQuantity: String(drink?.criticalQuantity ?? 0),
      warehouse: undefined,
    },
  })

  // the warehouses come from the cache, the default one is picked at the start
  const warehouses = useWarehousesQuery().data ?? NO_WAREHOUSES

  useEffect(() => {
    if (needsWarehouse && warehouses.length && !methods.getValues('warehouse')?.value) {
      methods.setValue('warehouse', toOption(warehouses.find((w) => w.isDefault) ?? warehouses[0]))
    }
  }, [warehouses, needsWarehouse])

  useEffect(() => {
    if (!imageFile) {
      setPreview('')

      return
    }

    const url = URL.createObjectURL(imageFile)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (!IMAGE_ACCEPT.split(',').includes(file.type)) {
      setImageError(t('warehouse:drinkModal.imageNotImage'))

      return
    }

    if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
      setImageError(t('warehouse:drinkModal.imageTooBig', { maxMb: IMAGE_MAX_MB }))

      return
    }

    setImageError('')
    setImageFile(file)
    setRemoveImage(false)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setRemoveImage(true)
    setImageError('')
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const body = {
      code: values.code.trim(),
      name: values.name,
      // empty removes the description
      description: values.description?.trim() ?? '',
      price: parsePriceInput(values.price) ?? 0,
      quantity: Number(values.quantity),
      warningQuantity: Number(values.warningQuantity),
      criticalQuantity: Number(values.criticalQuantity),
      categoryIds,
    }

    try {
      const saved = drink
        ? await updateDrink(drink.drinkId, body)
        : await createDrink({ ...body, warehouseId: Number(values.warehouse?.value || presetWarehouseId) })
      const drinkId: number = saved?.drinkId ?? drink?.drinkId

      if (imageFile) {
        await uploadDrinkImage(drinkId, imageFile)
      } else if (removeImage && drink?.image) {
        await deleteDrinkImage(drinkId)
      }

      afterDrinkChange()
      dispatch(removeModal())
    } catch (error) {
      showError(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-[480px] max-w-full">
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

          <InputTextarea
            name="description"
            initValue={drink?.description ?? ''}
            label={t('warehouse:drinkModal.description')}
            placeholder={t('warehouse:drinkModal.descriptionPlh')}
            rows={3}
            maxChar={DESCRIPTION_MAX}
          />

          {/* short numbers: two per row */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex flex-col gap-y-2">
            <FieldTitle text={t('warehouse:drinkModal.categories')} />
            {categories.length ? (
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => {
                  const isOn = categoryIds.includes(category.categoryId)

                  return (
                    <CategoryTag
                      key={category.categoryId}
                      name={category.name}
                      isOn={isOn}
                      onClick={() => setCategoryIds((ids) => (isOn ? ids.filter((id) => id !== category.categoryId) : [...ids, category.categoryId]))}
                    />
                  )
                })}
              </div>
            ) : (
              <Paragraph text={t('warehouse:drinkModal.noCategories')} color="dark-grey" />
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <FieldTitle text={t('warehouse:drinkModal.image')} />
            <div className="flex items-start gap-x-4">
              <DrinkImage size="lg" src={shownImage} alt={(!preview && drink?.image?.altText) || drink?.name || ''} />
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-2">
                  <MainButton
                    text={shownImage ? t('warehouse:drinkModal.imageChange') : t('warehouse:drinkModal.imageChoose')}
                    variant="outlined"
                    size="small"
                    htmlType="button"
                    onClick={() => imageInput.current?.click()}
                  />
                  {shownImage && (
                    <MainButton text={t('warehouse:drinkModal.imageRemove')} variant="outlined" size="small" htmlType="button" onClick={handleRemoveImage} />
                  )}
                </div>
                <Paragraph text={t('warehouse:drinkModal.imageHint', { size: IMAGE_RECOMMENDED_SIZE, maxMb: IMAGE_MAX_MB })} color="dark-grey" />
                {imageError && <ErrorMessage message={imageError} />}
              </div>
            </div>
            <input ref={imageInput} type="file" accept={IMAGE_ACCEPT} onChange={handleImage} className="hidden" />
          </div>

          <div className="flex justify-center">
            <MainButton text={t('g:button.submit')} variant="contained" size="medium" htmlType="submit" />
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default DrinkModal
