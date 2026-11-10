import { CustomDropdown } from '@/src/interfaces'
import SingleCustomDropdownOption from '@/src/components/core/dropdowns/partials/SingleCustomDropdownOption'

type Props = {
  dropdownOptions: CustomDropdown[]
  position?: string
}

const CustomDropdowns = ({ dropdownOptions, position }: Props) => {
  const defaultPosition = position || 'top-full -left-full -translate-x-2/4'

  return (
    <div className={`bg-white absolute ${defaultPosition} py-1.5 border-1 border-lighy-grey rounded-sm z-5 w-36 border-solid`}>
      {dropdownOptions.map(({ textColor, content }, index) => {
        return <SingleCustomDropdownOption textColor={textColor} content={content} key={index} />
      })}
    </div>
  )
}

export default CustomDropdowns
