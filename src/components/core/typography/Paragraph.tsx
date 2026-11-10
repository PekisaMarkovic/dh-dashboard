import { Color, FontFamily, FontSize, FontWeight, Spacing } from '@/src/interfaces'
import { MouseEventHandler, ReactNode } from 'react'

type Props = {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
  fontFamily?: FontFamily
  size?: FontSize
  color?: Color
  noWrap?: boolean
  handleOnClick?: MouseEventHandler<HTMLDivElement>
  weight?: FontWeight
  isRequired?: boolean
  pl?: Spacing
  pr?: Spacing
  textTransform?: 'uppercase' | 'lowercase'
} & (
  | {
      text: string
      children?: never
    }
  | {
      text?: never
      children: ReactNode
    }
)

const Paragraph = ({
  text,
  children,
  leftIcon,
  rightIcon,
  className,
  fontFamily = 'popins',
  size = 'xs',
  color = 'grey-secondary',
  noWrap,
  handleOnClick,
  weight = 'normal',
  isRequired = false,
  pl,
  pr,
  textTransform,
}: Props) => {
  const textSize = `text-${size}`
  const textColor = `text-${color}`
  const fontWeight = `font-${weight}`
  const paddingLeft = pl ? `pl-${pl}` : ''
  const paddingRight = pr ? `pr-${pr}` : ''
  const txtTransform = textTransform || ''

  return (
    <div className={`flex gap-x-3 items-center overflow-hidden ${paddingLeft} ${paddingRight}`} onClick={handleOnClick}>
      {leftIcon}

      <p className={`font-${fontFamily} ${textSize} ${textColor} ${className || ''} ${fontWeight} ${noWrap ? 'truncate' : ''} ${txtTransform}`}>
        {text}
        {isRequired && <span className="text-red">*</span>}
        {children}
      </p>

      {rightIcon}
    </div>
  )
}

export default Paragraph
