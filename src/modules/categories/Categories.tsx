import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CategoryRow from '@/src/components/categories/CategoryRow'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import { ModalEnums } from '@/src/enum'
import { useCategoriesQuery } from '@/src/hooks/queries/use-category-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, ICategory } from '@/src/interfaces'
import { useCategoryService } from '@/src/services/use-category-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'

const NO_CATEGORIES: ICategory[] = []

// The categories of drinks of the company. A drink is put in categories in its own form
const Categories = () => {
  const { t } = useTranslation(['drink', 'g'])
  const showError = useErrorToast()
  const { deleteCategory } = useCategoryService()
  const { afterCategoryChange } = useRefreshData()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const filterForm = useForm()
  // all the categories come at once (a company has a few dozen), so the search is done here
  const search = (useWatch({ control: filterForm.control, name: 'search' }) || '').trim().toLocaleLowerCase()
  const { data, isPending } = useCategoriesQuery()
  const categories = (data ?? NO_CATEGORIES).filter((c) => c.name.toLocaleLowerCase().includes(search))

  const handleAdd = () => dispatch(openModal({ modal: ModalEnums.CATEGORY }))

  const handleEdit = (category: ICategory) => () => dispatch(openModal({ modal: ModalEnums.CATEGORY, data: { category } }))

  const handleDelete = (category: ICategory) => () => {
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('drink:categories.deleteTitle'),
          message: t('drink:categories.deleteConfirm', { name: category.name, count: category.drinksCount ?? 0 }),
          confirmText: t('g:button.delete'),
          onConfirm: async () => {
            try {
              await deleteCategory(category.categoryId)
              await afterCategoryChange()
            } catch (error) {
              showError(error)
            }
          },
        } satisfies ConfirmModalData,
      }),
    )
  }

  const options = (category: ICategory): CustomDropdown[] => [
    { content: { type: 'button', text: t('g:button.edit'), onClick: handleEdit(category) } },
    { content: { type: 'button', text: t('g:button.delete'), onClick: handleDelete(category) }, textColor: 'red' },
  ]

  return (
    <div className="pb-8">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <FormProvider {...filterForm}>
          <div className="w-full sm:w-72">
            <InputText name="search" label={t('g:search')} placeholder={t('drink:categories.search')} />
          </div>
        </FormProvider>

        {isAdmin && (
          <div className="ml-auto">
            <MainButton text={t('drink:categories.add')} variant="contained" size="medium" onClick={handleAdd} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6">
        {isPending ? (
          <TableSkeleton columns={[2, 1]} rows={8} />
        ) : categories.length ? (
          <div>
            <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <Heading text={t('drink:categories.table.name')} variant="2" size="sm" color="grey" weight="medium" />
                </div>
                <Heading text={t('drink:categories.table.drinks')} variant="2" size="sm" color="grey" weight="medium" />
              </div>
            </div>

            {categories.map((category) => (
              <CategoryRow key={category.categoryId} category={category} dropdownOptions={isAdmin ? options(category) : []} />
            ))}
          </div>
        ) : (
          <Paragraph text={t('drink:categories.empty')} size="sm" />
        )}
      </div>
    </div>
  )
}

export default Categories
