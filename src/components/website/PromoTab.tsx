import { useTranslation } from 'react-i18next'
import DataSection from '@/src/components/section/DataSection'
import SectionTab, { SectionField } from '@/src/components/website/SectionTab'
import WebsiteImageField from '@/src/components/website/WebsiteImageField'
import { IWebsite } from '@/src/interfaces'
import { PROMO_VALIDATION } from '@/src/validations/website/website'

const FIELDS: SectionField[] = [
  { name: 'title', label: 'website:fields.title', placeholder: 'website:placeholders.promo.title' },
  { name: 'text', label: 'website:fields.text', placeholder: 'website:placeholders.promo.text', isTextarea: true },
  { name: 'buttonText', label: 'website:fields.buttonText', placeholder: 'website:placeholders.promo.buttonText' },
]

const PromoTab = ({ website }: { website: IWebsite }) => {
  const { t } = useTranslation(['website'])

  return (
    <>
      <SectionTab
        section="promo"
        title={t('website:promo.title')}
        subtitle={t('website:promo.subtitle')}
        fields={FIELDS}
        saved={website.sections.promo}
        validation={PROMO_VALIDATION}
      />
      <DataSection title={t('website:image.promo')}>
        <WebsiteImageField
          slot="promo"
          image={website.promoImage}
          label={t('website:image.promo')}
          hint={t('website:image.hintPromo', { maxMb: 5 })}
          previewClass="aspect-[4/5] w-48"
        />
      </DataSection>
    </>
  )
}

export default PromoTab
