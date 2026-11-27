import FlagIcon from '@/src/icons/flags/FlagIcon'
import { Language } from '@/src/utils/language'

type Props = {
  language: Language
  label: string
  isCurrent: boolean
  onClick: () => void
}

// one language in the dropdown of flags
const LanguageOption = ({ language, label, isCurrent, onClick }: Props) => (
  <li role="option" aria-selected={isCurrent}>
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex w-full items-center justify-center py-2 hover:bg-light-grey-transparent ${isCurrent ? 'bg-light-grey-transparent' : ''}`}
    >
      <FlagIcon language={language} className="h-4 w-6 block rounded-[2px]" />
    </button>
  </li>
)

export default LanguageOption
