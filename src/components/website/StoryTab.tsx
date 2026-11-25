import { useTranslation } from 'react-i18next'
import DataSection from '@/src/components/section/DataSection'
import SectionTab, { SectionField } from '@/src/components/website/SectionTab'
import WebsiteImageField from '@/src/components/website/WebsiteImageField'
import { IWebsite } from '@/src/interfaces'
import { STORY_VALIDATION } from '@/src/validations/website/website'

const FIELDS: SectionField[] = [
  { name: 'title', label: 'website:fields.title', placeholder: 'website:placeholders.story.title' },
  { name: 'paragraph1', label: 'website:fields.paragraph1', placeholder: 'website:placeholders.story.paragraph1', isTextarea: true },
  { name: 'paragraph2', label: 'website:fields.paragraph2', placeholder: 'website:placeholders.story.paragraph2', isTextarea: true },
  { name: 'buttonText', label: 'website:fields.buttonText', placeholder: 'website:placeholders.story.buttonText' },
]

const StoryTab = ({ website }: { website: IWebsite }) => {
  const { t } = useTranslation(['website'])

  return (
    <>
      <SectionTab
        section="story"
        title={t('website:story.title')}
        subtitle={t('website:story.subtitle')}
        fields={FIELDS}
        saved={website.sections.story}
        validation={STORY_VALIDATION}
      />
      <DataSection title={t('website:image.story')}>
        <WebsiteImageField
          slot="story"
          image={website.storyImage}
          label={t('website:image.story')}
          hint={t('website:image.hintStory', { maxMb: 5 })}
          previewClass="aspect-[4/3] w-64"
        />
      </DataSection>
    </>
  )
}

export default StoryTab
