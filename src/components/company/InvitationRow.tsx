import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { Color, CustomDropdown, IInvitation } from '@/src/interfaces'
import { formatDate } from '@/src/utils/date'

const STATUS_COLOR: Record<IInvitation['status'], Color> = { pending: 'orange', accepted: 'green', expired: 'red' }

type Props = {
  invitation: IInvitation
  dropdownOptions: CustomDropdown[]
}

const InvitationRow = ({ invitation, dropdownOptions }: Props) => {
  const { t } = useTranslation(['company'])

  return (
    <DefaultTableRowContainer cols={5} dropdownOptions={dropdownOptions}>
      <TableCell isTitle label={t('company:invitations.email')} className="col-span-2 md:col-span-1 md:pr-4">
        <Paragraph text={invitation.email} size="sm" color="black" />
      </TableCell>
      {/* status and dates in one row on a phone, on a tablet and up they are columns of the table */}
      <div className="col-span-2 grid grid-cols-3 gap-x-3 md:contents">
        <TableCell label={t('company:invitations.status')}>
          <Paragraph text={t(`company:invitations.${invitation.status}`)} size="sm" color={STATUS_COLOR[invitation.status]} />
        </TableCell>
        <TableCell label={t('company:invitations.sentAt')}>
          <Paragraph text={formatDate(invitation.sentAt)} size="sm" color="black" />
        </TableCell>
        <TableCell label={t('company:invitations.expiresAt')}>
          <Paragraph text={formatDate(invitation.expiresAt)} size="sm" color="black" />
        </TableCell>
      </div>
    </DefaultTableRowContainer>
  )
}

export default InvitationRow
