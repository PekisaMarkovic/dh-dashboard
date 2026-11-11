import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import TableCell from '@/src/components/table/TableCell'
import { ICompanyUser } from '@/src/interfaces'
import { formatDate } from '@/src/utils/date'
import { getRoleTranslationKey } from '@/src/utils/roles'

type Props = {
  user: ICompanyUser
}

const CompanyUserRow = ({ user }: Props) => {
  const { t } = useTranslation(['company'])
  const roleKey = getRoleTranslationKey(user.roles)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-0 pl-1 pr-1 md:px-4 py-3 md:py-0 border-b-1 border-b-light-grey-alt border-solid last:border-b-0">
      <TableCell isTitle label={t('company:users.name')} className="col-span-2 md:col-span-1">
        <Paragraph text={`${user.firstName} ${user.lastName}`} size="sm" color="black" />
      </TableCell>
      <TableCell isTitle label={t('company:users.email')} className="col-span-2 md:col-span-1 -mt-1.5 md:mt-0">
        <Paragraph text={user.email} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('company:users.role')}>
        <Paragraph text={roleKey ? t(roleKey) : ''} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('company:users.joined')}>
        <Paragraph text={formatDate(user.createdAt)} size="sm" color="black" />
      </TableCell>
    </div>
  )
}

export default CompanyUserRow
