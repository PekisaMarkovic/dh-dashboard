import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useDrinksQuery } from '@/src/hooks/queries/use-drink-queries'
import { useWarehousesQuery } from '@/src/hooks/queries/use-warehouse-queries'
import { useRoles } from '@/src/hooks/use-roles'
import { IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import CardSkeleton from '@/src/components/skeleton/CardSkeleton'
import WarehouseCard from '@/src/modules/warehouses/WarehouseCard'

const NO_WAREHOUSES: IWarehouse[] = []
const NO_DRINKS: IDrink[] = []

const Warehouses = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  // both lists are cached: a visit after the first one shows them right away
  const warehousesQuery = useWarehousesQuery()
  const drinksQuery = useDrinksQuery()
  const warehouses = warehousesQuery.data ?? NO_WAREHOUSES
  const drinks = drinksQuery.data ?? NO_DRINKS
  const isLoad = !warehousesQuery.isPending && !drinksQuery.isPending

  return (
    <div className="pb-8">
      {isAdmin && (
        <div className="flex justify-end">
          <MainButton
            text={t('warehouse:addWarehouse')}
            variant="contained"
            size="medium"
            onClick={() => dispatch(openModal({ modal: ModalEnums.WAREHOUSE }))}
          />
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
        <WarehouseCard key={warehouse.warehouseId} warehouse={warehouse} drinks={drinks.filter((d) => d.warehouseId === warehouse.warehouseId)} />
      ))}
    </div>
  )
}

export default Warehouses
