import { useTranslation } from 'react-i18next'
import SectionTypeIcon from '@/src/components/website/SectionTypeIcon'
import { SectionType } from '@/src/interfaces'

type Props = {
  type: SectionType
  disabled: boolean
  onClick: () => void
}

// adds a new empty section of this kind to the page
const NewSectionButton = ({ type, disabled, onClick }: Props) => {
  const { t } = useTranslation(['website'])

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="font-poppins flex items-center gap-2 rounded-md border-1 border-solid border-light-grey-alt px-3 py-2 text-sm text-black hover:border-green disabled:opacity-50"
    >
      <SectionTypeIcon type={type} />
      {t(`website:types.${type}`)}
    </button>
  )
}

export default NewSectionButton
