import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import DataSection from '@/src/components/section/DataSection'
import FeaturedTab from '@/src/components/website/FeaturedTab'
import SectionTab, { SectionField } from '@/src/components/website/SectionTab'
import TextSectionForm from '@/src/components/website/TextSectionForm'
import WebsiteImageField, { ImageKind } from '@/src/components/website/WebsiteImageField'
import { ModalEnums } from '@/src/enum'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsitePage, IWebsiteSection, SectionType } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { sectionLabel } from '@/src/utils/website'
import { HERO_VALIDATION, INFO_VALIDATION, STORY_VALIDATION } from '@/src/validations/website/website'

type TextsConfig = {
  fields: SectionField[]
  validation: unknown
  image: { kind: ImageKind; label: string; hint: string; previewClass: string }
  toggle?: { name: string; label: string; fields: string[] }
}

// the texts and the picture of every kind of section, except the recommended drinks and the free text (they have their own forms)
const TEXTS: Record<Exclude<SectionType, 'featured' | 'text' | 'contact'>, TextsConfig> = {
  hero: {
    fields: [
      { name: 'title', label: 'website:fields.title', placeholder: 'website:placeholders.hero.title' },
      { name: 'subtitle', label: 'website:fields.subtitle', placeholder: 'website:placeholders.hero.subtitle' },
      { name: 'text', label: 'website:fields.text', placeholder: 'website:placeholders.hero.text', isTextarea: true },
      { name: 'buttonText', label: 'website:fields.buttonText', placeholder: 'website:placeholders.hero.buttonText' },
    ],
    validation: HERO_VALIDATION,
    // the button is shown unless it is turned off, then it needs no text
    toggle: { name: 'showButton', label: 'website:fields.showButton', fields: ['buttonText'] },
    image: { kind: 'hero', label: 'website:image.hero', hint: 'website:image.hintHero', previewClass: 'aspect-video w-full max-w-md' },
  },
  story: {
    fields: [
      { name: 'title', label: 'website:fields.title', placeholder: 'website:placeholders.story.title' },
      { name: 'paragraph1', label: 'website:fields.paragraph1', placeholder: 'website:placeholders.story.paragraph1', isTextarea: true },
      { name: 'paragraph2', label: 'website:fields.paragraph2', placeholder: 'website:placeholders.story.paragraph2', isTextarea: true },
      { name: 'buttonText', label: 'website:fields.buttonText', placeholder: 'website:placeholders.story.buttonText' },
    ],
    validation: STORY_VALIDATION,
    image: { kind: 'story', label: 'website:image.story', hint: 'website:image.hintStory', previewClass: 'aspect-[4/3] w-64' },
  },
  info: {
    fields: [
      { name: 'title', label: 'website:fields.title', placeholder: 'website:placeholders.info.title' },
      { name: 'text', label: 'website:fields.text', placeholder: 'website:placeholders.info.text', isTextarea: true },
      { name: 'buttonText', label: 'website:fields.buttonText', placeholder: 'website:placeholders.info.buttonText' },
    ],
    validation: INFO_VALIDATION,
    image: { kind: 'info', label: 'website:image.info', hint: 'website:image.hintInfo', previewClass: 'aspect-[4/5] w-48' },
  },
}

type Props = {
  section: IWebsiteSection
  // the pages the section is on: a change shows on all of them
  pages: IWebsitePage[]
  onBack: () => void
}

/** The texts and the picture of one section. The same section can be on more pages, a change shows on all of them */
const SectionEditor = ({ section, pages, onBack }: Props) => {
  const { t } = useTranslation(['website', 'g'])
  const run = useWebsiteAction()
  const dispatch = useAppDispatch()
  const { updateSection, deleteSection } = useWebsiteService()
  const config = section.type === 'featured' || section.type === 'text' || section.type === 'contact' ? null : TEXTS[section.type]

  const handleDelete = () =>
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('website:section.deleteTitle', { name: sectionLabel(section, t) }),
          message: pages.length > 1 ? t('website:section.deleteShared', { count: pages.length }) : t('website:section.deleteMessage'),
          confirmText: t('website:section.delete'),
          onConfirm: async () => {
            if (await run(() => deleteSection(section.sectionId), t('website:section.deleted'))) onBack()
          },
        } satisfies ConfirmModalData,
      }),
    )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MainButton text={`← ${t('website:section.back')}`} variant="alternative" size="small" htmlType="button" onClick={onBack} />
        <MainButton text={t('website:section.delete')} variant="outlined" size="small" htmlType="button" onClick={handleDelete} />
      </div>

      {pages.length > 1 && (
        <Paragraph
          text={t('website:section.shared', { pages: pages.map((page) => page.title).join(', ') })}
          size="sm"
          color="grey"
          className="mt-4 rounded-sm bg-light-grey-transparent px-3 py-2"
        />
      )}

      {config ? (
        <>
          <SectionTab
            title={t(`website:types.${section.type}`)}
            subtitle={t(`website:typeHints.${section.type}`)}
            fields={config.fields}
            saved={{ ...section.content, drinkIds: undefined }}
            validation={config.validation}
            toggle={config.toggle}
            onSave={(values) => run(() => updateSection(section.sectionId, values))}
          />
          <DataSection title={t(config.image.label)}>
            <WebsiteImageField
              path={`sections/${section.sectionId}/image`}
              kind={config.image.kind}
              image={section.image}
              label={t(config.image.label)}
              hint={t(config.image.hint, { maxMb: 5 })}
              previewClass={config.image.previewClass}
            />
          </DataSection>
        </>
      ) : section.type === 'contact' ? (
        // nothing to edit: the phone, Instagram and map come from the general data of the site
        <DataSection title={t('website:types.contact')}>
          <Paragraph text={t('website:typeHints.contact')} size="sm" color="grey" />
        </DataSection>
      ) : section.type === 'text' ? (
        <TextSectionForm section={section} />
      ) : (
        <FeaturedTab section={section} />
      )}
    </div>
  )
}

export default SectionEditor
