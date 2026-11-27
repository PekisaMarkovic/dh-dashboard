import { useTranslation } from 'react-i18next'
import IconButton from '@/src/components/core/buttons/IconButton'
import { ICONS } from '@/src/components/core/icons/paths'
import WarningDot from '@/src/components/core/indicators/WarningDot'
import Paragraph from '@/src/components/core/typography/Paragraph'
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
        <Paragraph
          text={sectionLabel(section, t)}
          size="sm"
          color="black"
          weight="medium"
          noWrap
          rightIcon={isMissing ? <WarningDot label={t('website:content.incomplete')} /> : undefined}
        />
        <Paragraph text={`${t(`website:types.${section.type}`)} · ${isVisible ? t('website:content.visible') : t('website:content.hidden')}`} color="dark-grey" />
      </button>
      <span className="flex items-center gap-1.5">
        <IconButton label={isVisible ? t('website:content.hide') : t('website:content.show')} icon={isVisible ? ICONS.eye : ICONS.eyeOff} disabled={isBusy} onClick={onToggle} />
        <IconButton label={t('website:content.up')} icon={ICONS.up} disabled={isBusy || isFirst} onClick={() => onMove(-1)} />
        <IconButton label={t('website:content.down')} icon={ICONS.down} disabled={isBusy || isLast} onClick={() => onMove(1)} />
        <IconButton label={t('website:content.edit')} icon={ICONS.edit} onClick={onEdit} />
        <IconButton danger label={t('website:content.remove')} icon={ICONS.close} disabled={isBusy} onClick={onRemove} />
      </span>
    </li>
  )
}

export default PageSectionRow
