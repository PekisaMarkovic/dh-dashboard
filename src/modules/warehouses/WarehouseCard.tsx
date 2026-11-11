import axios from 'axios'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DataSection from '@/src/components/section/DataSection'
import { ModalEnums } from '@/src/enum'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { formatCents, lineCents } from '@/src/utils/money'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useWarehouseService } from '@/src/services/use-warehouse-service'
import { useRoles } from '@/src/hooks/use-roles'
import { CustomDropdown, IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import DrinksTable from '@/src/modules/warehouses/DrinksTable'

type Props = {
  warehouse: IWarehouse
  drinks: IDrink[]
}

const WarehouseCard = ({ warehouse, drinks }: Props) => {
  const { t } = useTranslation(['warehouse', 'g'])
  const { deleteWarehouse: removeWarehouse } = useWarehouseService()
  const showError = useErrorToast()
  const dispatch = useAppDispatch()
  const { afterWarehouseChange } = useRefreshData()
  const { isAdmin } = useRoles()

  const totalValueCents = drinks.reduce((sum, drink) => sum + lineCents(drink.price, drink.quantity), 0)

  const deleteWarehouse = async () => {
    try {
      await removeWarehouse(warehouse.warehouseId)
      await afterWarehouseChange()
    } catch (error) {
      // 409: somebody added a drink in the meantime
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        customToast.error(t('warehouse:notEmptyTitle'))
      } else {
        showError(error)
      }

      await afterWarehouseChange()
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

  const handleEdit = () => dispatch(openModal({ modal: ModalEnums.WAREHOUSE, data: { warehouse } }))

  const handleAddDrink = () => dispatch(openModal({ modal: ModalEnums.DRINK, data: { warehouseId: warehouse.warehouseId } }))

  const options: CustomDropdown[] = [
    { content: { type: 'button', text: t('g:button.edit'), onClick: handleEdit } },
    { content: { type: 'button', text: t('g:button.delete'), onClick: handleDelete }, textColor: 'red' },
  ]

  return (
    <DataSection
      title={warehouse.name}
      subtitle={t('warehouse:totalValue', { value: formatCents(totalValueCents) })}
      dropdownOptions={isAdmin ? options : []}
      element={
        isAdmin ? (
          <div className="mb-6 mr-8">
            <MainButton text={t('warehouse:addDrink')} variant="outlined" size="small" onClick={handleAddDrink} />
          </div>
        ) : undefined
      }
    >
      {drinks.length ? <DrinksTable drinks={drinks} /> : <Paragraph text={t('warehouse:noDrinks')} size="sm" />}
    </DataSection>
  )
}

export default WarehouseCard
