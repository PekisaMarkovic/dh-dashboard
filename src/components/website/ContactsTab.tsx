import { useTranslation } from 'react-i18next'
import ListPagination from '@/src/components/core/paggination/ListPagination'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DataSection from '@/src/components/section/DataSection'
import TableSkeleton from '@/src/components/skeleton/TableSkeleton'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { useWebsiteContactsQuery } from '@/src/hooks/queries/use-website-queries'
import { usePageState } from '@/src/hooks/use-page-state'
import { IWebsiteContact } from '@/src/interfaces'
import { formatDate } from '@/src/utils/date'

const NO_CONTACTS: IWebsiteContact[] = []

// "Ko vas je kontaktirao": the messages from the contact form of the site, newest first
const ContactsTab = () => {
  const { t } = useTranslation(['website'])
  const [page, setPage] = usePageState()
  const { data, isPending } = useWebsiteContactsQuery({ page })
  const contacts = data?.items ?? NO_CONTACTS

  return (
    <DataSection title={t('website:contacts.title')} subtitle={t('website:contacts.subtitle')}>
      {isPending ? (
        <TableSkeleton columns={[1, 2, 2, 2, 4]} rows={5} />
      ) : !contacts.length ? (
        <Paragraph text={t('website:contacts.empty')} size="sm" />
      ) : (
        <div>
          <div className="hidden md:block border-b-1 border-b-light-grey-alt border-solid pl-4 pr-4 pb-3 pt-2">
            <div className="grid grid-cols-6 gap-x-3">
              <Heading text={t('website:contacts.date')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('website:contacts.name')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('website:contacts.phone')} variant="2" size="sm" color="grey" weight="medium" />
              <Heading text={t('website:contacts.email')} variant="2" size="sm" color="grey" weight="medium" />
              <div className="col-span-2">
                <Heading text={t('website:contacts.message')} variant="2" size="sm" color="grey" weight="medium" />
              </div>
            </div>
          </div>

          {contacts.map((contact) => (
            <DefaultTableRowContainer key={contact.contactId} cols={6} isOptionsHidden>
              <TableCell label={t('website:contacts.date')}>
                <Paragraph text={formatDate(contact.createdAt)} size="sm" color="black" noWrap />
              </TableCell>
              <TableCell isTitle label={t('website:contacts.name')} className="order-first md:order-none">
                <Paragraph text={contact.name} size="sm" color="black" />
              </TableCell>
              <TableCell label={t('website:contacts.phone')}>
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="font-poppins text-sm text-green hover:underline">
                  {contact.phone}
                </a>
              </TableCell>
              <TableCell label={t('website:contacts.email')}>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="font-poppins text-sm text-green hover:underline break-all">
                    {contact.email}
                  </a>
                ) : (
                  <Paragraph text="-" size="sm" color="black" />
                )}
              </TableCell>
              <TableCell label={t('website:contacts.message')} className="col-span-2">
                <p className="font-poppins text-sm text-black whitespace-pre-wrap break-words">{contact.message || t('website:contacts.noMessage')}</p>
              </TableCell>
            </DefaultTableRowContainer>
          ))}

          <ListPagination page={page} totalPages={data?.meta.totalPages ?? 1} onPageChange={setPage} />
        </div>
      )}
    </DataSection>
  )
}

export default ContactsTab
