import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import UploadIcon from '@/src/components/purchase-import/UploadIcon'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { usePurchaseImportsQuery } from '@/src/hooks/queries/use-purchase-import-queries'
import { useWarehousesQuery } from '@/src/hooks/queries/use-warehouse-queries'
import { IWarehouse, SelectOption } from '@/src/interfaces'
import PurchaseImportHistory from '@/src/modules/purchase-import/PurchaseImportHistory'
import { usePurchaseImportService } from '@/src/services/use-purchase-import-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { shrinkImage } from '@/src/utils/image'

const NO_WAREHOUSES: IWarehouse[] = []
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const ACCEPTED_FILES = ACCEPTED_TYPES.join(',')

const toOption = (w: IWarehouse): SelectOption => ({ id: String(w.warehouseId), name: w.name, value: String(w.warehouseId) })

// choose the warehouse and the document, the document is read and opens in a window to be checked
const PurchaseImport = () => {
  const { t } = useTranslation(['purchase', 'g'])
  const dispatch = useAppDispatch()
  const showError = useErrorToast()
  const { parse } = usePurchaseImportService()
  const { afterPurchaseImport } = useRefreshData()
  const fileInput = useRef<HTMLInputElement | null>(null)

  const warehouses = useWarehousesQuery().data ?? NO_WAREHOUSES
  const methods = useForm<{ warehouse?: SelectOption }>({ defaultValues: { warehouse: undefined } })
  const selected = useWatch({ control: methods.control, name: 'warehouse' })
  const warehouseId = Number(selected?.value) || undefined

  // the same first page of the history that is shown below, so there is no extra request
  const { data: history, isPending: isHistoryPending } = usePurchaseImportsQuery({ page: 1, search: '' })
  // once something was uploaded the button is enough, the big box with the explanation is for the first upload
  const hasUploads = isHistoryPending || (history?.meta.totalItems ?? 0) > 0

  const [fileName, setFileName] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  // a file is being dragged over the box
  const [isDragging, setIsDragging] = useState(false)

  // the default warehouse is picked at the start
  useEffect(() => {
    if (warehouses.length && !methods.getValues('warehouse')?.value) {
      methods.setValue('warehouse', toOption(warehouses.find((w) => w.isDefault) ?? warehouses[0]))
    }
  }, [warehouses])

  // choosing (or dropping) the document starts reading it, there is no second button.
  // On a phone the system offers to take a photo or to pick a file.
  const processFile = async (picked?: File) => {
    if (!picked || !warehouseId || isBusy) return

    if (!ACCEPTED_TYPES.includes(picked.type)) {
      customToast.error(t('purchase:wrongType'))

      return
    }

    setIsBusy(true)
    setFileName(picked.name)

    try {
      const result = await parse(warehouseId, await shrinkImage(picked))
      dispatch(openModal({ modal: ModalEnums.PURCHASE_IMPORT, data: { purchaseImportId: result.purchaseImportId } }))
    } catch (error) {
      showError(error)
    } finally {
      // the history shows every upload, also the ones that failed
      await afterPurchaseImport()
      setIsBusy(false)
      setFileName('')
    }
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    // the same document can be chosen again
    e.target.value = ''

    processFile(picked)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    processFile(e.dataTransfer.files?.[0])
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (!isBusy) setIsDragging(true)
  }

  const warehouseSelect = (
    <SingleSelect name="warehouse" label={t('purchase:warehouse')} placeholder={t('purchase:warehousePlh')} options={warehouses.map(toOption)} />
  )

  if (!warehouses.length) return <Paragraph text={t('purchase:noWarehouses')} size="sm" />

  return (
    <div className="pb-8">
      <div className="rounded-xs-plus border-1 border-solid border-light-grey-alt bg-white p-5 md:p-6">
        <Heading text={t('purchase:title')} variant="2" size="base" color="black" />
        {!hasUploads && <Paragraph text={t('purchase:description')} size="sm" color="grey" className="mt-1" />}

        <input ref={fileInput} type="file" accept={ACCEPTED_FILES} onChange={handleFile} className="hidden" />

        {hasUploads ? (
          <div className="mt-5 flex flex-col md:flex-row md:items-end gap-4">
            <FormProvider {...methods}>
              <div className="w-full md:w-72">{warehouseSelect}</div>
            </FormProvider>

            <MainButton
              text={t('purchase:upload')}
              variant="contained"
              size="medium"
              className="justify-center"
              onClick={() => fileInput.current?.click()}
              disabled={isBusy}
              isInactive={!warehouseId}
            />

            {isBusy && <Paragraph text={t('purchase:reading', { name: fileName })} size="sm" color="grey" className="md:pb-3 break-all" />}
          </div>
        ) : (
          <>
            <FormProvider {...methods}>
              <div className="mt-6 w-full md:w-72">{warehouseSelect}</div>
            </FormProvider>

            {/* the box of the first upload: a click on the button, or a file dropped on it, starts reading the document */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`mt-6 flex flex-col items-center gap-y-3 rounded-xs-plus border-2 border-dashed px-4 py-8 md:py-10 text-center transition-colors ${
                isDragging ? 'border-green bg-green-transparent' : 'border-grey bg-light-grey-transparent'
              }`}
            >
              <UploadIcon />

              <div className="flex flex-col items-center gap-y-1">
                <Heading
                  text={isBusy ? t('purchase:reading', { name: fileName }) : t('purchase:dropTitle')}
                  variant="2"
                  size="sm"
                  color="black"
                  className="break-all"
                />
                {!isBusy && (
                  <>
                    <Paragraph text={t('purchase:dropPhone')} size="sm" color="grey" className="md:hidden" />
                    <Paragraph text={t('purchase:dropDesktop')} size="sm" color="grey" className="hidden md:block" />
                  </>
                )}
              </div>

              <MainButton
                text={t('purchase:upload')}
                variant="contained"
                size="medium"
                className="justify-center"
                onClick={() => fileInput.current?.click()}
                disabled={isBusy}
                isInactive={!warehouseId}
              />

              <Paragraph text={t('purchase:formats')} size="xs" />
            </div>
          </>
        )}
      </div>

      <PurchaseImportHistory />
    </div>
  )
}

export default PurchaseImport
