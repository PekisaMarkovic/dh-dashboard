import GeneralIcons from '@/src/icons/general'
import Tooltip from '@/src/components/core/tooltip/Tooltip'
import { ReactNode } from 'react'

type Props = {
  text?: ReactNode
  isSmall?: boolean
  isTextHoverable?: boolean
  type?: 'tooltip-icon' | 'tooltip-btn'
}

const TooltipIcon = ({ text = '', isSmall, isTextHoverable, type = 'tooltip-icon' }: Props) => {
  return text ? (
    <Tooltip
      text={text}
      icon={<GeneralIcons type="Tooltip" className={isSmall ? 'scale-75' : ''} />}
      position={`tooltip__container tooltip__container--${type}`}
      isTextHoverable={isTextHoverable}
    />
  ) : null
}

export default TooltipIcon
