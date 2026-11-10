import ArrowBackIcon from '@/src/icons/general/ArrowBackIcon'
import ArrowDownIcon from '@/src/icons/general/ArrowDownIcon'
import ArrowRightIcon from '@/src/icons/general/ArrowRightIcon'
import ArrowSelectIcon from '@/src/icons/general/ArrowSelectIcon'
import CheckIcon from '@/src/icons/general/CheckIcon'
import MoreIcon from '@/src/icons/general/MoreIcon'
import SelectDropdownIcon from '@/src/icons/general/SelectDropdownIcon'
import TooltipIcon from '@/src/icons/general/TooltipIcon'
import TrashWhiteIcon from '@/src/icons/general/TrashWhiteIcon'
import UnCheckIcon from '@/src/icons/general/UnCheckIcon'
import UserPlaceholderIcon from '@/src/icons/general/UserPlaceholderIcon'
import InfiniteLoader from '@/src/icons/general/InfiniteLoader'

interface Props extends React.SVGProps<SVGSVGElement> {
  type:
    | 'ArrowBack'
    | 'ArrowDown'
    | 'ArrowRight'
    | 'MoreIcon'
    | 'ArrowSelect'
    | 'Check'
    | 'UnCheck'
    | 'Tooltip'
    | 'InfiniteLoader'
    | 'TrashWhite'
    | 'SelectDropdown'
    | 'UserPlaceholder'
  onClick?: () => void
}

const GeneralIcons = ({ onClick, type, ...rest }: Props) => {
  switch (type) {
    case 'ArrowBack':
      return <ArrowBackIcon {...rest} onClick={onClick} />
    case 'ArrowDown':
      return <ArrowDownIcon {...rest} onClick={onClick} />
    case 'InfiniteLoader':
      return <InfiniteLoader {...rest} onClick={onClick} />
    case 'ArrowRight':
      return <ArrowRightIcon {...rest} onClick={onClick} />
    case 'MoreIcon':
      return <MoreIcon {...rest} onClick={onClick} />
    case 'ArrowSelect':
      return <ArrowSelectIcon {...rest} onClick={onClick} />
    case 'Check':
      return <CheckIcon {...rest} onClick={onClick} />
    case 'UnCheck':
      return <UnCheckIcon {...rest} onClick={onClick} />
    case 'Tooltip':
      return <TooltipIcon {...rest} onClick={onClick} />
    case 'TrashWhite':
      return <TrashWhiteIcon {...rest} onClick={onClick} />
    case 'SelectDropdown':
      return <SelectDropdownIcon {...rest} onClick={onClick} />

    case 'UserPlaceholder':
      return <UserPlaceholderIcon {...rest} onClick={onClick} />

    default:
      return null
  }
}

export default GeneralIcons
