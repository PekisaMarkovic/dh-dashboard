import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Skeleton from '@/src/components/skeleton/Skeleton'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import MainButton from '@/src/components/core/buttons/MainButton'
import DecimalInput from '@/src/components/core/input/DecimalInput'
import QuantityInput from '@/src/components/core/input/QuantityInput'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePagedList } from '@/src/hooks/use-paged-list'
import InputText from '@/src/components/core/input/InputText'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { ModalEnums } from '@/src/enum'
import { useCustomersQuery } from '@/src/hooks/queries/use-customer-queries'
import { useDrinksQuery } from '@/src/hooks/queries/use-drink-queries'
import { useWarehousesQuery } from '@/src/hooks/queries/use-warehouse-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useProformaService } from '@/src/services/use-proforma-service'
import { useRoles } from '@/src/hooks/use-roles'
import { ICustomer, IDrink, IWarehouse, SelectOption } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { openPdfTab } from '@/src/utils/files'
import ProformaTotals from '@/src/components/proformas/ProformaTotals'
import { formatCents, formatPrice, lineCents, vatCents } from '@/src/utils/money'
import { getStockLevel, STOCK_ROW_CLASS, STOCK_TEXT_CLASS } from '@/src/utils/stock'

const NO_WAREHOUSES: IWarehouse[] = []
const NO_CUSTOMERS: ICustomer[] = []
const NO_DRINKS: IDrink[] = []

type Quantities = Record<number, number>

const withoutKey = (values: Quantities, key: number) => {
  const next = { ...values }

  delete next[key]

  return next
}

const toCustomerOption = (c: ICustomer): SelectOption => ({ id: String(c.customerId), name: c.name, value: String(c.customerId) })

const toOption = (w: IWarehouse): SelectOption => ({ id: String(w.warehouseId), name: w.name, value: String(w.warehouseId) })

const CreateProforma = () => {
  const { t } = useTranslation(['proforma', 'g'])
  const showError = useErrorToast()
  const { createProforma, getProformaPdf } = useProformaService()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAdmin } = useRoles()
  const { afterProformaChange } = useRefreshData()
  const methods = useForm<{ warehouse?: SelectOption; customer?: SelectOption; search?: string }>({
    defaultValues: { warehouse: undefined, customer: undefined, search: '' },
  })
  const selected = useWatch({ control: methods.control, name: 'warehouse' })
  const search = (useWatch({ control: methods.control, name: 'search' }) || '').trim().toLowerCase()
  const customer = useWatch({ control: methods.control, name: 'customer' })
  // the lists come from the cache: a visit after the first one shows them right away
  const warehousesQuery = useWarehousesQuery()
  const customersQuery = useCustomersQuery()
  const warehouses = warehousesQuery.data ?? NO_WAREHOUSES
  const customers = customersQuery.data ?? NO_CUSTOMERS
  const isLoad = !warehousesQuery.isPending
  // what is on the proforma, and what is being edited in the "add drinks" view
  const [lines, setLines] = useState<Quantities>({})
  const [draft, setDraft] = useState<Quantities>({})
  // the price (for this proforma only) and the discount in percent of the added drinks
  const [prices, setPrices] = useState<Quantities>({})
  const [discounts, setDiscounts] = useState<Quantities>({})
  const [view, setView] = useState<'lines' | 'pick'>('pick')
  const [isSaving, setIsSaving] = useState(false)

  // there is always a warehouse in use: the picked one, or the first available one
  const warehouseId = warehouses.find((w) => String(w.warehouseId) === selected?.value)?.warehouseId ?? warehouses[0]?.warehouseId

  // the first warehouse is picked at the start, a picked one stays
  useEffect(() => {
    if (warehouses.length && !methods.getValues('warehouse')?.value) methods.setValue('warehouse', toOption(warehouses[0]))
  }, [warehouses])

  // the drinks of the warehouse in use (cached per warehouse; they are 30 seconds fresh because the stock changes often)
  const drinksQuery = useDrinksQuery(warehouseId, !!warehouseId)
  const drinks = drinksQuery.data ?? NO_DRINKS
  const drinksLoad = drinksQuery.isSuccess || drinksQuery.isError

  // another warehouse means other drinks, so the proforma starts again
  useEffect(() => {
    setLines({})
    setDraft({})
    setPrices({})
    setDiscounts({})
    // the proforma always starts at choosing the drinks
    setView('pick')
    methods.setValue('search', '')
  }, [warehouseId])

  // the changed price of this proforma, or the price of the drink
  const priceOf = (drink: IDrink) => prices[drink.drinkId] ?? drink.price
  const discountOf = (drink: IDrink) => discounts[drink.drinkId] ?? 0
  const lineTotalCents = (drink: IDrink, quantity: number) => lineCents(priceOf(drink), quantity, discountOf(drink))

  const added = useMemo(() => drinks.filter((d) => (lines[d.drinkId] || 0) > 0), [drinks, lines])
  const totalCents = added.reduce((sum, d) => sum + lineTotalCents(d, lines[d.drinkId]), 0)
  const totalVatCents = added.reduce((sum, d) => sum + vatCents(lineTotalCents(d, lines[d.drinkId])), 0)
  const filtered = useMemo(
    () => drinks.filter((d) => d.name.toLowerCase().includes(search) || (d.code || '').toLowerCase().includes(search)),
    [drinks, search],
  )
  const pickPage = usePagedList(filtered, [search, warehouseId])
  const linesPage = usePagedList(added)
  const draftCents = drinks.reduce((sum, d) => sum + lineTotalCents(d, draft[d.drinkId] || 0), 0)
  const draftVatCents = drinks.reduce((sum, d) => sum + vatCents(lineTotalCents(d, draft[d.drinkId] || 0)), 0)

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

    // the tab for the PDF has to be opened right in the click, before waiting for the api
    const pdfTab = openPdfTab()

    setIsSaving(true)

    try {
      const proforma = await createProforma({
        warehouseId,
        // only when a customer was picked
        ...(customer?.value && { customerId: Number(customer.value) }),
        items: added.map((d) => ({
          drinkId: d.drinkId,
          quantity: lines[d.drinkId],
          // the price is sent only when it was changed
          ...(prices[d.drinkId] !== undefined && { unitPrice: prices[d.drinkId] }),
          discountPercent: discountOf(d),
        })),
      })

      customToast.success(t('proforma:created', { number: proforma.number }))
      // the proformas and the stock of the drinks changed (not awaited: the page is left right away)
      void afterProformaChange()
      navigate(ROUTE_NAMES.proformas)

      // the proforma is made, so it opens in a new tab together with the print dialog.
      // If that fails, it can be printed or downloaded later from the list
      if (!pdfTab) {
        customToast.error(t('proforma:popupBlocked'))
        return
      }

      try {
        pdfTab.show(await getProformaPdf(proforma.proformaId), proforma.number)
      } catch (error) {
        pdfTab.close()
        showError(error)
      }
    } catch (error) {
      pdfTab?.close()
      showError(error)
      setIsSaving(false)
    }
  }

  const close = () => navigate(ROUTE_NAMES.proformas)

  if (!isLoad) {
    return (
      <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-96 max-w-full mt-3" />
        <div className="flex flex-wrap gap-4 mt-6">
          <Skeleton className="h-12 w-60" />
          <Skeleton className="h-12 w-60" />
          <Skeleton className="h-12 w-60" />
        </div>
        <div className="mt-6">
          <TableSkeleton columns={[2, 1, 1, 1.4, 1]} rows={6} />
        </div>
      </div>
    )
  }

  // a proforma is made of the drinks of a warehouse, so a warehouse comes first
  if (!warehouses.length) {
    return (
      <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6 max-w-xl">
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

  const isPick = view === 'pick'
  // the warehouse can be changed until drinks are on the proforma, a new warehouse starts the proforma again
  const isWarehouseLocked = isPick && added.length > 0

  const pickHeader = (
    <div className="sticky top-0 z-2 bg-white border-b-1 border-b-light-grey-alt border-solid px-2 pb-3">
      <div className="grid grid-cols-[minmax(0,1fr)_110px_110px_150px_110px] gap-x-4">
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
  )

  const pickRows = pickPage.pageItems.map((drink) => {
    const quantity = draft[drink.drinkId] || 0

    return (
      <div
        key={drink.drinkId}
        className={`grid grid-cols-[minmax(0,1fr)_110px_110px_150px_110px] gap-x-4 items-center px-2 py-2 border-b-1 border-b-light-grey-alt border-solid ${STOCK_ROW_CLASS[getStockLevel(drink)]}`}
      >
        <div>
          <Paragraph text={drink.name} size="sm" color="black" />
        </div>
        <p
          className={`font-poppins text-sm ${getStockLevel(drink) === 'ok' && drink.quantity === 0 ? 'text-red' : STOCK_TEXT_CLASS[getStockLevel(drink)]}`}
        >
          {drink.quantity === 0 ? t('proforma:outOfStock') : drink.quantity}
        </p>
        <Paragraph text={formatPrice(priceOf(drink))} size="sm" color="black" />
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
          <Paragraph text={quantity ? formatCents(lineTotalCents(drink, quantity)) : '-'} size="sm" color="black" />
        </div>
      </div>
    )
  })

  const linesHeader = (
    <div className="sticky top-0 z-2 bg-white border-b-1 border-b-light-grey-alt border-solid px-2 pb-3">
      <div className="grid grid-cols-[minmax(0,1fr)_150px_120px_100px_110px_80px] gap-x-4">
        <div>
          <Heading text={t('proforma:table.name')} variant="2" size="sm" color="grey" weight="medium" />
        </div>
        <Heading text={t('proforma:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
        <Heading text={t('proforma:table.unitPrice')} variant="2" size="sm" color="grey" weight="medium" />
        <Heading text={t('proforma:table.discount')} variant="2" size="sm" color="grey" weight="medium" />
        <div className="flex justify-end">
          <Heading text={t('proforma:table.lineTotal')} variant="2" size="sm" color="grey" weight="medium" />
        </div>
        <span />
      </div>
    </div>
  )

  const linesRows = linesPage.pageItems.map((drink) => (
    <div
      key={drink.drinkId}
      className={`grid grid-cols-[minmax(0,1fr)_150px_120px_100px_110px_80px] gap-x-4 items-center px-2 py-2 border-b-1 border-b-light-grey-alt border-solid ${STOCK_ROW_CLASS[getStockLevel(drink)]}`}
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
      <DecimalInput
        ariaLabel={`${t('proforma:table.unitPrice')} ${drink.name}`}
        value={priceOf(drink)}
        decimals={3}
        isPrice
        onChange={(value) => setPrices((prev) => ({ ...prev, [drink.drinkId]: value }))}
      />
      <DecimalInput
        ariaLabel={`${t('proforma:table.discount')} ${drink.name}`}
        value={discountOf(drink)}
        max={100}
        suffix="%"
        onChange={(value) => setDiscounts((prev) => ({ ...prev, [drink.drinkId]: value }))}
      />
      <div className="flex justify-end">
        <Paragraph text={formatCents(lineTotalCents(drink, lines[drink.drinkId]))} size="sm" color="black" />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="font-poppins text-sm text-red hover:underline"
          onClick={() => {
            setLines((prev) => withoutKey(prev, drink.drinkId))
            setPrices((prev) => withoutKey(prev, drink.drinkId))
            setDiscounts((prev) => withoutKey(prev, drink.drinkId))
          }}
        >
          {t('proforma:remove')}
        </button>
      </div>
    </div>
  ))

  return (
    <FormProvider {...methods}>
      {/* three parts: the top and the bottom are always there, only the middle scrolls */}
      <div className="flex flex-col h-full bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6">
        <div className="shrink-0">
          <Heading text={isPick ? t('proforma:pick.title') : t('proforma:createModal.title')} variant="2" size="base" color="black" />
          <Paragraph text={isPick ? t('proforma:pick.subtitle') : t('proforma:createModal.subtitle')} size="sm" color="grey" className="mt-1" />

          {/* warehouse and search side by side */}
          <div className="flex flex-wrap items-start gap-4 mt-6">
            <div className="w-60">
              <SingleSelect
                name="warehouse"
                label={t('proforma:builder.warehouse')}
                placeholder={t('proforma:builder.warehousePlh')}
                options={warehouses.map(toOption)}
                isDisabled={isWarehouseLocked}
              />
            </div>

            <div className="w-60">
              <SingleSelect
                name="customer"
                label={t('proforma:builder.customer')}
                placeholder={t('proforma:builder.customerPlh')}
                options={customers.map(toCustomerOption)}
              />
            </div>

            {isPick && drinks.length > 0 && (
              <div className="w-60">
                <InputText name="search" label={t('g:search')} placeholder={t('drink:search')} />
              </div>
            )}

            {/* the drinks are added from here, at the far right, level with the fields */}
            {!isPick && (
              <div className="ml-auto self-end">
                <MainButton text={t('proforma:addDrinks')} variant="outlined" size="medium" onClick={openPicker} />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4">
          {isPick && !drinksLoad ? (
            <TableSkeleton columns={[2, 1, 1, 1.4, 1]} rows={6} />
          ) : isPick ? (
            drinksLoad && !drinks.length ? (
              <div className="pt-2">
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
                {pickHeader}
                {pickRows}
                {!filtered.length && <Paragraph text={t('drink:empty')} size="sm" color="grey" className="py-4" />}
              </div>
            )
          ) : (
            <div>
              {added.length ? (
                <div>
                  {linesHeader}
                  {linesRows}
                </div>
              ) : (
                <Paragraph text={t('proforma:createModal.noItems')} size="sm" color="grey" className="py-4" />
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t-1 border-t-light-grey-alt border-solid">
          {isPick ? (
            <ListPagination page={pickPage.page} totalPages={pickPage.totalPages} onPageChange={pickPage.setPage} />
          ) : (
            <ListPagination page={linesPage.page} totalPages={linesPage.totalPages} onPageChange={linesPage.setPage} />
          )}

          {/* the amounts on the far right; buttons in their own row */}
          <div className="px-2 pt-4">
            <ProformaTotals netCents={isPick ? draftCents : totalCents} vatCents={isPick ? draftVatCents : totalVatCents} />
          </div>

          <div className="flex justify-end gap-x-4 pt-4">
            {isPick ? (
              <>
                <MainButton text={t('g:button.back')} variant="alternative" size="medium" onClick={() => setView('lines')} />
                <MainButton text={t('proforma:pick.done')} variant="contained" size="medium" onClick={applyDraft} />
              </>
            ) : (
              <>
                <MainButton text={t('g:button.cancel')} variant="alternative" size="medium" onClick={close} />
                <MainButton text={t('proforma:create')} variant="contained" size="medium" disabled={isSaving} onClick={handleCreate} />
              </>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default CreateProforma
