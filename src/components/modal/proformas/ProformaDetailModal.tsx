import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProformaApis from '@/src/api/proformas'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { useApi } from '@/src/hooks/use-api'
import { IProforma } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'
import { formatMoney } from '@/src/utils/money'

const ProformaDetailModal = () => {
  const { t } = useTranslation(['proforma', 'g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectModal)
  const proformaId = (data as { proformaId: number } | null)?.proformaId
  const [proforma, setProforma] = useState<IProforma | null>(null)

  useEffect(() => {
    if (!proformaId) return

    api
      .get<IProforma>(ProformaApis.getProforma(proformaId))
      .then(({ data: result }) => setProforma(result))
      .catch(() => {
        customToast.error(t('g:errorMessage'))
        dispatch(removeModal())
      })
  }, [proformaId])

  if (!proforma) return null

  return (
    <div className="w-[640px] max-w-full">
      <Heading text={t('proforma:detail.title', { number: proforma.number })} variant="2" size="base" color="black" />
      <Paragraph
        text={`${t('proforma:detail.warehouse')}: ${proforma.warehouseName} · ${t('proforma:detail.date')}: ${formatDate(proforma.createdAt)} · ${t('proforma:saved.status')}: ${t(`proforma:status.${proforma.status}`)}`}
        size="sm"
        color="grey"
        className="mt-1"
      />

      <div className="mt-6">
        <div className="border-b-1 border-b-light-grey-alt border-solid pb-2">
          <div className="grid grid-cols-5 gap-x-4">
            <div className="col-span-2">
              <Heading text={t('proforma:table.name')} variant="2" size="sm" color="grey" weight="medium" />
            </div>
            <Heading text={t('proforma:table.quantity')} variant="2" size="sm" color="grey" weight="medium" />
            <Heading text={t('proforma:table.unitPrice')} variant="2" size="sm" color="grey" weight="medium" />
            <div className="flex justify-end">
              <Heading text={t('proforma:table.lineTotal')} variant="2" size="sm" color="grey" weight="medium" />
            </div>
          </div>
        </div>

        {proforma.items?.map((item) => (
          <div key={item.proformaItemId} className="grid grid-cols-5 gap-x-4 py-2.5 border-b-1 border-b-light-grey-alt border-solid">
            <div className="col-span-2">
              <Paragraph text={item.name} size="sm" color="black" />
            </div>
            <Paragraph text={`${item.quantity}`} size="sm" color="black" />
            <Paragraph text={formatMoney(item.unitPrice)} size="sm" color="black" />
            <div className="flex justify-end">
              <Paragraph text={formatMoney(item.lineTotal)} size="sm" color="black" />
            </div>
          </div>
        ))}

        <div className="flex items-baseline justify-end gap-x-3 pt-4">
          <Heading text={t('proforma:total')} variant="3" size="base" color="grey" />
          <Heading text={formatMoney(proforma.total)} variant="3" size="2xl" color="black" />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <MainButton text={t('g:button.okey')} variant="contained" size="medium" onClick={() => dispatch(removeModal())} />
      </div>
    </div>
  )
}

export default ProformaDetailModal
