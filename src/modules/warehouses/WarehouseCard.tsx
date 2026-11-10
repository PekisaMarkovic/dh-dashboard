import axios from 'axios'
import { useTranslation } from 'react-i18next'
import WarehouseApis from '@/src/api/warehouses'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DataSection from '@/src/components/section/DataSection'
import { ModalEnums } from '@/src/enum'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { useApi } from '@/src/hooks/use-api'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, refresh } from '@/src/state/shared/modal'
import DrinksTable from '@/src/modules/warehouses/DrinksTable'

type Props = {
  warehouse: IWarehouse
  drinks: IDrink[]
}

const WarehouseCard = ({ warehouse, drinks }: Props) => {
  const { t } = useTranslation(['warehouse', 'g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()

  const totalValue = drinks.reduce((sum, drink) => sum + drink.price * drink.quantity, 0)

  const deleteWarehouse = async () => {
    try {
      await api.delete(WarehouseApis.deleteWarehouse(warehouse.warehouseId))
      dispatch(refresh())
    } catch (e) {
      // 409: somebody added a drink in the meantime
      customToast.error(axios.isAxiosError(e) && e.response?.status === 409 ? t('warehouse:notEmptyTitle') : t('g:errorMessage'))
      dispatch(refresh())
    }
  }

  const handleDelete = () => {
    // a warehouse must be emptied first, so only explain why it can not be deleted yet
    if (drinks.length) {
      dispatch(
        openModal({
          modal: ModalEnums.CONFIRM,
          data: { title: t('warehouse:notEmptyTitle'), message: t('warehouse:notEmptyMessage', { count: drinks.length }) } satisfies ConfirmModalData,
        }),
      )
      return
    }

    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('warehouse:deleteWarehouseTitle'),
          message: t('warehouse:deleteWarehouseConfirm', { name: warehouse.name }),
          confirmText: t('g:button.delete'),
          onConfirm: deleteWarehouse,
        } satisfies ConfirmModalData,
      }),
    )
  }

  const options: CustomDropdown[] = [
    {
      content: { type: 'button', text: t('g:button.edit'), onClick: () => dispatch(openModal({ modal: ModalEnums.WAREHOUSE, data: { warehouse } })) },
    },
    { content: { type: 'button', text: t('g:button.delete'), onClick: handleDelete }, textColor: 'red' },
  ]

  return (
    <DataSection
      title={warehouse.name}
      subtitle={t('warehouse:totalValue', { value: totalValue.toFixed(2) })}
      dropdownOptions={isAdmin ? options : []}
      element={
        isAdmin ? (
          <div className="mb-6 mr-8">
            <MainButton
              text={t('warehouse:addDrink')}
              variant="outlined"
              size="small"
              onClick={() => dispatch(openModal({ modal: ModalEnums.DRINK, data: { warehouseId: warehouse.warehouseId } }))}
            />
          </div>
        ) : undefined
      }
    >
      {drinks.length ? <DrinksTable drinks={drinks} /> : <Paragraph text={t('warehouse:noDrinks')} size="sm" />}
    </DataSection>
  )
}

export default WarehouseCard
