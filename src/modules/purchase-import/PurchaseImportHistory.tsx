import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import InputText from '@/src/components/core/input/InputText'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import PurchaseImportRow from '@/src/components/purchase-import/PurchaseImportRow'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import { ModalEnums } from '@/src/enum'
import { useDebouncedValue } from '@/src/hooks/use-debounced-value'
import { usePageState } from '@/src/hooks/use-page-state'
import { usePurchaseImportsQuery } from '@/src/hooks/queries/use-purchase-import-queries'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { CustomDropdown } from '@/src/interfaces'
import { IPurchaseImport, usePurchaseImportService } from '@/src/services/use-purchase-import-service'
import { getImportName, getImportState } from '@/src/utils/purchase-import'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'

const NO_IMPORTS: IPurchaseImport[] = []

// every uploaded document: a click opens it, to check it again or to add the lines that were left out
const PurchaseImportHistory = () => {
  const { t } = useTranslation(['purchase', 'g'])
  const dispatch = useAppDispatch()
  const showError = useErrorToast()
  const { deleteImport } = usePurchaseImportService()
  const { afterPurchaseImport } = useRefreshData()
  const filterForm = useForm()
  // the search waits for a pause in typing, then the api returns the matching page
  const search = useDebouncedValue((useWatch({ control: filterForm.control, name: 'search' }) || '').trim())
  const [page, setPage] = usePageState([search])
  // every page and search is cached: the page before stays visible while the next one loads
  const { data, isPending } = usePurchaseImportsQuery({ page, search })
  const imports = data?.items ?? NO_IMPORTS

  const handleOpen = (purchaseImportId: number) => () => dispatch(openModal({ modal: ModalEnums.PURCHASE_IMPORT, data: { purchaseImportId } }))

  const handleDelete = (item: IPurchaseImport) => () => {
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('purchase:history.deleteTitle'),
          message: t('purchase:history.deleteConfirm', { name: getImportName(item) }),
          confirmText: t('g:button.delete'),
          onConfirm: async () => {
            try {
              await deleteImport(item.purchaseImportId)
              await afterPurchaseImport()
            } catch (error) {
              showError(error)
            }
          },
        } satisfies ConfirmModalData,
      }),
    )
  }

  // opening is the first option: with lines left to add it says so
  const options = (item: IPurchaseImport): CustomDropdown[] => {
    const state = getImportState({ status: item.status, linesCount: item.linesCount, appliedCount: item.appliedCount })
    const hasRest = state === 'parsed' || state === 'partial'

    return [
      {
        content: {
          type: 'button',
          text: hasRest ? t('purchase:history.addRest') : t('purchase:history.review'),
          onClick: handleOpen(item.purchaseImportId),
        },
      },
      { content: { type: 'button', text: t('g:button.delete'), onClick: handleDelete(item) }, textColor: 'red' },
    ]
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <Heading text={t('purchase:history.title')} variant="2" size="base" color="grey" />

        <FormProvider {...filterForm}>
          <div className="w-full sm:w-72">
            <InputText name="search" label={t('g:search')} placeholder={t('purchase:history.search')} />
          </div>
        </FormProvider>
      </div>

      <div className="bg-white rounded-sm border-1 border-light-grey-alt border-solid p-6">
        {isPending ? (
          <TableSkeleton columns={[2, 1, 1, 1, 1]} rows={5} />
        ) : imports.length ? (
          <div>
            <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <Heading text={t('purchase:history.table.document')} variant="2" size="sm" color="grey" weight="medium" />
                </div>
                <Heading text={t('purchase:history.table.date')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('purchase:history.table.lines')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('purchase:history.table.status')} variant="2" size="sm" color="grey" weight="medium" />
              </div>
            </div>

            {imports.map((item) => (
              <PurchaseImportRow key={item.purchaseImportId} item={item} onOpen={handleOpen(item.purchaseImportId)} dropdownOptions={options(item)} />
            ))}
          </div>
        ) : (
          <Paragraph text={search ? t('purchase:history.noResults') : t('purchase:history.empty')} size="sm" />
        )}
        {!isPending && <ListPagination page={page} totalPages={data?.meta.totalPages ?? 1} onPageChange={setPage} />}
      </div>
    </div>
  )
}

export default PurchaseImportHistory
