import { useTranslation } from 'react-i18next'
import DataSection from '@/src/components/section/DataSection'
import SectionTab, { SectionField } from '@/src/components/website/SectionTab'
import WebsiteImageField from '@/src/components/website/WebsiteImageField'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsitePage } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { SEO_VALIDATION } from '@/src/validations/website/website'

const FIELDS: SectionField[] = [
  { name: 'title', label: 'website:seo.fields.title', placeholder: 'website:placeholders.seo.title' },
  { name: 'description', label: 'website:seo.fields.description', placeholder: 'website:placeholders.seo.description', isTextarea: true, maxChar: 160 },
]

// "SEO" of a page: what Google shows in the results and the picture shown when the page is shared
const PageSeoTab = ({ page }: { page: IWebsitePage }) => {
  const { t } = useTranslation(['website'])
  const run = useWebsiteAction()
  const { updatePage } = useWebsiteService()
  const isHome = page.slug === ''

  return (
    <>
      <SectionTab
        title={t('website:seo.title')}
        subtitle={t('website:seo.subtitle')}
        fields={FIELDS}
        saved={{ title: page.seo.title, description: page.seo.description }}
        validation={SEO_VALIDATION}
        onSave={(seo) => run(() => updatePage(page.pageId, { seo }))}
      />
      <DataSection title={t('website:image.og')} subtitle={isHome ? t('website:seo.ogSubtitle') : t('website:seo.ogSubtitlePage')}>
        <WebsiteImageField
          path={`pages/${page.pageId}/seo/image`}
          kind="og"
          image={page.seo.image}
          label={t('website:image.og')}
          hint={t('website:image.hintOg', { maxMb: 5 })}
          previewClass="aspect-[1200/630] w-full max-w-md"
          isRequired={isHome}
        />
      </DataSection>
    </>
  )
}

export default PageSeoTab
