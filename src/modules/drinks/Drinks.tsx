import { useMemo } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import InputText from '@/src/components/core/input/InputText'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useDrinksQuery } from '@/src/hooks/queries/use-drink-queries'
import { useWarehousesQuery } from '@/src/hooks/queries/use-warehouse-queries'
import { useRoles } from '@/src/hooks/use-roles'
import { IDrink, IWarehouse } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePagedList } from '@/src/hooks/use-paged-list'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import DrinksList from '@/src/modules/drinks/DrinksList'

const NO_WAREHOUSES: IWarehouse[] = []
const NO_DRINKS: IDrink[] = []

const matchesSearch = (drink: IDrink, search: string) => {
  const text = search.trim().toLowerCase()

  return drink.name.toLowerCase().includes(text) || (drink.code || '').toLowerCase().includes(text)
}

const Drinks = () => {
  const { t } = useTranslation(['drink', 'g'])
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  // both lists are cached: a visit after the first one shows them right away
  const warehousesQuery = useWarehousesQuery()
  const drinksQuery = useDrinksQuery()
  const warehouses = warehousesQuery.data ?? NO_WAREHOUSES
  const drinks = drinksQuery.data ?? NO_DRINKS
  const isLoad = !warehousesQuery.isPending && !drinksQuery.isPending
  const filterForm = useForm()
  const selectedWarehouse = useWatch({ control: filterForm.control, name: 'warehouse' })
  const search: string = useWatch({ control: filterForm.control, name: 'search' }) || ''
  // the select is cleared by picking the selected option again, which means: all warehouses
  const warehouseId: string = selectedWarehouse?.value || ''

  const visible = useMemo(
    () => drinks.filter((d) => (!warehouseId || d.warehouseId === Number(warehouseId)) && matchesSearch(d, search)),
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
        {!isLoad ? (
          <TableSkeleton columns={[1, 2, 1, 1, 1]} rows={8} />
        ) : (
          <>
            {visible.length ? <DrinksList drinks={pageItems} warehouses={warehouses} /> : <Paragraph text={t('drink:empty')} size="sm" />}
            <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

export default Drinks
