import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import ExistingSectionItem from '@/src/components/website/ExistingSectionItem'
import NewSectionButton from '@/src/components/website/NewSectionButton'
import PageSectionRow from '@/src/components/website/PageSectionRow'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsite, IWebsitePage, SectionType } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { isSectionMissing } from '@/src/utils/website'

const SECTION_TYPES: SectionType[] = ['hero', 'featured', 'story', 'info', 'text']

type Props = {
  website: IWebsite
  page: IWebsitePage
  onEditSection: (sectionId: number) => void
}

/** "Sadržaj": the sections of the page in order. Every change (order, visibility, add, remove) is saved right away */
const PageContentTab = ({ website, page, onEditSection }: Props) => {
  const { t } = useTranslation(['website'])
  const run = useWebsiteAction()
  const { setPageSections, createSection } = useWebsiteService()
  const [isAdding, setIsAdding] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const items = page.sections.map(({ sectionId, isVisible }) => ({ sectionId, isVisible }))
  const others = website.sections.filter((section) => !items.some((item) => item.sectionId === section.sectionId))

  const save = async (next: typeof items, doneText?: string) => {
    setIsBusy(true)
    const isDone = await run(() => setPageSections(page.pageId, next), doneText)
    setIsBusy(false)

    return isDone
  }

  const move = (index: number, step: -1 | 1) => {
    const next = [...items]
    ;[next[index], next[index + step]] = [next[index + step], next[index]]
    void save(next)
  }

  const toggle = (index: number) => void save(items.map((item, i) => (i === index ? { ...item, isVisible: !item.isVisible } : item)))

  const remove = (index: number) => void save(items.filter((_, i) => i !== index), t('website:content.removed'))

  const addNew = async (type: SectionType) => {
    setIsBusy(true)
    if (await run(() => createSection(page.pageId, type), t('website:content.added'))) setIsAdding(false)
    setIsBusy(false)
  }

  const addExisting = async (sectionId: number) => {
    if (await save([...items, { sectionId, isVisible: true }], t('website:content.added'))) setIsAdding(false)
  }

  return (
    <div className="mt-6">
      <Heading variant="3" text={t('website:content.title')} size="base" color="black" />
      <Paragraph text={t('website:content.subtitle')} className="mt-1" />

      <ol className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => {
          const section = website.sections.find((s) => s.sectionId === item.sectionId)

          return section ? (
            <PageSectionRow
              key={item.sectionId}
              section={section}
              isVisible={item.isVisible}
              isMissing={isSectionMissing(website, section.sectionId)}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              isBusy={isBusy}
              onEdit={() => onEditSection(section.sectionId)}
              onToggle={() => toggle(index)}
              onMove={(step) => move(index, step)}
              onRemove={() => remove(index)}
            />
          ) : null
        })}
      </ol>

      {!items.length && <Paragraph text={t('website:content.empty')} className="mt-4" />}

      {isAdding ? (
        <div className="mt-3 rounded-lg border-1 border-dashed border-green p-4">
          <Paragraph text={t('website:content.newSection')} size="sm" color="black" weight="medium" />
          <div className="mt-2 flex flex-wrap gap-2">
            {SECTION_TYPES.map((type) => (
              <NewSectionButton key={type} type={type} disabled={isBusy} onClick={() => void addNew(type)} />
            ))}
          </div>

          {others.length > 0 && (
            <>
              <Paragraph text={t('website:content.existingSection')} size="sm" color="black" weight="medium" className="mt-4" />
              <Paragraph text={t('website:content.existingHint')} size="sm" className="mt-1" />
              <ul className="mt-2 flex flex-col gap-2">
                {others.map((section) => (
                  <ExistingSectionItem key={section.sectionId} section={section} disabled={isBusy} onClick={() => void addExisting(section.sectionId)} />
                ))}
              </ul>
            </>
          )}

          <button type="button" onClick={() => setIsAdding(false)} className="font-poppins mt-4 text-sm text-dark-grey hover:text-black">
            {t('website:content.cancel')}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="font-poppins mt-3 w-full rounded-lg border-1 border-dashed border-green py-4 text-sm text-green hover:bg-green-transparent"
        >
          + {t('website:content.add')}
        </button>
      )}
    </div>
  )
}

export default PageContentTab
