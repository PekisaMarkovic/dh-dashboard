import { useTranslation } from 'react-i18next'
import DataSection from '@/src/components/section/DataSection'
import SectionTab, { SectionField } from '@/src/components/website/SectionTab'
import WebsiteImageField from '@/src/components/website/WebsiteImageField'
import { IWebsite } from '@/src/interfaces'
import { SEO_VALIDATION } from '@/src/validations/website/website'

const FIELDS: SectionField[] = [
  { name: 'title', label: 'website:seo.fields.title', placeholder: 'website:placeholders.seo.title' },
  { name: 'description', label: 'website:seo.fields.description', placeholder: 'website:placeholders.seo.description', isTextarea: true, maxChar: 160 },
  { name: 'menuTitle', label: 'website:seo.fields.menuTitle', placeholder: 'website:placeholders.seo.menuTitle' },
  { name: 'menuDescription', label: 'website:seo.fields.menuDescription', placeholder: 'website:placeholders.seo.menuDescription', isTextarea: true, maxChar: 160 },
]

// "SEO": what Google shows in the results and what is shown when the site is shared, and the favicon (it is the logo)
const SeoTab = ({ website }: { website: IWebsite }) => {
  const { t } = useTranslation(['website'])

  return (
    <>
      <SectionTab
        section="seo"
        title={t('website:seo.title')}
        subtitle={t('website:seo.subtitle')}
        fields={FIELDS}
        saved={website.sections.seo}
        validation={SEO_VALIDATION}
      />
      <DataSection title={t('website:image.og')} subtitle={t('website:seo.ogSubtitle')}>
        <WebsiteImageField
          slot="og"
          image={website.ogImage}
          label={t('website:image.og')}
          hint={t('website:image.hintOg', { maxMb: 5 })}
          previewClass="aspect-[1200/630] w-full max-w-md"
        />
      </DataSection>
    </>
  )
}

export default SeoTab
