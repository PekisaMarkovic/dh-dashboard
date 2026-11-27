import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import IconButton from '@/src/components/website/IconButton'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsite, IWebsitePage, SectionType } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { isSectionMissing, sectionLabel } from '@/src/utils/website'

const SECTION_TYPES: SectionType[] = ['hero', 'featured', 'story', 'info']

// a line icon for every kind of section
const TYPE_ICONS: Record<SectionType, JSX.Element> = {
  hero: <path d="M3 5h18v14H3zM3 9h18" />,
  featured: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  story: <path d="M4 6h16M4 10h16M4 14h10M4 18h12" />,
  info: <path d="M3 11v2l13 5V6L3 11zM16 9h2a3 3 0 0 1 0 6h-2" />,
}

const TypeIcon = ({ type }: { type: SectionType }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-grey-transparent text-grey-secondary">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {TYPE_ICONS[type]}
    </svg>
  </span>
)

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

          if (!section) return null

          return (
            <li key={item.sectionId} className="flex items-center gap-3 rounded-lg border-1 border-solid border-light-grey-alt bg-white p-3">
              <TypeIcon type={section.type} />
              <button type="button" onClick={() => onEditSection(section.sectionId)} className="flex min-w-0 flex-1 flex-col text-left">
                <span className="font-poppins truncate text-sm font-medium text-black">
                  {sectionLabel(section, t)}
                  {isSectionMissing(website, section.sectionId) && (
                    <span aria-label={t('website:content.incomplete')} className="ml-2 inline-block h-2 w-2 rounded-full bg-orange align-middle" />
                  )}
                </span>
                <span className="font-poppins text-xs text-dark-grey">
                  {t(`website:types.${section.type}`)} · {item.isVisible ? t('website:content.visible') : t('website:content.hidden')}
                </span>
              </button>
              <span className="flex items-center gap-1.5">
                <IconButton label={item.isVisible ? t('website:content.hide') : t('website:content.show')} disabled={isBusy} onClick={() => toggle(index)}>
                  {item.isVisible ? (
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  ) : (
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
                  )}
                </IconButton>
                <IconButton label={t('website:content.up')} disabled={isBusy || index === 0} onClick={() => move(index, -1)}>
                  <path d="m18 15-6-6-6 6" />
                </IconButton>
                <IconButton label={t('website:content.down')} disabled={isBusy || index === items.length - 1} onClick={() => move(index, 1)}>
                  <path d="m6 9 6 6 6-6" />
                </IconButton>
                <IconButton label={t('website:content.edit')} onClick={() => onEditSection(section.sectionId)}>
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </IconButton>
                <IconButton danger label={t('website:content.remove')} disabled={isBusy} onClick={() => remove(index)}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </IconButton>
              </span>
            </li>
          )
        })}
      </ol>

      {!items.length && <Paragraph text={t('website:content.empty')} className="mt-4" />}

      {isAdding ? (
        <div className="mt-3 rounded-lg border-1 border-dashed border-green p-4">
          <Paragraph text={t('website:content.newSection')} size="sm" color="black" weight="medium" />
          <div className="mt-2 flex flex-wrap gap-2">
            {SECTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                disabled={isBusy}
                onClick={() => void addNew(type)}
                className="font-poppins flex items-center gap-2 rounded-md border-1 border-solid border-light-grey-alt px-3 py-2 text-sm text-black hover:border-green disabled:opacity-50"
              >
                <TypeIcon type={type} />
                {t(`website:types.${type}`)}
              </button>
            ))}
          </div>

          {others.length > 0 && (
            <>
              <Paragraph text={t('website:content.existingSection')} size="sm" color="black" weight="medium" className="mt-4" />
              <Paragraph text={t('website:content.existingHint')} size="sm" className="mt-1" />
              <ul className="mt-2 flex flex-col gap-2">
                {others.map((section) => (
                  <li key={section.sectionId}>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void addExisting(section.sectionId)}
                      className="font-poppins flex w-full items-center gap-3 rounded-md border-1 border-solid border-light-grey-alt px-3 py-2 text-left text-sm text-black hover:border-green disabled:opacity-50"
                    >
                      <TypeIcon type={section.type} />
                      <span className="flex-1">{sectionLabel(section, t)}</span>
                      <span className="text-xs text-dark-grey">{t(`website:types.${section.type}`)}</span>
                    </button>
                  </li>
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
