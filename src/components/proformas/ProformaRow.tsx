import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown, IProforma } from '@/src/interfaces'
import { formatDate } from '@/src/utils/date'
import { formatMoney } from '@/src/utils/money'

type Props = {
  proforma: IProforma
  dropdownOptions: CustomDropdown[]
  onClick: () => void
}

const ProformaRow = ({ proforma, dropdownOptions, onClick }: Props) => {
  const { t } = useTranslation(['proforma'])

  return (
    <DefaultTableRowContainer cols={7} onRowClick={onClick} dropdownOptions={dropdownOptions}>
      <TableCell isTitle label={t('proforma:saved.number')} className="col-span-2 md:col-span-1">
        <Paragraph text={proforma.number} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('proforma:saved.date')}>
        <Paragraph text={formatDate(proforma.createdAt)} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('proforma:saved.warehouse')}>
        <Paragraph text={proforma.warehouseName} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('proforma:saved.createdBy')}>
        <Paragraph text={proforma.createdByName || ''} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('proforma:saved.total')}>
        <Paragraph text={formatMoney(proforma.totalWithVat)} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('proforma:saved.status')}>
        <Paragraph text={t(`proforma:status.${proforma.status}`)} size="sm" color={proforma.status === 'returned' ? 'orange' : 'green'} />
      </TableCell>
    </DefaultTableRowContainer>
  )
}

export default ProformaRow
