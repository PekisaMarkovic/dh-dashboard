import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ModalEnums } from '@/src/enum'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useWarehousesQuery } from '@/src/hooks/queries/use-warehouse-queries'
import { IWarehouse, SelectOption } from '@/src/interfaces'
import PurchaseImportHistory from '@/src/modules/purchase-import/PurchaseImportHistory'
import { usePurchaseImportService } from '@/src/services/use-purchase-import-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { shrinkImage } from '@/src/utils/image'

const NO_WAREHOUSES: IWarehouse[] = []
const ACCEPTED_FILES = 'image/jpeg,image/png,image/webp,application/pdf'

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

  const [fileName, setFileName] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  // the default warehouse is picked at the start
  useEffect(() => {
    if (warehouses.length && !methods.getValues('warehouse')?.value) {
      methods.setValue('warehouse', toOption(warehouses.find((w) => w.isDefault) ?? warehouses[0]))
    }
  }, [warehouses])

  // choosing the document starts reading it, there is no second button.
  // On a phone the system offers to take a photo or to pick a file.
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    // the same document can be chosen again
    e.target.value = ''

    if (!picked || !warehouseId) return
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

  if (!warehouses.length) return <Paragraph text={t('purchase:noWarehouses')} size="sm" />

  return (
    <div className="pb-8">
      <div className="rounded-xs-plus border-1 border-solid border-light-grey-alt bg-white p-5 md:p-6">
        <Heading text={t('purchase:title')} variant="2" size="base" color="black" />
        <Paragraph text={t('purchase:description')} size="sm" color="grey" className="mt-1" />

        <div className="mt-6 flex flex-col md:flex-row md:items-end gap-4">
          <FormProvider {...methods}>
            <div className="w-full md:w-72">
              <SingleSelect
                name="warehouse"
                label={t('purchase:warehouse')}
                placeholder={t('purchase:warehousePlh')}
                options={warehouses.map(toOption)}
              />
            </div>
          </FormProvider>

          <input ref={fileInput} type="file" accept={ACCEPTED_FILES} onChange={handleFile} className="hidden" />

          <MainButton
            text={t('purchase:upload')}
            variant="contained"
            size="medium"
            onClick={() => fileInput.current?.click()}
            disabled={isBusy}
            isInactive={!warehouseId}
          />

          {isBusy && <Paragraph text={t('purchase:reading', { name: fileName })} size="sm" color="grey" className="md:pb-3" />}
        </div>

        <Paragraph text={t('purchase:hint')} size="xs" className="mt-4" />
      </div>

      <PurchaseImportHistory />
    </div>
  )
}

export default PurchaseImport
