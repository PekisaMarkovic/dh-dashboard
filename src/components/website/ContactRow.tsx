import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { IWebsiteContact } from '@/src/interfaces'
import { formatDate } from '@/src/utils/date'

// one message from the contact form of the site: the date, the name, the phone, the email and the message
const ContactRow = ({ contact }: { contact: IWebsiteContact }) => {
  const { t } = useTranslation(['website'])

  return (
    <DefaultTableRowContainer cols={6} isOptionsHidden>
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
  )
}

export default ContactRow
