import { useTranslation } from 'react-i18next'
import TabBar from '@/src/components/core/navigation/TabBar'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import PageContentTab from '@/src/components/website/PageContentTab'
import PageSeoTab from '@/src/components/website/PageSeoTab'
import PageSettingsTab from '@/src/components/website/PageSettingsTab'
import { IWebsite, IWebsitePage } from '@/src/interfaces'
import { missingOf, PageTab } from '@/src/utils/website'

type Props = {
  website: IWebsite
  page: IWebsitePage
  tab: PageTab
  onTab: (tab: PageTab) => void
  onEditSection: (sectionId: number) => void
  onDeleted: () => void
}

/** One page of the site: its name, its address and its status on top, then the tabs content, SEO and settings */
const PageEditor = ({ website, page, tab, onTab, onEditSection, onDeleted }: Props) => {
  const { t } = useTranslation(['website'])
  const isPublished = page.status === 'published'

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Heading variant="2" text={page.title} size="lg" color="black" />
          <Paragraph text={`/${page.slug}`} size="sm" className="mt-1" />
        </div>
        <span className={`font-poppins flex items-center gap-2 text-sm ${isPublished ? 'text-green' : 'text-dark-orange'}`}>
          <span className={`h-2 w-2 rounded-full ${isPublished ? 'bg-green' : 'bg-orange'}`} />
          {isPublished ? t('website:page.statusPublished') : t('website:page.statusDraft')}
        </span>
      </div>

      <div className="mt-4">
        <TabBar
          label={t('website:page.tabs')}
          active={tab}
          onChange={onTab}
          tabs={[
            {
              id: 'content',
              label: t('website:page.content'),
              hasWarning: page.sections.some(({ sectionId }) => missingOf(website, `section.${sectionId}.`).length > 0),
            },
            { id: 'seo', label: t('website:page.seo'), hasWarning: missingOf(website, `page.${page.pageId}.`).length > 0 },
            { id: 'settings', label: t('website:page.settings') },
          ]}
        />
      </div>

      {tab === 'content' && <PageContentTab website={website} page={page} onEditSection={onEditSection} />}
      {tab === 'seo' && <PageSeoTab page={page} />}
      {tab === 'settings' && (
        <PageSettingsTab page={page} menuCount={website.pages.filter((p) => p.isInMenu).length} onDeleted={onDeleted} />
      )}
    </div>
  )
}

export default PageEditor
