import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DrinkApis from '@/src/api/drinks'
import WarehouseApis from '@/src/api/warehouses'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useApi } from '@/src/hooks/use-api'
import { useRoles } from '@/src/hooks/use-roles'
import { IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, selectModal } from '@/src/state/shared/modal'
import WarehouseCard from '@/src/modules/warehouses/WarehouseCard'

const Warehouses = () => {
  const { t } = useTranslation(['warehouse', 'g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const { refreshKey } = useAppSelector(selectModal)
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  const [drinks, setDrinks] = useState<IDrink[]>([])
  const [isLoad, setIsLoad] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [warehousesRes, drinksRes] = await Promise.all([
        api.get<IWarehouse[]>(WarehouseApis.getWarehouses()),
        api.get<IDrink[]>(DrinkApis.getDrinks()),
      ])
      setWarehouses(warehousesRes.data)
      setDrinks(drinksRes.data)
    } catch {
      customToast.error(t('g:errorMessage'))
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
