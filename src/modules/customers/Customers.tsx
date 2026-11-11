import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import { ModalEnums } from '@/src/enum'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { usePagedList } from '@/src/hooks/use-paged-list'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, ICustomer } from '@/src/interfaces'
import { useCustomerService } from '@/src/services/use-customer-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, refresh, selectModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'

const Customers = () => {
  const { t } = useTranslation(['customer', 'g'])
  const showError = useErrorToast()
  const { getCustomers, deleteCustomer } = useCustomerService()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const { refreshKey } = useAppSelector(selectModal)
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [isLoad, setIsLoad] = useState(false)
  const filterForm = useForm()
  const search: string = useWatch({ control: filterForm.control, name: 'search' }) || ''

  const fetchCustomers = useCallback(async () => {
    try {
      setCustomers(await getCustomers())
    } catch (error) {
      showError(error)
    } finally {
      setIsLoad(true)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [refreshKey])

  const visible = useMemo(() => customers.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase())), [customers, search])
  const { pageItems, page, setPage, totalPages } = usePagedList(visible, [search])

  const handleDelete = (customer: ICustomer) => {
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
              dispatch(refresh())
            } catch (error) {
              showError(error)
            }
          },
        } satisfies ConfirmModalData,
      }),
    )
  }

  const options = (customer: ICustomer): CustomDropdown[] => [
    { content: { type: 'button', text: t('g:button.edit'), onClick: () => dispatch(openModal({ modal: ModalEnums.CUSTOMER, data: { customer } })) } },
    { content: { type: 'button', text: t('g:button.delete'), onClick: () => handleDelete(customer) }, textColor: 'red' },
  ]

  return (
    <div className="pb-8">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <FormProvider {...filterForm}>
          <div className="w-72">
            <InputText name="search" label={t('g:search')} placeholder={t('customer:search')} />
          </div>
        </FormProvider>

        {isAdmin && (
          <div className="ml-auto">
            <MainButton
              text={t('customer:add')}
              variant="contained"
              size="medium"
              onClick={() => dispatch(openModal({ modal: ModalEnums.CUSTOMER }))}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6">
        {!isLoad ? (
          <TableSkeleton columns={[2, 1]} rows={8} />
        ) : visible.length ? (
          <div>
            <div className="border-b-1 border-b-light-grey-alt border-solid px-4 pb-3 pt-2">
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <Heading text={t('customer:table.name')} variant="2" size="sm" color="grey" weight="medium" />
                </div>
                <Heading text={t('customer:table.createdAt')} variant="2" size="sm" color="grey" weight="medium" />
              </div>
            </div>

            {pageItems.map((customer) => (
              <DefaultTableRowContainer key={customer.customerId} cols={3} dropdownOptions={isAdmin ? options(customer) : []}>
                <div className="col-span-2 py-3">
                  <Paragraph text={customer.name} size="sm" color="black" />
                </div>
                <div className="py-3">
                  <Paragraph text={formatDate(customer.createdAt)} size="sm" color="black" noWrap />
                </div>
              </DefaultTableRowContainer>
            ))}
          </div>
        ) : (
          <Paragraph text={t('customer:empty')} size="sm" />
        )}
        {isLoad && <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </div>
  )
}

export default Customers
