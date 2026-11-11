import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useWarehousesQuery } from '@/src/hooks/queries/use-warehouse-queries'
import { useRoles } from '@/src/hooks/use-roles'
import { IWarehouse } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import CardSkeleton from '@/src/components/skeleton/CardSkeleton'
import WarehouseCard from '@/src/modules/warehouses/WarehouseCard'

const NO_WAREHOUSES: IWarehouse[] = []

const Warehouses = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  // the warehouses come with the number of their drinks and the value of the stock;
  // the drinks themselves are loaded a page at a time inside each card
  const warehousesQuery = useWarehousesQuery()
  const warehouses = warehousesQuery.data ?? NO_WAREHOUSES
  const isLoad = !warehousesQuery.isPending

  const handleAddWarehouse = () => dispatch(openModal({ modal: ModalEnums.WAREHOUSE }))

  return (
    <div className="pb-8">
      {isAdmin && (
        <div className="flex justify-end">
          <MainButton text={t('warehouse:addWarehouse')} variant="contained" size="medium" onClick={handleAddWarehouse} />
        </div>
      )}

      {!isLoad && (
        <>
          <CardSkeleton />
          <CardSkeleton />
        </>
      )}

      {isLoad && !warehouses.length && <Paragraph text={t('warehouse:empty')} size="sm" className="mt-6" />}

      {warehouses.map((warehouse) => (
        <WarehouseCard key={warehouse.warehouseId} warehouse={warehouse} />
      ))}
    </div>
  )
}

export default Warehouses
