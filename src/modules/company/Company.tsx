import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePageState } from '@/src/hooks/use-page-state'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import InfoGridSkeleton from '@/src/components/skeleton/InfoGridSkeleton'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import TableCell from '@/src/components/table/TableCell'
import DataSection from '@/src/components/section/DataSection'
import GeneralIcons from '@/src/icons/general'
import { useCompanyQuery, useCompanyUsersQuery, useInvitationsQuery } from '@/src/hooks/queries/use-company-queries'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useInvitationService } from '@/src/services/use-invitation-service'
import { CustomDropdown, ICompanyUser, IInvitation } from '@/src/interfaces'
import { ModalEnums } from '@/src/enum'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { selectAuthUser } from '@/src/state/user/authSlice'
import { getRoleTranslationKey } from '@/src/utils/roles'
import { formatDate } from '@/src/utils/date'
import { Color } from '@/src/interfaces'

const NO_USERS: ICompanyUser[] = []
const NO_INVITATIONS: IInvitation[] = []

const STATUS_COLOR: Record<IInvitation['status'], Color> = { pending: 'orange', accepted: 'green', expired: 'red' }

const Company = () => {
  const { t } = useTranslation(['company', 'g'])
  const showError = useErrorToast()
  const { resendInvitation: resend } = useInvitationService()
  const { afterInvitationChange } = useRefreshData()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectAuthUser)
  const companyId = user?.companyId
  // everything is cached: a visit after the first one shows it right away
  const companyQuery = useCompanyQuery(companyId)
  // the users and the invitations are loaded a page at a time by the api
  const [usersPage, setUsersPage] = usePageState()
  const [invitationsPage, setInvitationsPage] = usePageState()
  const usersQuery = useCompanyUsersQuery(companyId, { page: usersPage })
  const invitationsQuery = useInvitationsQuery({ page: invitationsPage })
  const company = companyQuery.data ?? null
  const users = usersQuery.data?.items ?? NO_USERS
  const invitations = invitationsQuery.data?.items ?? NO_INVITATIONS
  // a user without a company has nothing to wait for
  const isLoad = !companyId || (!companyQuery.isPending && !usersQuery.isPending && !invitationsQuery.isPending)

  // sends the email again and starts the 7 days again, the link stays the same
  const handleResend = (invitation: IInvitation) => async () => {
    try {
      await resend(invitation.invitationId)
      customToast.success(t('company:invitations.resent', { email: invitation.email }))
    } catch (error) {
      showError(error)
    }

    // the list is loaded again either way, e.g. the person may have registered in the meantime
    await afterInvitationChange()
  }

  const handleEdit = () => {
    if (company) dispatch(openModal({ modal: ModalEnums.COMPANY, data: { company } }))
  }

  const handleInvite = () => dispatch(openModal({ modal: ModalEnums.INVITE }))

  // only an invitation that was not used can be sent again (also an expired one)
  const invitationOptions = (invitation: IInvitation): CustomDropdown[] =>
    invitation.status === 'accepted'
      ? []
      : [{ content: { type: 'button', text: t('company:invitations.resend'), onClick: handleResend(invitation) } }]

  return (
    <div className="pb-8">
      <DataSection
        title={t('company:info.title')}
        subtitle={t('company:info.subtitle')}
        element={
          <div className="mb-6">
            <button
              type="button"
              title={t('company:info.edit')}
              aria-label={t('company:info.edit')}
              disabled={!company}
              onClick={handleEdit}
              className="flex items-center justify-center h-10 w-10 rounded-full border-1 border-solid border-light-grey-alt hover:bg-light-grey-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GeneralIcons type="Edit" />
            </button>
          </div>
        }
      >
        {!isLoad ? (
          <InfoGridSkeleton items={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
            {[
              { label: t('company:info.name'), value: company?.name },
              { label: t('company:info.street'), value: company?.street },
              { label: t('company:info.city'), value: company?.city },
              { label: t('company:info.pib'), value: company?.pib },
              { label: t('company:info.registrationNumber'), value: company?.registrationNumber },
              { label: t('company:info.phone'), value: company?.phone || t('company:info.noPhone') },
              { label: t('company:info.bankAccount'), value: company?.bankAccount },
              { label: t('company:info.created'), value: company ? formatDate(company.createdAt) : '' },
            ].map(({ label, value }) => (
              <div key={label}>
                <Paragraph text={label} size="sm" />
                <Heading text={value || '-'} variant="3" size="base" color="black" />
              </div>
            ))}
          </div>
        )}
      </DataSection>

      <DataSection
        title={t('company:users.title')}
        subtitle={t('company:users.subtitle')}
        element={
          <div className="mb-6">
            <MainButton text={t('company:users.addEmployee')} variant="contained" size="medium" onClick={handleInvite} />
          </div>
        }
      >
        {!isLoad ? (
          <TableSkeleton columns={[1, 1, 1, 1]} rows={4} />
        ) : (
          <>
            <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid px-4 pb-3 pt-2">
              <div className="grid grid-cols-4">
                <Heading text={t('company:users.name')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:users.email')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:users.role')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:users.joined')} variant="2" size="sm" color="grey" weight="medium" />
              </div>
            </div>
            {users.map((u) => (
              <div
                key={u.userId}
                className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-0 pl-1 pr-1 md:px-4 py-3 md:py-0 border-b-1 border-b-light-grey-alt border-solid"
              >
                <TableCell isTitle label={t('company:users.name')} className="col-span-2 md:col-span-1">
                  <Paragraph text={`${u.firstName} ${u.lastName}`} size="sm" color="black" />
                </TableCell>
                <TableCell isTitle label={t('company:users.email')} className="col-span-2 md:col-span-1 -mt-1.5 md:mt-0">
                  <Paragraph text={u.email} size="sm" color="black" />
                </TableCell>
                <TableCell label={t('company:users.role')}>
                  <Paragraph text={getRoleTranslationKey(u.roles) ? t(getRoleTranslationKey(u.roles)!) : ''} size="sm" color="black" />
                </TableCell>
                <TableCell label={t('company:users.joined')}>
                  <Paragraph text={formatDate(u.createdAt)} size="sm" color="black" />
                </TableCell>
              </div>
            ))}
            {!users.length && <Paragraph text={t('company:users.empty')} size="sm" className="mt-3" />}
            <ListPagination page={usersPage} totalPages={usersQuery.data?.meta.totalPages ?? 1} onPageChange={setUsersPage} />
          </>
        )}
      </DataSection>

      <DataSection title={t('company:invitations.title')} subtitle={t('company:invitations.subtitle')}>
        {!isLoad ? (
          <TableSkeleton columns={[1, 1, 1, 1, 0.4]} rows={3} />
        ) : (
          <>
            <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-10 pb-3 pt-2">
              <div className="grid grid-cols-5">
                <Heading text={t('company:invitations.email')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:invitations.status')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:invitations.sentAt')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:invitations.expiresAt')} variant="2" size="sm" color="grey" weight="medium" />
                <span />
              </div>
            </div>
            {invitations.map((i) => (
              <DefaultTableRowContainer key={i.invitationId} cols={5} dropdownOptions={invitationOptions(i)}>
                <TableCell isTitle label={t('company:invitations.email')} className="col-span-2 md:col-span-1 md:pr-4">
                  <Paragraph text={i.email} size="sm" color="black" />
                </TableCell>
                {/* status and dates in one row on a phone, on a tablet and up they are columns of the table */}
                <div className="col-span-2 grid grid-cols-3 gap-x-3 md:contents">
                  <TableCell label={t('company:invitations.status')}>
                    <Paragraph text={t(`company:invitations.${i.status}`)} size="sm" color={STATUS_COLOR[i.status]} />
                  </TableCell>
                  <TableCell label={t('company:invitations.sentAt')}>
                    <Paragraph text={formatDate(i.sentAt)} size="sm" color="black" />
                  </TableCell>
                  <TableCell label={t('company:invitations.expiresAt')}>
                    <Paragraph text={formatDate(i.expiresAt)} size="sm" color="black" />
                  </TableCell>
                </div>
              </DefaultTableRowContainer>
            ))}
            {!invitations.length && <Paragraph text={t('company:invitations.empty')} size="sm" className="mt-3" />}
            <ListPagination page={invitationsPage} totalPages={invitationsQuery.data?.meta.totalPages ?? 1} onPageChange={setInvitationsPage} />
          </>
        )}
      </DataSection>
    </div>
  )
}

export default Company
