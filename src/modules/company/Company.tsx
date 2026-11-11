import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import { usePagedList } from '@/src/hooks/use-paged-list'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import InfoGridSkeleton from '@/src/components/skeleton/InfoGridSkeleton'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
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
  const usersQuery = useCompanyUsersQuery(companyId)
  const invitationsQuery = useInvitationsQuery()
  const company = companyQuery.data ?? null
  const users = usersQuery.data ?? NO_USERS
  const invitations = invitationsQuery.data ?? NO_INVITATIONS
  // a user without a company has nothing to wait for
  const isLoad = !companyId || (!companyQuery.isPending && !usersQuery.isPending && !invitationsQuery.isPending)
  const usersPage = usePagedList(users)
  const invitationsPage = usePagedList(invitations)

  // sends the email again and starts the 7 days again, the link stays the same
  const resendInvitation = async (invitation: IInvitation) => {
    try {
      await resend(invitation.invitationId)
      customToast.success(t('company:invitations.resent', { email: invitation.email }))
    } catch (error) {
      showError(error)
    }

    // the list is loaded again either way, e.g. the person may have registered in the meantime
    await afterInvitationChange()
  }

  // only an invitation that was not used can be sent again (also an expired one)
  const invitationOptions = (invitation: IInvitation): CustomDropdown[] =>
    invitation.status === 'accepted'
      ? []
      : [{ content: { type: 'button', text: t('company:invitations.resend'), onClick: () => resendInvitation(invitation) } }]

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
              onClick={() => company && dispatch(openModal({ modal: ModalEnums.COMPANY, data: { company } }))}
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
          <div className="grid grid-cols-3 gap-4 gap-y-6">
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
            <MainButton
              text={t('company:users.addEmployee')}
              variant="contained"
              size="medium"
              onClick={() => dispatch(openModal({ modal: ModalEnums.INVITE }))}
            />
          </div>
        }
      >
        {!isLoad ? (
          <TableSkeleton columns={[1, 1, 1, 1]} rows={4} />
        ) : (
          <>
            <div className="border-b-1 border-b-light-grey-alt border-solid px-4 pb-3 pt-2">
              <div className="grid grid-cols-4">
                <Heading text={t('company:users.name')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:users.email')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:users.role')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:users.joined')} variant="2" size="sm" color="grey" weight="medium" />
              </div>
            </div>
            {usersPage.pageItems.map((u) => (
              <div key={u.userId} className="grid grid-cols-4 px-4 py-3 border-b-1 border-b-light-grey-alt border-solid">
                <Paragraph text={`${u.firstName} ${u.lastName}`} size="sm" color="black" />
                <Paragraph text={u.email} size="sm" color="black" />
                <Paragraph text={getRoleTranslationKey(u.roles) ? t(getRoleTranslationKey(u.roles)!) : ''} size="sm" color="black" />
                <Paragraph text={formatDate(u.createdAt)} size="sm" color="black" />
              </div>
            ))}
            {!users.length && <Paragraph text={t('company:users.empty')} size="sm" className="mt-3" />}
            <ListPagination page={usersPage.page} totalPages={usersPage.totalPages} onPageChange={usersPage.setPage} />
          </>
        )}
      </DataSection>

      <DataSection title={t('company:invitations.title')} subtitle={t('company:invitations.subtitle')}>
        {!isLoad ? (
          <TableSkeleton columns={[1, 1, 1, 1, 0.4]} rows={3} />
        ) : (
          <>
            <div className="border-b-1 border-b-light-grey-alt border-solid px-4 pb-3 pt-2">
              <div className="grid grid-cols-5">
                <Heading text={t('company:invitations.email')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:invitations.status')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:invitations.sentAt')} variant="2" size="sm" color="grey" weight="medium" />
                <Heading text={t('company:invitations.expiresAt')} variant="2" size="sm" color="grey" weight="medium" />
                <span />
              </div>
            </div>
            {invitationsPage.pageItems.map((i) => (
              <DefaultTableRowContainer key={i.invitationId} cols={5} dropdownOptions={invitationOptions(i)}>
                <div className="py-3">
                  <Paragraph text={i.email} size="sm" color="black" />
                </div>
                <div className="py-3">
                  <Paragraph text={t(`company:invitations.${i.status}`)} size="sm" color={STATUS_COLOR[i.status]} />
                </div>
                <div className="py-3">
                  <Paragraph text={formatDate(i.sentAt)} size="sm" color="black" />
                </div>
                <div className="py-3">
                  <Paragraph text={formatDate(i.expiresAt)} size="sm" color="black" />
                </div>
              </DefaultTableRowContainer>
            ))}
            {!invitations.length && <Paragraph text={t('company:invitations.empty')} size="sm" className="mt-3" />}
            <ListPagination page={invitationsPage.page} totalPages={invitationsPage.totalPages} onPageChange={invitationsPage.setPage} />
          </>
        )}
      </DataSection>
    </div>
  )
}

export default Company
