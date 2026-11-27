import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import EmptyComponent from '@/src/components/core/empty/EmptyComponent'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import InfoGridSkeleton from '@/src/components/skeleton/InfoGridSkeleton'
import ContactsTab from '@/src/components/website/ContactsTab'
import GeneralTab from '@/src/components/website/GeneralTab'
import PageEditor from '@/src/components/website/PageEditor'
import PagesSidebar from '@/src/components/website/PagesSidebar'
import PublishPanel from '@/src/components/website/PublishPanel'
import SectionEditor from '@/src/components/website/SectionEditor'
import { useWebsiteQuery } from '@/src/hooks/queries/use-website-queries'
import { PAGE_TABS, PageTab, pagesOfSection } from '@/src/utils/website'

const SITE_VIEWS = ['general', 'contacts'] as const
type SiteView = (typeof SITE_VIEWS)[number]

const oneOf = <T extends string>(values: readonly T[], value: string | null, fallback: T): T => (values.includes(value as T) ? (value as T) : fallback)

/**
 * "Web sajt": the pages of the site on the left, the open page (its sections, SEO and settings) or the settings of the site on the right.
 * What is open is in the address (?page=3&tab=seo, ?page=3&section=7, ?site=general, ?site=contacts), so a refresh or a link opens the same place.
 */
const Website = () => {
  const { t } = useTranslation(['website'])
  const [params, setParams] = useSearchParams()
  const { data: website, isPending } = useWebsiteQuery()

  if (isPending) return <InfoGridSkeleton items={6} />

  if (!website) return <EmptyComponent text={t('website:notEnabled')} />

  const siteView = params.get('site') ? oneOf(SITE_VIEWS, params.get('site'), 'general') : null
  // the open page: the one in the address, else the home page
  const page = siteView ? undefined : (website.pages.find((p) => String(p.pageId) === params.get('page')) ?? website.pages[0])
  const section = page && website.sections.find((s) => String(s.sectionId) === params.get('section'))

  const openPage = (pageId: number, extra: Record<string, string> = {}) => setParams({ page: String(pageId), ...extra }, { replace: true })
  const openSite = (view: SiteView) => setParams({ site: view }, { replace: true })

  return (
    <div className="pb-8">
      <div className="mb-4">
        <Heading variant="3" text={t('website:title')} size="base" color="black" />
        <Paragraph text={t('website:subtitle')} className="mt-2.5" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <div>
          <PagesSidebar
            website={website}
            activePageId={page?.pageId ?? null}
            activeSite={siteView}
            onPage={(pageId) => openPage(pageId)}
            onSiteSettings={() => openSite('general')}
            onContacts={() => openSite('contacts')}
          />
        </div>

        <div className="min-w-0">
          {page && section ? (
            <SectionEditor section={section} pages={pagesOfSection(website, section.sectionId)} onBack={() => openPage(page.pageId)} />
          ) : page ? (
            <PageEditor
              website={website}
              page={page}
              tab={oneOf(PAGE_TABS, params.get('tab'), 'content')}
              onTab={(tab: PageTab) => openPage(page.pageId, { tab })}
              onEditSection={(sectionId) => openPage(page.pageId, { section: String(sectionId) })}
              onDeleted={() => openPage(website.pages[0].pageId)}
            />
          ) : siteView === 'contacts' ? (
            <ContactsTab />
          ) : (
            <>
              <PublishPanel website={website} />
              <GeneralTab website={website} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Website
