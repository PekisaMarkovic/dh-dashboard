import { useTranslation } from 'react-i18next'
import LineIcon from '@/src/components/core/icons/LineIcon'
import WarningDot from '@/src/components/core/indicators/WarningDot'
import Paragraph from '@/src/components/core/typography/Paragraph'

type Props = {
  // the path of a 24 x 24 line icon
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
  // a short note after the label, e.g. "(nacrt)"
  note?: string
  // something is missing: an orange dot on the right
  hasWarning?: boolean
}

// one item of the left column of "Web sajt": the settings of the site, the messages or a page
const SidebarItem = ({ icon, label, isActive, onClick, note, hasWarning }: Props) => {
  const { t } = useTranslation(['website'])
  const color = isActive ? 'green' : 'black'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-3 text-left ${isActive ? 'bg-green-transparent text-green' : 'text-black hover:bg-light-grey-transparent'}`}
    >
      <LineIcon d={icon} />
      <Paragraph text={label} size="sm" color={color} noWrap />
      {note && <Paragraph text={`(${note})`} color="dark-grey" />}
      {hasWarning && <WarningDot label={t('website:content.incomplete')} className="ml-auto" />}
    </button>
  )
}

export default SidebarItem
