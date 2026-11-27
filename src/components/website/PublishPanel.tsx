import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import Badge from '@/src/components/core/indicators/Badge'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DataSection from '@/src/components/section/DataSection'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import { ModalEnums } from '@/src/enum'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { IWebsite } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { formatDate } from '@/src/utils/date'
import { sectionLabel } from '@/src/utils/website'

/** What is missing, grouped: the general info, the SEO of a page (by its title), a section (by its name) */
const groupMissing = (website: IWebsite, t: TFunction) => {
  const groups = new Map<string, string[]>()

  for (const key of website.completeness.missing) {
    const [kind, id, field] = key.split('.')
    let group = t('website:tabs.general')
    let item = t(`website:missing.general.${id}`)

    if (kind === 'page') {
      group = t('website:missing.pageSeo', { title: website.pages.find((page) => String(page.pageId) === id)?.title ?? '' })
      item = t(`website:missing.page.${field}`)
    } else if (kind === 'section') {
      const section = website.sections.find((s) => String(s.sectionId) === id)
      group = section ? sectionLabel(section, t) : ''
      item = t(`website:missing.section.${field}`)
    }

    groups.set(group, [...(groups.get(group) ?? []), item])
  }

  return [...groups]
}

/**
 * The state of the site (draft or published) and what is missing before it can be published.
 * A site is a draft until the general info and everything on its published pages is filled in, only then it can be published.
 */
const PublishPanel = ({ website }: { website: IWebsite }) => {
  const { t } = useTranslation(['website', 'g'])
  const showError = useErrorToast()
  const dispatch = useAppDispatch()
  const { publishWebsite, unpublishWebsite } = useWebsiteService()
  const { afterWebsiteChange } = useRefreshData()
  const isPublished = website.status === 'published'
  const { isComplete } = website.completeness

  const run = async (action: () => Promise<unknown>, doneText: string) => {
    try {
      await action()
      await afterWebsiteChange()
      customToast.success(doneText)
    } catch (error) {
      showError(error)
    }
  }

  const handlePublish = () => run(publishWebsite, t('website:publish.published'))

  const handleUnpublish = () =>
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('website:publish.confirmUnpublishTitle'),
          message: t('website:publish.confirmUnpublishMessage'),
          confirmText: t('website:publish.unpublish'),
          onConfirm: () => run(unpublishWebsite, t('website:publish.unpublished')),
        } satisfies ConfirmModalData,
      }),
    )

  return (
    <DataSection
      title={t('website:publish.title')}
      element={
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge text={t(`website:status.${website.status}`)} tone={isPublished ? 'green' : 'orange'} />
          {isPublished ? (
            <MainButton text={t('website:publish.unpublish')} variant="alternative" size="small" htmlType="button" onClick={handleUnpublish} />
          ) : (
            <MainButton text={t('website:publish.button')} variant="contained" size="small" htmlType="button" isInactive={!isComplete} onClick={() => void handlePublish()} />
          )}
        </div>
      }
    >
      <Paragraph text={isPublished ? t('website:publish.publishedText') : t('website:publish.draftText')} size="sm" />
      {isPublished && website.publishedAt && <Paragraph text={t('website:publish.publishedAt', { date: formatDate(website.publishedAt) })} size="sm" className="mt-1" />}

      {isComplete ? (
        !isPublished && <Paragraph text={t('website:publish.complete')} size="sm" color="black" className="mt-3" />
      ) : (
        <div className="mt-4">
          <Paragraph text={isPublished ? t('website:publish.incompletePublished') : t('website:publish.missingTitle')} size="sm" color="red" weight="medium" />
          <ul className="mt-2 flex flex-col gap-y-1">
            {groupMissing(website, t).map(([group, items]) => (
              <li key={group}>
                <Paragraph size="sm" color="red">
                  <strong>{group}:</strong> {items.join(', ')}
                </Paragraph>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DataSection>
  )
}

export default PublishPanel
