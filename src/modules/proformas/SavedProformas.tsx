import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import MainButton from '@/src/components/core/buttons/MainButton'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePageState } from '@/src/hooks/use-page-state'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import DataSection from '@/src/components/section/DataSection'
import { ModalEnums } from '@/src/enum'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { useProformasQuery } from '@/src/hooks/queries/use-proforma-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useProformaService } from '@/src/services/use-proforma-service'
import { useRoles } from '@/src/hooks/use-roles'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown, IProforma } from '@/src/interfaces'
import { useProformaDownload } from '@/src/hooks/use-proforma-download'
import { useProformaPrint } from '@/src/hooks/use-proforma-print'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'
import { formatMoney } from '@/src/utils/money'

const NO_PROFORMAS: IProforma[] = []

const SavedProformas = () => {
  const { t } = useTranslation(['proforma', 'g'])
  const showError = useErrorToast()
  const { returnProforma } = useProformaService()
  const downloadProforma = useProformaDownload()
  const printProforma = useProformaPrint()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAdmin } = useRoles()
  const { afterProformaChange } = useRefreshData()
  const [page, setPage] = usePageState()
  // every page is cached: the page before stays visible while the next one loads
  const { data, isPending } = useProformasQuery({ page })
  const proformas = data?.items ?? NO_PROFORMAS
  const isLoad = !isPending

  const handleDownload = (proforma: IProforma) => async () => {
    try {
      await downloadProforma(proforma)
    } catch (error) {
      showError(error)
    }
  }

  const handlePrint = (proforma: IProforma) => async () => {
    try {
      await printProforma(proforma.proformaId)
    } catch (error) {
      showError(error)
    }
  }

  const returnToStock = async (proforma: IProforma) => {
    try {
      await returnProforma(proforma.proformaId)
      customToast.success(t('proforma:returnedToast', { number: proforma.number }))
      // the stock changed, so everything that shows drinks reloads
      await afterProformaChange()
    } catch (error) {
      showError(error)
      await afterProformaChange()
    }
  }

  const handleReturn = (proforma: IProforma) => () =>
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

  const handleCreate = () => navigate(ROUTE_NAMES.createProforma)

  const options = (proforma: IProforma): CustomDropdown[] => [
    { content: { type: 'button', text: t('proforma:print'), onClick: handlePrint(proforma) } },
    { content: { type: 'button', text: t('proforma:download'), onClick: handleDownload(proforma) } },
    // only admins, and only while the drinks are still taken off the stock
    ...(isAdmin && proforma.status === 'active'
      ? [{ content: { type: 'button', text: t('proforma:return.option'), onClick: handleReturn(proforma) } } satisfies CustomDropdown]
      : []),
  ]

  return (
    <DataSection
      title={t('proforma:saved.title')}
      subtitle={t('proforma:saved.subtitle')}
      element={
        <div className="mb-6">
          <MainButton text={t('proforma:create')} variant="contained" size="medium" onClick={handleCreate} />
        </div>
      }
    >
      {!isLoad ? (
        <TableSkeleton columns={[1, 1, 1, 1, 1, 1, 0.3]} rows={8} />
      ) : (
        <>
          <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
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

          {proformas.map((p) => (
            <DefaultTableRowContainer
              key={p.proformaId}
              cols={7}
              onRowClick={() => dispatch(openModal({ modal: ModalEnums.PROFORMA_DETAIL, data: { proformaId: p.proformaId } }))}
              dropdownOptions={options(p)}
            >
              <TableCell isTitle label={t('proforma:saved.number')} className="col-span-2 md:col-span-1">
                <Paragraph text={p.number} size="sm" color="black" />
              </TableCell>
              <TableCell label={t('proforma:saved.date')}>
                <Paragraph text={formatDate(p.createdAt)} size="sm" color="black" />
              </TableCell>
              <TableCell label={t('proforma:saved.warehouse')}>
                <Paragraph text={p.warehouseName} size="sm" color="black" />
              </TableCell>
              <TableCell label={t('proforma:saved.createdBy')}>
                <Paragraph text={p.createdByName || ''} size="sm" color="black" />
              </TableCell>
              <TableCell label={t('proforma:saved.total')}>
                <Paragraph text={formatMoney(p.totalWithVat)} size="sm" color="black" />
              </TableCell>
              <TableCell label={t('proforma:saved.status')}>
                <Paragraph text={t(`proforma:status.${p.status}`)} size="sm" color={p.status === 'returned' ? 'orange' : 'green'} />
              </TableCell>
            </DefaultTableRowContainer>
          ))}

          {!proformas.length && <Paragraph text={t('proforma:saved.empty')} size="sm" className="mt-3" />}
          <ListPagination page={page} totalPages={data?.meta.totalPages ?? 1} onPageChange={setPage} />
        </>
      )}
    </DataSection>
  )
}

export default SavedProformas
