import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DrinkApis from '@/src/api/drinks'
import WarehouseApis from '@/src/api/warehouses'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import customToast from '@/src/components/core/toast/CustomToast'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useApi } from '@/src/hooks/use-api'
import { useRoles } from '@/src/hooks/use-roles'
import { IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, selectModal } from '@/src/state/shared/modal'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePagedList } from '@/src/hooks/use-paged-list'
import DrinksList from '@/src/modules/drinks/DrinksList'

const Drinks = () => {
  const { t } = useTranslation(['drink', 'g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const { refreshKey } = useAppSelector(selectModal)
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  const [drinks, setDrinks] = useState<IDrink[]>([])
  const filterForm = useForm()
  const selectedWarehouse = useWatch({ control: filterForm.control, name: 'warehouse' })
  const search: string = useWatch({ control: filterForm.control, name: 'search' }) || ''
  // the select is cleared by picking the selected option again, which means: all warehouses
  const warehouseId: string = selectedWarehouse?.value || ''

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
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  const visible = useMemo(
    () => drinks.filter((d) => (!warehouseId || d.warehouseId === Number(warehouseId)) && d.name.toLowerCase().includes(search.trim().toLowerCase())),
    [drinks, warehouseId, search],
  )

  const { pageItems, page, setPage, totalPages } = usePagedList(visible, [search, warehouseId])

  return (
    <div className="pb-8">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <FormProvider {...filterForm}>
          <div className="w-72">
            <InputText name="search" label={t('g:search')} placeholder={t('drink:search')} />
          </div>

          <div className="w-64">
            <SingleSelect
              name="warehouse"
              label={t('drink:filterWarehouse')}
              placeholder={t('drink:allWarehouses')}
              options={warehouses.map((w) => ({ id: String(w.warehouseId), name: w.name, value: String(w.warehouseId) }))}
            />
          </div>
        </FormProvider>

        {isAdmin && (
          <div className="ml-auto">
            <MainButton
              text={t('drink:addDrink')}
              variant="contained"
              size="medium"
              disabled={false}
              onClick={() =>
                warehouses.length
                  ? dispatch(openModal({ modal: ModalEnums.DRINK, data: { warehouseId: warehouseId ? Number(warehouseId) : undefined } }))
                  : customToast.error(t('drink:noWarehouses'))
              }
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6">
        {visible.length ? <DrinksList drinks={pageItems} warehouses={warehouses} /> : <Paragraph text={t('drink:empty')} size="sm" />}
        <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}

export default Drinks
