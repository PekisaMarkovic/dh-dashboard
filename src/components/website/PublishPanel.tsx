import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
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

// the sections in the order of the tabs
const SECTIONS = ['general', 'hero', 'featured', 'story', 'promo', 'seo']

const StatusBadge = ({ isPublished, text }: { isPublished: boolean; text: string }) => (
  <span
    className={`font-poppins text-xs rounded-xl px-3 py-1 ${isPublished ? 'bg-green-transparent text-green' : 'bg-orange-transparent text-dark-orange'}`}
  >
    {text}
  </span>
)

/**
 * The state of the site (draft or published) and what is missing before it can be published.
 * A site is a draft until every section is filled in and every picture is uploaded, only then it can be published.
 */
const PublishPanel = ({ website }: { website: IWebsite }) => {
  const { t } = useTranslation(['website', 'g'])
  const showError = useErrorToast()
  const dispatch = useAppDispatch()
  const { publishWebsite, unpublishWebsite } = useWebsiteService()
  const { afterWebsiteChange } = useRefreshData()
  const isPublished = website.status === 'published'
  const { isComplete, missing } = website.completeness

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
          <StatusBadge isPublished={isPublished} text={t(`website:status.${website.status}`)} />
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
            {SECTIONS.map((section) => {
              const items = missing.filter((key) => key.startsWith(`${section}.`))

              return items.length ? (
                <li key={section} className="font-poppins text-sm text-red">
                  <span className="font-medium">{t(`website:tabs.${section}`)}:</span> {items.map((key) => t(`website:missing.${key}`)).join(', ')}
                </li>
              ) : null
            })}
          </ul>
        </div>
      )}
    </DataSection>
  )
}

export default PublishPanel
