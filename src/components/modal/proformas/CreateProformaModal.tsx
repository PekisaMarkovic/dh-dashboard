import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DrinkApis from '@/src/api/drinks'
import ProformaApis from '@/src/api/proformas'
import WarehouseApis from '@/src/api/warehouses'
import MainButton from '@/src/components/core/buttons/MainButton'
import QuantityInput from '@/src/components/core/input/QuantityInput'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import customToast from '@/src/components/core/toast/CustomToast'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePagedList } from '@/src/hooks/use-paged-list'
import InputText from '@/src/components/core/input/InputText'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useApi } from '@/src/hooks/use-api'
import { useRoles } from '@/src/hooks/use-roles'
import { IDrink, IProforma, IWarehouse, SelectOption } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, refresh, removeModal } from '@/src/state/shared/modal'
import { formatMoney } from '@/src/utils/money'

type Quantities = Record<number, number>

const toOption = (w: IWarehouse): SelectOption => ({ id: String(w.warehouseId), name: w.name, value: String(w.warehouseId) })

// amounts are summed in cents, so 0.1 * 3 never shows up as 0.30000000000000004
const lineCents = (price: number, quantity: number) => Math.round(price * 100) * quantity

const CreateProformaModal = () => {
  const { t } = useTranslation(['proforma', 'g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const methods = useForm<{ warehouse?: SelectOption; search?: string }>({ defaultValues: { warehouse: undefined, search: '' } })
  const selected = useWatch({ control: methods.control, name: 'warehouse' })
  const search = (useWatch({ control: methods.control, name: 'search' }) || '').trim().toLowerCase()
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  const [isLoad, setIsLoad] = useState(false)
  const [drinks, setDrinks] = useState<IDrink[]>([])
  const [drinksLoad, setDrinksLoad] = useState(false)
  // what is on the proforma, and what is being edited in the "add drinks" view
  const [lines, setLines] = useState<Quantities>({})
  const [draft, setDraft] = useState<Quantities>({})
  const [view, setView] = useState<'lines' | 'pick'>('lines')
  const [isSaving, setIsSaving] = useState(false)

  // there is always a warehouse in use: the picked one, or the first available one
  const warehouseId = warehouses.find((w) => String(w.warehouseId) === selected?.value)?.warehouseId ?? warehouses[0]?.warehouseId

  useEffect(() => {
    api
      .get<IWarehouse[]>(WarehouseApis.getWarehouses())
      .then(({ data }) => {
        setWarehouses(data)
        if (data.length) methods.setValue('warehouse', toOption(data[0]))
      })
      .catch(() => customToast.error(t('g:errorMessage')))
      .finally(() => setIsLoad(true))
  }, [])

  const fetchDrinks = useCallback(async () => {
    if (!warehouseId) return

    setDrinksLoad(false)

    try {
      const { data } = await api.get<IDrink[]>(DrinkApis.getDrinks(), { params: { warehouseId } })
      setDrinks(data)
    } catch {
      customToast.error(t('g:errorMessage'))
    } finally {
      setDrinksLoad(true)
    }
  }, [warehouseId])

  // another warehouse means other drinks, so the proforma starts again
  useEffect(() => {
    setLines({})
    setDraft({})
    setView('lines')
    methods.setValue('search', '')
    fetchDrinks()
  }, [fetchDrinks])

  const added = useMemo(() => drinks.filter((d) => (lines[d.drinkId] || 0) > 0), [drinks, lines])
  const totalCents = added.reduce((sum, d) => sum + lineCents(d.price, lines[d.drinkId]), 0)
  const filtered = useMemo(() => drinks.filter((d) => d.name.toLowerCase().includes(search)), [drinks, search])
  const pickPage = usePagedList(filtered, [search, warehouseId])
  const linesPage = usePagedList(added)
  const draftCents = drinks.reduce((sum, d) => sum + lineCents(d.price, draft[d.drinkId] || 0), 0)

  const openPicker = () => {
    methods.setValue('search', '')
    setDraft({ ...lines })
    setView('pick')
  }

  const applyDraft = () => {
    setLines(Object.fromEntries(Object.entries(draft).filter(([, quantity]) => quantity > 0)))
    setView('lines')
  }

  const handleCreate = async () => {
    if (!added.length) {
      customToast.error(t('proforma:addAtLeastOne'))
      return
    }

    setIsSaving(true)

    try {
      const { data } = await api.post<IProforma>(ProformaApis.createProforma(), {
        warehouseId,
        items: added.map((d) => ({ drinkId: d.drinkId, quantity: lines[d.drinkId] })),
      })

      customToast.success(t('proforma:created', { number: data.number }))
      dispatch(refresh())
      dispatch(removeModal())
    } catch {
      customToast.error(t('g:errorMessage'))
      setIsSaving(false)
    }
  }

  const close = () => dispatch(removeModal())

  if (!isLoad) return null

  // a proforma is made of the drinks of a warehouse, so a warehouse comes first
  if (!warehouses.length) {
    return (
      <div className="w-[480px] max-w-full">
        <Heading text={t('proforma:noWarehouseTitle')} variant="2" size="base" color="black" />
        <Paragraph text={isAdmin ? t('proforma:noWarehouse') : t('proforma:noWarehouseUser')} size="sm" color="grey" className="mt-3" />
        <div className="flex justify-end gap-x-4 mt-8">
          <MainButton text={t('g:button.cancel')} variant="alternative" size="medium" onClick={close} />
          {isAdmin && (
            <MainButton
              text={t('proforma:createWarehouse')}
              variant="contained"
              size="medium"
              onClick={() => dispatch(openModal({ modal: ModalEnums.WAREHOUSE }))}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="w-[760px] max-w-full">
        <Heading text={view === 'pick' ? t('proforma:pick.title') : t('proforma:createModal.title')} variant="2" size="base" color="black" />
        <Paragraph
          text={view === 'pick' ? t('proforma:pick.subtitle') : t('proforma:createModal.subtitle')}
          size="sm"
          color="grey"
          className="mt-1"
        />

        {/* warehouse and search side by side */}
        <div className="flex flex-wrap items-start gap-4 mt-6">
          <div className="w-72">
            <SingleSelect
              name="warehouse"
              label={t('proforma:builder.warehouse')}
              placeholder={t('proforma:builder.warehousePlh')}
              options={warehouses.map(toOption)}
              isDisabled={view === 'pick'}
            />
          </div>

          {view === 'pick' && drinks.length > 0 && (
            <div className="w-72">
              <InputText name="search" label={t('g:search')} placeholder={t('drink:search')} />
            </div>
          )}
        </div>

        {view === 'pick' ? (
          <div className="mt-6">
            {drinksLoad && !drinks.length ? (
              <div>
                <Paragraph text={isAdmin ? t('proforma:noDrinks') : t('proforma:noDrinksUser')} size="sm" color="grey" />
                {isAdmin && (
                  <div className="mt-4">
                    <MainButton
                      text={t('proforma:addDrinks')}
                      variant="contained"
                      size="medium"
                      onClick={() => dispatch(openModal({ modal: ModalEnums.DRINK, data: { warehouseId } }))}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="border-b-1 border-b-light-grey-alt border-solid px-2 pb-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_80px_110px_150px_110px] gap-x-4">
                    <div>
                      <Heading text={t('proforma:table.name')} variant="2" size="sm" color="grey" weight="medium" />
                    </div>
                    <Heading text={t('proforma:table.inStock')} variant="2" size="sm" color="grey" weight="medium" />
                    <Heading text={t('proforma:table.unitPrice')} variant="2" size="sm" color="grey" weight="medium" />
                    <Heading text={t('proforma:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
                    <div className="flex justify-end">
                      <Heading text={t('proforma:table.lineTotal')} variant="2" size="sm" color="grey" weight="medium" />
                    </div>
                  </div>
                </div>

                {pickPage.pageItems.map((drink) => {
                  const quantity = draft[drink.drinkId] || 0

                  return (
                    <div
                      key={drink.drinkId}
                      className="grid grid-cols-[minmax(0,1fr)_80px_110px_150px_110px] gap-x-4 items-center px-2 py-2 border-b-1 border-b-light-grey-alt border-solid"
                    >
                      <div>
                        <Paragraph text={drink.name} size="sm" color="black" />
                      </div>
                      <Paragraph
                        text={drink.quantity === 0 ? t('proforma:outOfStock') : `${drink.quantity}`}
                        size="sm"
                        color={drink.quantity === 0 ? 'red' : 'black'}
                      />
                      <Paragraph text={formatMoney(drink.price)} size="sm" color="black" />
                      <div>
                        <QuantityInput
                          ariaLabel={drink.name}
                          value={quantity}
                          max={drink.quantity}
                          disabled={drink.quantity === 0}
                          onChange={(value) => setDraft((prev) => ({ ...prev, [drink.drinkId]: value }))}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Paragraph text={quantity ? formatMoney(lineCents(drink.price, quantity) / 100) : '-'} size="sm" color="black" />
                      </div>
                    </div>
                  )
                })}

                {!filtered.length && <Paragraph text={t('drink:empty')} size="sm" color="grey" className="py-4" />}

                <ListPagination page={pickPage.page} totalPages={pickPage.totalPages} onPageChange={pickPage.setPage} />
              </div>
            )}

            {/* total on the far right, aligned with the totals column; buttons in their own row */}
            <div className="flex items-baseline justify-end gap-x-4 px-2 pt-4 whitespace-nowrap">
              <Heading text={t('proforma:total')} variant="3" size="base" color="grey" />
              <Heading text={formatMoney(draftCents / 100)} variant="3" size="xl" color="black" />
            </div>

            <div className="flex justify-end gap-x-4 pt-6">
              <MainButton text={t('g:button.back')} variant="alternative" size="medium" onClick={() => setView('lines')} />
              <MainButton text={t('proforma:pick.done')} variant="contained" size="medium" onClick={applyDraft} />
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <Heading text={t('proforma:createModal.items')} variant="3" size="base" color="black" />
              <MainButton text={t('proforma:addDrinks')} variant="outlined" size="small" onClick={openPicker} />
            </div>

            {added.length ? (
              <div>
                <div className="border-b-1 border-b-light-grey-alt border-solid px-2 pb-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_150px_110px_110px_80px] gap-x-4">
                    <div>
                      <Heading text={t('proforma:table.name')} variant="2" size="sm" color="grey" weight="medium" />
                    </div>
                    <Heading text={t('proforma:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
                    <Heading text={t('proforma:table.unitPrice')} variant="2" size="sm" color="grey" weight="medium" />
                    <div className="flex justify-end">
                      <Heading text={t('proforma:table.lineTotal')} variant="2" size="sm" color="grey" weight="medium" />
                    </div>
                    <span />
                  </div>
                </div>

                {linesPage.pageItems.map((drink) => (
                  <div
                    key={drink.drinkId}
                    className="grid grid-cols-[minmax(0,1fr)_150px_110px_110px_80px] gap-x-4 items-center px-2 py-2 border-b-1 border-b-light-grey-alt border-solid"
                  >
                    <div>
                      <Paragraph text={drink.name} size="sm" color="black" />
                    </div>
                    <div>
                      <QuantityInput
                        ariaLabel={drink.name}
                        value={lines[drink.drinkId]}
                        min={1}
                        max={drink.quantity}
                        onChange={(value) => setLines((prev) => ({ ...prev, [drink.drinkId]: value }))}
                      />
                    </div>
                    <Paragraph text={formatMoney(drink.price)} size="sm" color="black" />
                    <div className="flex justify-end">
                      <Paragraph text={formatMoney(lineCents(drink.price, lines[drink.drinkId]) / 100)} size="sm" color="black" />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="font-poppins text-sm text-red hover:underline"
                        onClick={() =>
                          setLines((prev) => {
                            const next = { ...prev }
                            delete next[drink.drinkId]
                            return next
                          })
                        }
                      >
                        {t('proforma:remove')}
                      </button>
                    </div>
                  </div>
                ))}

                <ListPagination page={linesPage.page} totalPages={linesPage.totalPages} onPageChange={linesPage.setPage} />
              </div>
            ) : (
              <Paragraph text={t('proforma:createModal.noItems')} size="sm" color="grey" className="py-4" />
            )}

            {/* total on the far right, aligned with the totals column; buttons in their own row */}
            <div className="flex items-baseline justify-end gap-x-4 px-2 pt-4 whitespace-nowrap">
              <Heading text={t('proforma:total')} variant="3" size="base" color="grey" />
              <Heading text={formatMoney(totalCents / 100)} variant="3" size="xl" color="black" />
            </div>

            <div className="flex justify-end gap-x-4 pt-6">
              <MainButton text={t('g:button.cancel')} variant="alternative" size="medium" onClick={close} />
              <MainButton text={t('proforma:create')} variant="contained" size="medium" disabled={isSaving} onClick={handleCreate} />
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  )
}

export default CreateProformaModal
