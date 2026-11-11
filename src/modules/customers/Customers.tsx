import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import CustomerRow from '@/src/components/customers/CustomerRow'
import { ModalEnums } from '@/src/enum'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useDebouncedValue } from '@/src/hooks/use-debounced-value'
import { usePageState } from '@/src/hooks/use-page-state'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, ICustomer } from '@/src/interfaces'
import { useCustomersQuery } from '@/src/hooks/queries/use-customer-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useCustomerService } from '@/src/services/use-customer-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'

const NO_CUSTOMERS: ICustomer[] = []

const Customers = () => {
  const { t } = useTranslation(['customer', 'g'])
  const showError = useErrorToast()
  const { deleteCustomer } = useCustomerService()
  const { afterCustomerChange } = useRefreshData()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const filterForm = useForm()
  // the search waits for a pause in typing, then the api returns the matching page
  const search = useDebouncedValue((useWatch({ control: filterForm.control, name: 'search' }) || '').trim())
  const [page, setPage] = usePageState([search])
  // every page and search is cached: the page before stays visible while the next one loads
  const { data, isPending } = useCustomersQuery({ page, search })
  const customers = data?.items ?? NO_CUSTOMERS
  const isLoad = !isPending

  const handleAdd = () => dispatch(openModal({ modal: ModalEnums.CUSTOMER }))

  const handleEdit = (customer: ICustomer) => () => dispatch(openModal({ modal: ModalEnums.CUSTOMER, data: { customer } }))

  const handleDelete = (customer: ICustomer) => () => {
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('customer:deleteTitle'),
          message: t('customer:deleteConfirm', { name: customer.name }),
          confirmText: t('g:button.delete'),
          onConfirm: async () => {
            try {
              await deleteCustomer(customer.customerId)
              await afterCustomerChange()
            } catch (error) {
              showError(error)
            }
          },
        } satisfies ConfirmModalData,
      }),
    )
  }

  const options = (customer: ICustomer): CustomDropdown[] => [
    { content: { type: 'button', text: t('g:button.edit'), onClick: handleEdit(customer) } },
    { content: { type: 'button', text: t('g:button.delete'), onClick: handleDelete(customer) }, textColor: 'red' },
  ]

  return (
    <div className="pb-8">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <FormProvider {...filterForm}>
          <div className="w-full sm:w-72">
            <InputText name="search" label={t('g:search')} placeholder={t('customer:search')} />
          </div>
        </FormProvider>

        {isAdmin && (
          <div className="ml-auto">
            <MainButton text={t('customer:add')} variant="contained" size="medium" onClick={handleAdd} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6">
        {!isLoad ? (
          <TableSkeleton columns={[2, 1]} rows={8} />
        ) : customers.length ? (
          <div>
            <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <Heading text={t('customer:table.name')} variant="2" size="sm" color="grey" weight="medium" />
                </div>
                <Heading text={t('customer:table.createdAt')} variant="2" size="sm" color="grey" weight="medium" />
              </div>
            </div>

            {customers.map((customer) => (
              <CustomerRow key={customer.customerId} customer={customer} dropdownOptions={isAdmin ? options(customer) : []} />
            ))}
          </div>
        ) : (
          <Paragraph text={t('customer:empty')} size="sm" />
        )}
        {isLoad && <ListPagination page={page} totalPages={data?.meta.totalPages ?? 1} onPageChange={setPage} />}
      </div>
    </div>
  )
}

export default Customers
