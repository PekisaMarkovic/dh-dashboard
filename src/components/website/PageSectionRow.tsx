import { useTranslation } from 'react-i18next'
import IconButton from '@/src/components/website/IconButton'
import SectionTypeIcon from '@/src/components/website/SectionTypeIcon'
import { IWebsiteSection } from '@/src/interfaces'
import { sectionLabel } from '@/src/utils/website'

type Props = {
  section: IWebsiteSection
  isVisible: boolean
  // something of the section is missing (a dot next to its name)
  isMissing: boolean
  isFirst: boolean
  isLast: boolean
  // a change is being saved
  isBusy: boolean
  onEdit: () => void
  onToggle: () => void
  onMove: (step: -1 | 1) => void
  onRemove: () => void
}

// one section of a page: its kind, its name and whether it is shown, with show / hide, up, down, edit and remove
const PageSectionRow = ({ section, isVisible, isMissing, isFirst, isLast, isBusy, onEdit, onToggle, onMove, onRemove }: Props) => {
  const { t } = useTranslation(['website'])

  return (
    <li className="flex items-center gap-3 rounded-lg border-1 border-solid border-light-grey-alt bg-white p-3">
      <SectionTypeIcon type={section.type} />
      <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 flex-col text-left">
        <span className="font-poppins truncate text-sm font-medium text-black">
          {sectionLabel(section, t)}
          {isMissing && <span aria-label={t('website:content.incomplete')} className="ml-2 inline-block h-2 w-2 rounded-full bg-orange align-middle" />}
        </span>
        <span className="font-poppins text-xs text-dark-grey">
          {t(`website:types.${section.type}`)} · {isVisible ? t('website:content.visible') : t('website:content.hidden')}
        </span>
      </button>
      <span className="flex items-center gap-1.5">
        <IconButton label={isVisible ? t('website:content.hide') : t('website:content.show')} disabled={isBusy} onClick={onToggle}>
          {isVisible ? (
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          ) : (
            <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
          )}
        </IconButton>
        <IconButton label={t('website:content.up')} disabled={isBusy || isFirst} onClick={() => onMove(-1)}>
          <path d="m18 15-6-6-6 6" />
        </IconButton>
        <IconButton label={t('website:content.down')} disabled={isBusy || isLast} onClick={() => onMove(1)}>
          <path d="m6 9 6 6 6-6" />
        </IconButton>
        <IconButton label={t('website:content.edit')} onClick={onEdit}>
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </IconButton>
        <IconButton danger label={t('website:content.remove')} disabled={isBusy} onClick={onRemove}>
          <path d="M18 6 6 18M6 6l12 12" />
        </IconButton>
      </span>
    </li>
  )
}

export default PageSectionRow
