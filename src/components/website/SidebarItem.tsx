import { useTranslation } from 'react-i18next'

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

  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-poppins flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm ${
        isActive ? 'bg-green-transparent text-green' : 'text-black hover:bg-light-grey-transparent'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={icon} />
      </svg>
      <span className="truncate">{label}</span>
      {note && <span className="text-xs text-dark-grey">({note})</span>}
      {hasWarning && <span aria-label={t('website:content.incomplete')} className="ml-auto inline-block h-2 w-2 shrink-0 rounded-full bg-orange" />}
    </button>
  )
}

export default SidebarItem
