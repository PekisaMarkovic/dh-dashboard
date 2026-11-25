import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import EmptyComponent from '@/src/components/core/empty/EmptyComponent'
import TabBar from '@/src/components/core/navigation/TabBar'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import InfoGridSkeleton from '@/src/components/skeleton/InfoGridSkeleton'
import ContactsTab from '@/src/components/website/ContactsTab'
import FeaturedTab from '@/src/components/website/FeaturedTab'
import GeneralTab from '@/src/components/website/GeneralTab'
import HeroTab from '@/src/components/website/HeroTab'
import PublishPanel from '@/src/components/website/PublishPanel'
import PromoTab from '@/src/components/website/PromoTab'
import StoryTab from '@/src/components/website/StoryTab'
import { useWebsiteQuery } from '@/src/hooks/queries/use-website-queries'

const TABS = ['general', 'hero', 'featured', 'story', 'promo', 'contacts'] as const
type TabId = (typeof TABS)[number]

const isTab = (value: string | null): value is TabId => TABS.includes(value as TabId)

// "Web sajt": the pages of the white label site of the company, every tab is one section of the site
const Website = () => {
  const { t } = useTranslation(['website'])
  const [params, setParams] = useSearchParams()
  const tab: TabId = isTab(params.get('tab')) ? (params.get('tab') as TabId) : 'general'
  const { data: website, isPending } = useWebsiteQuery()

  // the tab is in the address (?tab=hero), so a refresh or a link opens the same tab
  const handleTab = (id: TabId) => setParams({ tab: id }, { replace: true })

  if (isPending) return <InfoGridSkeleton items={6} />

  if (!website) return <EmptyComponent text={t('website:notEnabled')} />

  return (
    <div className="pb-8">
      <div className="mb-4">
        <Heading variant="3" text={t('website:title')} size="base" color="black" />
        <Paragraph text={t('website:subtitle')} className="mt-2.5" />
      </div>

      <PublishPanel website={website} />

      <TabBar
        label={t('website:tabs.label')}
        active={tab}
        onChange={handleTab}
        tabs={TABS.map((id) => ({
          id,
          label: t(`website:tabs.${id}`),
          // a dot on the tab when something on it is missing
          hasWarning: website.completeness.missing.some((key) => key.startsWith(`${id}.`)),
        }))}
      />

      {tab === 'general' && <GeneralTab website={website} />}
      {tab === 'hero' && <HeroTab website={website} />}
      {tab === 'featured' && <FeaturedTab website={website} />}
      {tab === 'story' && <StoryTab website={website} />}
      {tab === 'promo' && <PromoTab website={website} />}
      {tab === 'contacts' && <ContactsTab />}
    </div>
  )
}

export default Website
