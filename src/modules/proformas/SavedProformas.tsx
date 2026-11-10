import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProformaApis from '@/src/api/proformas'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import MainButton from '@/src/components/core/buttons/MainButton'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePagedList } from '@/src/hooks/use-paged-list'
import DataSection from '@/src/components/section/DataSection'
import { ModalEnums } from '@/src/enum'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { useApi } from '@/src/hooks/use-api'
import { useRoles } from '@/src/hooks/use-roles'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import { CustomDropdown, IProforma } from '@/src/interfaces'
import { downloadBlob } from '@/src/utils/files'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { openModal, refresh, selectModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'
import { formatMoney } from '@/src/utils/money'

const SavedProformas = () => {
  const { t } = useTranslation(['proforma', 'g'])
  const api = useApi()
  const dispatch = useAppDispatch()
  const { isAdmin } = useRoles()
  const { refreshKey } = useAppSelector(selectModal)
  const [proformas, setProformas] = useState<IProforma[]>([])
  const { pageItems, page, setPage, totalPages } = usePagedList(proformas)

  useEffect(() => {
    api
      .get<IProforma[]>(ProformaApis.getProformas())
      .then(({ data }) => setProformas(data))
      .catch(() => customToast.error(t('g:errorMessage')))
  }, [refreshKey])

  const handleDownload = async (proforma: IProforma) => {
    try {
      const { data } = await api.get<Blob>(ProformaApis.getProformaPdf(proforma.proformaId), { responseType: 'blob' })
      downloadBlob(data, `${proforma.number}.pdf`)
    } catch {
      customToast.error(t('g:errorMessage'))
    }
  }

  const returnToStock = async (proforma: IProforma) => {
    try {
      await api.post(ProformaApis.returnProforma(proforma.proformaId))
      customToast.success(t('proforma:returnedToast', { number: proforma.number }))
      // the stock changed, so everything that shows drinks reloads
      dispatch(refresh())
    } catch {
      customToast.error(t('g:errorMessage'))
      dispatch(refresh())
    }
  }

  const handleReturn = (proforma: IProforma) =>
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('proforma:return.title'),
          message: t('proforma:return.message', { number: proforma.number }),
          confirmText: t('proforma:return.confirm'),
          danger: false,
          onConfirm: () => returnToStock(proforma),
        } satisfies ConfirmModalData,
      }),
    )

  const options = (proforma: IProforma): CustomDropdown[] => [
    { content: { type: 'button', text: t('proforma:download'), onClick: () => handleDownload(proforma) } },
    // only admins, and only while the drinks are still taken off the stock
    ...(isAdmin && proforma.status === 'active'
      ? [{ content: { type: 'button', text: t('proforma:return.option'), onClick: () => handleReturn(proforma) } } satisfies CustomDropdown]
      : []),
  ]

  return (
    <DataSection
      title={t('proforma:saved.title')}
      subtitle={t('proforma:saved.subtitle')}
      element={
        <div className="mb-6">
          <MainButton
            text={t('proforma:create')}
            variant="contained"
            size="medium"
            onClick={() => dispatch(openModal({ modal: ModalEnums.CREATE_PROFORMA }))}
          />
        </div>
      }
    >
      <div className="border-b-1 border-b-light-grey-alt border-solid px-4 pb-3 pt-2">
        <div className="grid grid-cols-7">
          <Heading text={t('proforma:saved.number')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:saved.date')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:saved.warehouse')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:saved.createdBy')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:saved.total')} variant="2" size="sm" color="grey" weight="medium" />
          <Heading text={t('proforma:saved.status')} variant="2" size="sm" color="grey" weight="medium" />
          <span />
        </div>
      </div>

      {pageItems.map((p) => (
        <DefaultTableRowContainer
          key={p.proformaId}
          cols={7}
          onRowClick={() => dispatch(openModal({ modal: ModalEnums.PROFORMA_DETAIL, data: { proformaId: p.proformaId } }))}
          dropdownOptions={options(p)}
        >
          <div className="py-3">
            <Paragraph text={p.number} size="sm" color="black" />
          </div>
          <div className="py-3">
            <Paragraph text={formatDate(p.createdAt)} size="sm" color="black" />
          </div>
          <div className="py-3">
            <Paragraph text={p.warehouseName} size="sm" color="black" />
          </div>
          <div className="py-3">
            <Paragraph text={p.createdByName || ''} size="sm" color="black" />
          </div>
          <div className="py-3">
            <Paragraph text={formatMoney(p.total)} size="sm" color="black" />
          </div>
          <div className="py-3">
            <Paragraph text={t(`proforma:status.${p.status}`)} size="sm" color={p.status === 'returned' ? 'orange' : 'green'} />
          </div>
        </DefaultTableRowContainer>
      ))}

      {!proformas.length && <Paragraph text={t('proforma:saved.empty')} size="sm" className="mt-3" />}
      <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </DataSection>
  )
}

export default SavedProformas
