import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import PurchaseImportStatusPill from '@/src/components/purchase-import/PurchaseImportStatusPill'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown } from '@/src/interfaces'
import { IPurchaseImport } from '@/src/services/use-purchase-import-service'
import { formatDate } from '@/src/utils/date'
import { getImportName } from '@/src/utils/purchase-import'

type Props = {
  item: IPurchaseImport
  onOpen: () => void
  dropdownOptions: CustomDropdown[]
}

// one uploaded document: a row of the table on a wide screen, a card on a phone
const PurchaseImportRow = ({ item, onOpen, dropdownOptions }: Props) => {
  const { t } = useTranslation(['purchase'])
  return (
    <DefaultTableRowContainer cols={5} onRowClick={onOpen} dropdownOptions={dropdownOptions}>
      <TableCell isTitle label={t('purchase:history.table.document')} className="col-span-2 order-first md:order-none">
        <Paragraph text={getImportName(item)} size="sm" color="black" />
        <Paragraph text={`${item.warehouseName} · ${item.userName}`} size="xs" noWrap className="mt-0.5" />
      </TableCell>

      <TableCell label={t('purchase:history.table.date')}>
        <Paragraph text={formatDate(item.createdAt)} size="sm" color="black" noWrap />
      </TableCell>

      <TableCell label={t('purchase:history.table.lines')}>
        <Paragraph text={t('purchase:history.lines', { applied: item.appliedCount, count: item.linesCount })} size="sm" color="black" noWrap />
      </TableCell>

      <TableCell label={t('purchase:history.table.status')} className="md:flex md:items-center">
        <PurchaseImportStatusPill status={item.status} linesCount={item.linesCount} appliedCount={item.appliedCount} />
      </TableCell>
    </DefaultTableRowContainer>
  )
}

export default PurchaseImportRow
