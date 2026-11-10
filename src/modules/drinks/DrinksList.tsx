import { useTranslation } from 'react-i18next'
import DrinkApis from '@/src/api/drinks'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { ModalEnums } from '@/src/enum'
import { useApi } from '@/src/hooks/use-api'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, refresh } from '@/src/state/shared/modal'

type Props = {
  drinks: IDrink[]
  warehouses: IWarehouse[]
}

const DrinksList = ({ drinks, warehouses }: Props) => {
  const { t } = useTranslation(['drink', 'warehouse', 'g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()

  const warehouseName = (id: number) => warehouses.find((w) => w.warehouseId === id)?.name || ''

  const handleDelete = (drink: IDrink) => {
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('warehouse:deleteDrinkTitle'),
          message: t('warehouse:deleteDrinkConfirm', { name: drink.name }),
          confirmText: t('g:button.delete'),
          onConfirm: async () => {
            try {
              await api.delete(DrinkApis.deleteDrink(drink.drinkId))
              dispatch(refresh())
            } catch {
              customToast.error(t('g:errorMessage'))
            }
          },
        } satisfies ConfirmModalData,
      }),
    )
  }

  const options = (drink: IDrink): CustomDropdown[] => [
    {
      content: {
        type: 'button',
        text: t('g:button.edit'),
        onClick: () => dispatch(openModal({ modal: ModalEnums.DRINK, data: { drink, warehouseId: drink.warehouseId } })),
      },
    },
    { content: { type: 'button', text: t('g:button.delete'), onClick: () => handleDelete(drink) }, textColor: 'red' },
  ]

  return (
    <div>
      <div className="border-b-1 border-b-light-grey-alt border-solid px-4 pb-3 pt-2">
        <div className="grid grid-cols-5">
          <div className="col-span-2">
            <Heading text={t('drink:table.name')} variant="2" size="sm" color="grey" weight="medium" />
          </div>
          <Heading text={t('drink:table.warehouse')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('drink:table.price')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('drink:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
        </div>
      </div>

      {drinks.map((drink) => (
        <DefaultTableRowContainer key={drink.drinkId} cols={5} dropdownOptions={isAdmin ? options(drink) : []}>
          <div className="col-span-2 py-3">
            <Paragraph text={drink.name} size="sm" color="black" />
          </div>
          <div className="py-3">
            <Paragraph text={warehouseName(drink.warehouseId)} size="sm" color="black" />
          </div>
          <div className="py-3">
            <Paragraph text={drink.price.toFixed(2)} size="sm" color="black" noWrap />
          </div>
          <div className="py-3">
            <Paragraph
              text={drink.quantity === 0 ? t('drink:lowStock') : `${drink.quantity}`}
              size="sm"
              color={drink.quantity === 0 ? 'red' : 'black'}
              noWrap
            />
          </div>
        </DefaultTableRowContainer>
      ))}
    </div>
  )
}

export default DrinksList
