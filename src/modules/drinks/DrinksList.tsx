import { useTranslation } from 'react-i18next'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import DrinkRow from '@/src/components/drinks/DrinkRow'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { ModalEnums } from '@/src/enum'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useDrinkService } from '@/src/services/use-drink-service'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'

type Props = {
  drinks: IDrink[]
  warehouses: IWarehouse[]
}

const DrinksList = ({ drinks, warehouses }: Props) => {
  const { t } = useTranslation(['drink', 'warehouse', 'g'])
  const showError = useErrorToast()
  const { deleteDrink } = useDrinkService()
  const { afterDrinkChange } = useRefreshData()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()

  const warehouseName = (id: number) => warehouses.find((w) => w.warehouseId === id)?.name || ''

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
        <div className="grid grid-cols-6">
          <Heading text={t('drink:table.code')} variant="2" size="sm" color="grey" weight="medium" />
          <div className="col-span-2">
            <Heading text={t('drink:table.name')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
          <Heading text={t('drink:table.warehouse')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('drink:table.price')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('drink:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
        </div>
      </div>

      {drinks.map((drink) => (
        <DrinkRow
          key={drink.drinkId}
          drink={drink}
          warehouseName={warehouseName(drink.warehouseId)}
          dropdownOptions={isAdmin ? options(drink) : []}
        />
      ))}
    </div>
  )
}

export default DrinksList
