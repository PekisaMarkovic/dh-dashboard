import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import Heading from '@/src/components/core/typography/Heading'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { ICategory } from '@/src/interfaces'
import { useCategoryService } from '@/src/services/use-category-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { CATEGORY_VALIDATION } from '@/src/validations/inventory/category'

type CategoryModalData = { category?: ICategory } | null

// add a category, or rename one
const CategoryModal = () => {
  const { t } = useTranslation(['drink', 'g'])
  const showError = useErrorToast()
  const { data } = useAppSelector(selectModal)
  const category = (data as CategoryModalData)?.category
  const { createCategory, renameCategory } = useCategoryService()
  const dispatch = useAppDispatch()
  const { afterCategoryChange } = useRefreshData()
  const methods = useForm<FieldValues>({
    resolver: CATEGORY_VALIDATION as unknown as Resolver<FieldValues>,
    defaultValues: { name: category?.name || '' },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      const name = values.name.trim()

      if (category) {
        await renameCategory(category.categoryId, name)
      } else {
        await createCategory(name)
      }

      afterCategoryChange()
      dispatch(removeModal())
    } catch (error) {
      showError(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-[480px] max-w-full">
        <Heading text={category ? t('drink:categories.editTitle') : t('drink:categories.addTitle')} variant="2" size="base" color="grey" />
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 mt-6">
          <InputText isRequired name="name" initValue={category?.name} label={t('drink:categories.name')} placeholder={t('drink:categories.namePlh')} />

          <div className="flex justify-center">
            <MainButton text={t('g:button.submit')} variant="contained" size="medium" htmlType="submit" />
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default CategoryModal
