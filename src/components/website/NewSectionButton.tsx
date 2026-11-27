import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
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
      className="flex items-center rounded-md border-1 border-solid border-light-grey-alt px-3 py-2 hover:border-green disabled:opacity-50"
    >
      <Paragraph text={t(`website:types.${type}`)} size="sm" color="black" leftIcon={<SectionTypeIcon type={type} />} />
    </button>
  )
}

export default NewSectionButton
