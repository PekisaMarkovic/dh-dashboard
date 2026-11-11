import { useTranslation } from 'react-i18next'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePagedList } from '@/src/hooks/use-paged-list'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { ModalEnums } from '@/src/enum'
import { formatPrice } from '@/src/utils/money'
import { getStockLevel, STOCK_ROW_CLASS, STOCK_TEXT_CLASS } from '@/src/utils/stock'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useDrinkService } from '@/src/services/use-drink-service'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, IDrink } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'

type Props = {
  drinks: IDrink[]
}

const DrinksTable = ({ drinks }: Props) => {
  const { t } = useTranslation(['warehouse', 'g'])
  const showError = useErrorToast()
  const { deleteDrink } = useDrinkService()
  const { afterDrinkChange } = useRefreshData()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const { pageItems, page, setPage, totalPages } = usePagedList(drinks)

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

      {pageItems.map((drink) => {
        const level = getStockLevel(drink)

        return (
          <DefaultTableRowContainer key={drink.drinkId} cols={5} className={STOCK_ROW_CLASS[level]} dropdownOptions={isAdmin ? options(drink) : []}>
            <TableCell label={t('warehouse:table.code')}>
              <Paragraph text={drink.code || '-'} size="sm" color="black" noWrap />
            </TableCell>
            <TableCell isTitle label={t('warehouse:table.name')} className="col-span-2 order-first md:order-none">
              <Paragraph text={drink.name} size="sm" color="black" />
            </TableCell>
            <TableCell label={t('warehouse:table.price')}>
              <Paragraph text={formatPrice(drink.price)} size="sm" color="black" noWrap />
            </TableCell>
            <TableCell label={t('warehouse:table.quantity')}>
              <p
                className={`font-poppins text-sm whitespace-nowrap ${level === 'ok' && drink.quantity === 0 ? 'text-red' : STOCK_TEXT_CLASS[level]}`}
              >
                {drink.quantity}
              </p>
            </TableCell>
          </DefaultTableRowContainer>
        )
      })}

      <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

export default DrinksTable
