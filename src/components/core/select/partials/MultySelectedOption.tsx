import XIcon from '@/public/images/general/x-selected.svg'
import { SelectOption } from '@/src/interfaces'

type Props = {
  option: SelectOption
  handleOnClick?: () => void
}

const MultySelectedOption = ({ option, handleOnClick }: Props) => (
  <p className="font-poppins text-sm flex flex-wrap gap-1.5 items-center bg-light-grey-transparent border-1 border-lighy-grey border-solid rounded-xxl px-2.5 py-0.5">
    {option.name}
    {handleOnClick && <XIcon onClick={handleOnClick} />}
  </p>
)

export default MultySelectedOption
