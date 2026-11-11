import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from '@/src/components/skeleton/Skeleton'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import MainButton from '@/src/components/core/buttons/MainButton'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { useProformaQuery } from '@/src/hooks/queries/use-proforma-queries'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'
import ProformaTotals from '@/src/components/proformas/ProformaTotals'
import { formatMoney, formatPrice } from '@/src/utils/money'

const ProformaDetailModal = () => {
  const { t } = useTranslation(['proforma', 'g'])
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectModal)
  const proformaId = (data as { proformaId: number } | null)?.proformaId
  // a proforma that was opened before is shown from the cache
  const { data: proforma, isError } = useProformaQuery(proformaId)

  // the message about the error comes from the cache, the window is of no use then
  useEffect(() => {
    if (isError) dispatch(removeModal())
  }, [isError])

  if (!proforma) {
    return (
      <div className="w-[720px] max-w-full">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-96 max-w-full mt-3" />
        <div className="mt-6">
          <TableSkeleton columns={[2, 1, 1, 1, 1]} rows={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-[720px] max-w-full">
      <Heading text={t('proforma:detail.title', { number: proforma.number })} variant="2" size="base" color="black" />
      <Paragraph
        text={`${t('proforma:detail.warehouse')}: ${proforma.warehouseName} · ${proforma.customerName ? `${t('proforma:detail.customer')}: ${proforma.customerName} · ` : ''}${t('proforma:detail.date')}: ${formatDate(proforma.createdAt)} · ${t('proforma:saved.status')}: ${t(`proforma:status.${proforma.status}`)}`}
        size="sm"
        color="grey"
        className="mt-1"
      />

      <div className="mt-6">
        <div className="border-b-1 border-b-light-grey-alt border-solid pb-2">
          <div className="grid grid-cols-6 gap-x-4">
            <div className="col-span-2">
              <Heading text={t('proforma:table.name')} variant="2" size="sm" color="grey" weight="medium" />
            </div>
            <Heading text={t('proforma:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
            <Heading text={t('proforma:table.unitPrice')} variant="2" size="sm" color="grey" weight="medium" />
            <Heading text={t('proforma:table.discount')} variant="2" size="sm" color="grey" weight="medium" />
            <div className="flex justify-end">
              <Heading text={t('proforma:table.lineTotal')} variant="2" size="sm" color="grey" weight="medium" />
            </div>
          </div>
        </div>

        {proforma.items?.map((item) => (
          <div key={item.proformaItemId} className="grid grid-cols-6 gap-x-4 py-2.5 border-b-1 border-b-light-grey-alt border-solid">
            <div className="col-span-2">
              <Paragraph text={item.name} size="sm" color="black" />
            </div>
            <Paragraph text={`${item.quantity}`} size="sm" color="black" />
            <Paragraph text={formatPrice(item.unitPrice)} size="sm" color="black" />
            <Paragraph text={`${formatMoney(item.discountPercent)}%`} size="sm" color="black" />
            <div className="flex justify-end">
              <Paragraph text={formatMoney(item.lineTotal)} size="sm" color="black" />
            </div>
          </div>
        ))}

        <div className="pt-4">
          <ProformaTotals netCents={Math.round(proforma.total * 100)} vatCents={Math.round(proforma.vatAmount * 100)} />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <MainButton text={t('g:button.okey')} variant="contained" size="medium" onClick={() => dispatch(removeModal())} />
      </div>
    </div>
  )
}

export default ProformaDetailModal
