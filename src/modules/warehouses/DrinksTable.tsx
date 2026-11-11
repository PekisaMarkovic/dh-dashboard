import { useTranslation } from 'react-i18next'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePageState } from '@/src/hooks/use-page-state'
import { useDrinksQuery } from '@/src/hooks/queries/use-drink-queries'
import Heading from '@/src/components/core/typography/Heading'
import WarehouseDrinkRow from '@/src/components/warehouses/WarehouseDrinkRow'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { ModalEnums } from '@/src/enum'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useDrinkService } from '@/src/services/use-drink-service'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, IDrink } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'

type Props = {
  warehouseId: number
}

const NO_DRINKS: IDrink[] = []

const DrinksTable = ({ warehouseId }: Props) => {
  const { t } = useTranslation(['warehouse', 'g'])
  const showError = useErrorToast()
  const { deleteDrink } = useDrinkService()
  const { afterDrinkChange } = useRefreshData()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const [page, setPage] = usePageState([warehouseId])
  // one page of the drinks of this warehouse, every page is cached
  const { data } = useDrinksQuery({ page, warehouseId })
  const drinks = data?.items ?? NO_DRINKS

  const handleEdit = (drink: IDrink) => () => dispatch(openModal({ modal: ModalEnums.DRINK, data: { drink, warehouseId: drink.warehouseId } }))

  const handleDelete = (drink: IDrink) => () => {
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('warehouse:deleteDrinkTitle'),
          message: t('warehouse:deleteDrinkConfirm', { name: drink.name }),
          confirmText: t('g:button.delete'),
          onConfirm: async () => {
            try {
              await deleteDrink(drink.drinkId)
              await afterDrinkChange()
            } catch (error) {
              showError(error)
            }
          },
        } satisfies ConfirmModalData,
      }),
    )
  }

  const options = (drink: IDrink): CustomDropdown[] => [
    { content: { type: 'button', text: t('g:button.edit'), onClick: handleEdit(drink) } },
    { content: { type: 'button', text: t('g:button.delete'), onClick: handleDelete(drink) }, textColor: 'red' },
  ]

  return (
    <div>
      <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
        <div className="grid grid-cols-5">
          <Heading text={t('warehouse:table.code')} variant="2" size="sm" color="grey" weight="medium" />
          <div className="col-span-2">
            <Heading text={t('warehouse:table.name')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
          <Heading text={t('warehouse:table.price')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('warehouse:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
        </div>
      </div>

      {drinks.map((drink) => (
        <WarehouseDrinkRow key={drink.drinkId} drink={drink} dropdownOptions={isAdmin ? options(drink) : []} />
      ))}

      <ListPagination page={page} totalPages={data?.meta.totalPages ?? 1} onPageChange={setPage} />
    </div>
  )
}

export default DrinksTable
