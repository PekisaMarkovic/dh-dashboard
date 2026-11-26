import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import OrderRow from '@/src/components/orders/OrderRow'
import DataSection from '@/src/components/section/DataSection'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import { ModalEnums } from '@/src/enum'
import customToast from '@/src/components/core/toast/CustomToast'
import { useOrdersQuery } from '@/src/hooks/queries/use-order-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { usePageState } from '@/src/hooks/use-page-state'
import { Color, CustomDropdown, IOrder, OrderStatus } from '@/src/interfaces'
import { useOrderService } from '@/src/services/use-order-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { ORDER_STATUSES } from '@/src/utils/order-status'

const NO_ORDERS: IOrder[] = []
// the statuses that have a shortcut in the menu of a row (cancelling has its own, it asks for the reason)
const SHORTCUT_STATUSES: OrderStatus[] = ['in_progress', 'delivered']
// the same colors as the status in the table: in progress yellowish orange, delivered green
const SHORTCUT_COLOR: Record<string, Color> = { in_progress: 'dark-orange', delivered: 'green' }

// The orders from the website of the company, the newest first; a click shows the drinks and moves the order on
const Orders = () => {
  const { t } = useTranslation(['order', 'g'])
  const dispatch = useAppDispatch()
  const showError = useErrorToast()
  const { updateOrderStatus } = useOrderService()
  const { afterOrderChange } = useRefreshData()
  const filterForm = useForm()
  // the select is cleared by picking the selected option again, which means: every status
  const selectedStatus = useWatch({ control: filterForm.control, name: 'status' })
  const status: OrderStatus | undefined = selectedStatus?.value || undefined
  const [page, setPage] = usePageState([status])
  // every page is cached: the page before stays visible while the next one loads
  const { data, isPending } = useOrdersQuery({ page, status })
  const orders = data?.items ?? NO_ORDERS

  const handleOpen = (order: IOrder) => () => dispatch(openModal({ modal: ModalEnums.ORDER_DETAIL, data: { orderId: order.orderId } }))

  const handleCancel = (order: IOrder) => () => dispatch(openModal({ modal: ModalEnums.ORDER_CANCEL, data: { orderId: order.orderId } }))

  // in progress / delivered right from the list, without opening the order (no email for these)
  const handleStatus = (order: IOrder, next: OrderStatus) => async () => {
    try {
      await updateOrderStatus(order.orderId, next)
      await afterOrderChange()
      customToast.success(t('order:statusChanged', { number: order.orderId, status: t(`order:status.${next}`) }))
    } catch (error) {
      showError(error)
    }
  }

  // open; the shortcuts to the statuses the order is not in yet; cancel while it is not cancelled or delivered
  const options = (order: IOrder): CustomDropdown[] => [
    { content: { type: 'button', text: t('order:open'), onClick: handleOpen(order) } },
    ...SHORTCUT_STATUSES.filter((next) => next !== order.status).map(
      (next) =>
        ({
          content: { type: 'button', text: t(`order:status.${next}`), onClick: handleStatus(order, next) },
          textColor: SHORTCUT_COLOR[next],
        }) satisfies CustomDropdown,
    ),
    ...(order.status === 'new' || order.status === 'in_progress'
      ? [{ content: { type: 'button', text: t('order:action.cancelled'), onClick: handleCancel(order) }, textColor: 'red' } satisfies CustomDropdown]
      : []),
  ]

  return (
    <DataSection title={t('order:title')} subtitle={t('order:subtitle')}>
      <FormProvider {...filterForm}>
        <div className="w-full sm:w-64 mb-6">
          <SingleSelect
            name="status"
            label={t('order:filterStatus')}
            placeholder={t('order:allStatuses')}
            options={ORDER_STATUSES.map((s) => ({ id: s, name: t(`order:status.${s}`), value: s }))}
          />
        </div>
      </FormProvider>

      {isPending ? (
        <TableSkeleton columns={[0.5, 1, 1, 1, 1, 1]} rows={8} />
      ) : orders.length ? (
        <div>
          <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
            <div className="grid grid-cols-6">
              <Heading text={t('order:table.number')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('order:table.buyer')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('order:table.pickupDate')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('order:table.createdAt')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('order:table.total')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('order:table.status')} variant="2" size="sm" color="grey" weight="medium" />
            </div>
          </div>

          {orders.map((order) => (
            <OrderRow key={order.orderId} order={order} onClick={handleOpen(order)} dropdownOptions={options(order)} />
          ))}
        </div>
      ) : (
        <Paragraph text={t('order:empty')} size="sm" />
      )}
      {!isPending && <ListPagination page={page} totalPages={data?.meta.totalPages ?? 1} onPageChange={setPage} />}
    </DataSection>
  )
}

export default Orders
