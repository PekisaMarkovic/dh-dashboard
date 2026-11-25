import { useTranslation } from 'react-i18next'
import DataSection from '@/src/components/section/DataSection'
import SectionTab, { SectionField } from '@/src/components/website/SectionTab'
import WebsiteImageField from '@/src/components/website/WebsiteImageField'
import { IWebsite } from '@/src/interfaces'
import { HERO_VALIDATION } from '@/src/validations/website/website'

const FIELDS: SectionField[] = [
  { name: 'title', label: 'website:fields.title', placeholder: 'website:placeholders.hero.title' },
  { name: 'subtitle', label: 'website:fields.subtitle', placeholder: 'website:placeholders.hero.subtitle' },
  { name: 'text', label: 'website:fields.text', placeholder: 'website:placeholders.hero.text', isTextarea: true },
  { name: 'buttonText', label: 'website:fields.buttonText', placeholder: 'website:placeholders.hero.buttonText' },
]

const HeroTab = ({ website }: { website: IWebsite }) => {
  const { t } = useTranslation(['website'])

  return (
    <>
      <SectionTab
        section="hero"
        title={t('website:hero.title')}
        subtitle={t('website:hero.subtitle')}
        fields={FIELDS}
        saved={website.sections.hero}
        validation={HERO_VALIDATION}
      />
      <DataSection title={t('website:image.hero')}>
        <WebsiteImageField
          slot="hero"
          image={website.heroImage}
          label={t('website:image.hero')}
          hint={t('website:image.hintHero', { maxMb: 5 })}
          previewClass="aspect-video w-full max-w-md"
        />
      </DataSection>
    </>
  )
}

export default HeroTab
