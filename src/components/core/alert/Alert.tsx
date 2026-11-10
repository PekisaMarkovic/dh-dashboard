import InfoCircleIcon from '@/src/public/images/general/info-circle.svg'
import CloseLineIcon from '@/src/public/images/general/close-line.svg'
import { FC, SVGProps, MouseEvent } from 'react'
import { Color } from '@/src/interfaces'

type Variant = 'error' | 'info'

const VARIANT_MAP: Record<
  Variant,
  {
    svg: FC<SVGProps<SVGElement>>
    iconColor: Color
    color: Color
    bgColor: Color
  }
> = {
  error: {
    svg: InfoCircleIcon,
    iconColor: 'red-600',
    color: 'red-600',
    bgColor: 'red-50',
  },
  info: {
    svg: InfoCircleIcon,
    iconColor: 'state-info',
    color: 'grey-900',
    bgColor: 'blue-50',
  },
}

type Props = {
  className?: string
  variant: Variant
  text: string
  onClose?: () => void
}

const Alert = ({ className = '', variant, text, onClose }: Props) => {
  const { svg: Icon, iconColor, color, bgColor } = VARIANT_MAP[variant]
  return (
    <p className={`flex items-center gap-2 p-2.5 font-inter text-xs rounded-lg bg-${bgColor} text-${color} ${className}`}>
      <Icon className={`self-start shrink-0 text-${iconColor}`} transform="scale(0.75)" />
      {text}
      {onClose && (
        <CloseLineIcon
          className={`ml-auto mr-0 cursor-pointer text-${color}`}
          onClick={(event: MouseEvent<HTMLElement>) => {
            event.stopPropagation()
            onClose()
          }}
        />
      )}
    </p>
  )
}

export default Alert
