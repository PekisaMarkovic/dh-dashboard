import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import SectionTypeIcon from '@/src/components/website/SectionTypeIcon'
import { IWebsiteSection } from '@/src/interfaces'
import { sectionLabel } from '@/src/utils/website'

type Props = {
  section: IWebsiteSection
  disabled: boolean
  onClick: () => void
}

// a section of the site that is not on this page yet, a click puts it on the page
const ExistingSectionItem = ({ section, disabled, onClick }: Props) => {
  const { t } = useTranslation(['website'])

  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-md border-1 border-solid border-light-grey-alt px-3 py-2 text-left hover:border-green disabled:opacity-50"
      >
        <SectionTypeIcon type={section.type} />
        <div className="min-w-0 flex-1">
          <Paragraph text={sectionLabel(section, t)} size="sm" color="black" noWrap />
        </div>
        <Paragraph text={t(`website:types.${section.type}`)} color="dark-grey" />
      </button>
    </li>
  )
}

export default ExistingSectionItem
