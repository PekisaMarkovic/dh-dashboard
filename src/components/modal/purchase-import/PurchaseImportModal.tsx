import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import Skeleton from '@/src/components/skeleton/Skeleton'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import PurchaseImportLineRow, { COLUMNS, Row } from '@/src/components/purchase-import/PurchaseImportLineRow'
import PurchaseImportStatusPill from '@/src/components/purchase-import/PurchaseImportStatusPill'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { usePurchaseImportQuery } from '@/src/hooks/queries/use-purchase-import-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { SelectOption } from '@/src/interfaces'
import { PurchaseImportDetail, usePurchaseImportService } from '@/src/services/use-purchase-import-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'

const toOption = (drink: { drinkId: number; name: string }): SelectOption => ({
  id: String(drink.drinkId),
  name: drink.name,
  value: String(drink.drinkId),
})


// the lines the AI read: the matched drink is already chosen, the user changes what is wrong and adds the rest to the stock.
// A document can be opened again later to add the lines that were left out.
const PurchaseImportModal = () => {
  const { t } = useTranslation(['purchase', 'g'])
  const dispatch = useAppDispatch()
  const showError = useErrorToast()
  const { apply } = usePurchaseImportService()
  const { afterPurchaseImport } = useRefreshData()
  const { data } = useAppSelector(selectModal)
  const purchaseImportId = (data as { purchaseImportId: number } | null)?.purchaseImportId
  const { data: detail, isError } = usePurchaseImportQuery(purchaseImportId)
  const [rows, setRows] = useState<Row[]>([])
  const [isBusy, setIsBusy] = useState(false)

  // the message about the error comes from the cache, the window is of no use then
  useEffect(() => {
    if (isError) dispatch(removeModal())
  }, [isError])

  // the lines come from the api, again after every change, so the added ones become fixed
  useEffect(() => {
    if (detail) setRows(toRows(detail))
  }, [detail])

  const handleClose = () => dispatch(removeModal())
  const updateRow = (id: number, change: Partial<Row>) => setRows((current) => current.map((r) => (r.id === id ? { ...r, ...change } : r)))

  // only the lines with a drink and a quantity are added
  const items = rows.flatMap((r) => {
    const quantity = Math.trunc(Number(r.quantity))

    return !r.isAdded && !r.skip && r.drink && quantity > 0 ? [{ purchaseImportItemId: r.id, drinkId: Number(r.drink.value), quantity }] : []
  })
  const isEverythingAdded = rows.length > 0 && rows.every((r) => r.isAdded)

  const handleApply = async () => {
    if (!detail || !items.length) return
    setIsBusy(true)

    try {
      await apply(detail.purchaseImportId, items)
      await afterPurchaseImport()
      customToast.success(t('purchase:modal.added_toast', { count: items.length }))

      // nothing is left to add, so the window is of no use any more
      if (rows.filter((r) => !r.isAdded).length === items.length) handleClose()
    } catch (error) {
      showError(error)
    } finally {
      setIsBusy(false)
    }
  }

  if (!detail) {
    return (
      <div className="w-[760px] max-w-full">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-96 max-w-full mt-3" />
        <div className="mt-6">
          <TableSkeleton columns={[2, 2, 1]} rows={4} />
        </div>
      </div>
    )
  }

  const appliedCount = detail.items.filter((i) => i.appliedDrinkId !== null).length
  const drinkOptions = detail.drinks.map(toOption)

  return (
    <div className="w-[760px] max-w-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 basis-60">
          <Heading text={detail.title || detail.fileName} variant="2" size="base" color="black" className="break-words" />
          <Paragraph
            text={t('purchase:modal.subtitle', { warehouse: detail.warehouseName, user: detail.userName, date: formatDate(detail.createdAt) })}
            size="sm"
            color="grey"
            className="mt-1"
          />
        </div>
        <PurchaseImportStatusPill status={detail.status} linesCount={detail.items.length} appliedCount={appliedCount} />
      </div>

      {detail.status === 'failed' && <Paragraph text={detail.errorMessage || t('purchase:modal.failed')} size="sm" color="red" className="mt-6" />}

      {detail.status !== 'failed' && !detail.items.length && <Paragraph text={t('purchase:modal.nothingFound')} size="sm" className="mt-6" />}

      {rows.length > 0 && (
        <div className="mt-6">
          <div className={`hidden md:grid ${COLUMNS} gap-x-4 px-1 pb-2 border-b-1 border-b-light-grey-alt border-solid`}>
            <Heading text={t('purchase:modal.onDocument')} variant="2" size="sm" color="grey" weight="medium" />
            <Heading text={t('purchase:modal.drink')} variant="2" size="sm" color="grey" weight="medium" />
            <Heading text={t('purchase:modal.quantity')} variant="2" size="sm" color="grey" weight="medium" />
            <span />
          </div>

          {/* the window scrolls, not the list: an open list of drinks must not be cut off by the edge of the list */}
          {rows.map((row) => (
            <PurchaseImportLineRow
              key={`${row.id}-${detail.items.length}-${row.isAdded}`}
              row={row}
              options={drinkOptions}
              onChange={(change) => updateRow(row.id, change)}
            />
          ))}
        </div>
      )}

      {/* stays at the bottom of the window while a long document is scrolled */}
      <div className="sticky bottom-0 bg-white flex flex-wrap items-center justify-between gap-3 pt-4 mt-2">
        <Paragraph
          text={isEverythingAdded ? t('purchase:modal.allAdded') : t('purchase:modal.ready', { count: items.length })}
          size="sm"
          color="grey"
        />

        <div className="flex flex-wrap justify-end gap-3">
          <MainButton text={t('purchase:modal.close')} variant="outlined" size="medium" onClick={handleClose} />
          {!isEverythingAdded && detail.status !== 'failed' && (
            <MainButton
              text={t('purchase:modal.apply', { count: items.length })}
              variant="contained"
              size="medium"
              onClick={handleApply}
              disabled={isBusy}
              isInactive={!items.length}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const toRows = (detail: PurchaseImportDetail): Row[] =>
  detail.items.map((item) => {
    const isAdded = item.appliedDrinkId !== null
    const drink = detail.drinks.find((d) => d.drinkId === (item.appliedDrinkId ?? item.suggestedDrinkId))

    return {
      id: item.purchaseImportItemId,
      name: item.name,
      quantity: String(item.appliedQuantity ?? item.quantity),
      drink: drink ? toOption(drink) : null,
      skip: false,
      isAdded,
    }
  })

export default PurchaseImportModal
