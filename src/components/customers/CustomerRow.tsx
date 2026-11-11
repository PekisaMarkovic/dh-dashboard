import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown, ICustomer } from '@/src/interfaces'
import { formatDate } from '@/src/utils/date'

type Props = {
  customer: ICustomer
  dropdownOptions: CustomDropdown[]
}

const CustomerRow = ({ customer, dropdownOptions }: Props) => {
  const { t } = useTranslation(['customer'])

  return (
    <DefaultTableRowContainer cols={3} dropdownOptions={dropdownOptions}>
      <TableCell isTitle label={t('customer:table.name')} className="col-span-2">
        <Paragraph text={customer.name} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('customer:table.createdAt')}>
        <Paragraph text={formatDate(customer.createdAt)} size="sm" color="black" noWrap />
      </TableCell>
    </DefaultTableRowContainer>
  )
}

export default CustomerRow
