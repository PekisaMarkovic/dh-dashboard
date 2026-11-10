import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useDrinkService } from '@/src/services/use-drink-service'
import { useWarehouseService } from '@/src/services/use-warehouse-service'
import { useRoles } from '@/src/hooks/use-roles'
import { IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, selectModal } from '@/src/state/shared/modal'
import WarehouseCard from '@/src/modules/warehouses/WarehouseCard'

const Warehouses = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const showError = useErrorToast()
  const { getWarehouses } = useWarehouseService()
  const { getDrinks } = useDrinkService()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const { refreshKey } = useAppSelector(selectModal)
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  const [drinks, setDrinks] = useState<IDrink[]>([])
  const [isLoad, setIsLoad] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [warehousesList, drinksList] = await Promise.all([getWarehouses(), getDrinks()])

      setWarehouses(warehousesList)
      setDrinks(drinksList)
    } catch (error) {
      showError(error)
    } finally {
      setIsLoad(true)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [refreshKey])

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

      {isLoad && !warehouses.length && <Paragraph text={t('warehouse:empty')} size="sm" className="mt-6" />}

      {warehouses.map((warehouse) => (
        <WarehouseCard key={warehouse.warehouseId} warehouse={warehouse} drinks={drinks.filter((d) => d.warehouseId === warehouse.warehouseId)} />
      ))}
    </div>
  )
}

export default Warehouses
