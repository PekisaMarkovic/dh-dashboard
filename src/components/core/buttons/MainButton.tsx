import { ReactNode } from 'react'
import { style } from '@/src/components/core/buttons/style'
import { FontFamily } from '@/src/interfaces'
import GeneralIcons from '@/src/icons/general'

export type Variant = 'contained' | 'outlined' | 'text' | 'alternative' | 'primary' | 'error'

export type Size = 'extra-small' | 'small' | 'medium' | 'large' | 'full'

type Props = {
  className?: string
  text: string
  fontFamily?: FontFamily
  size: Size
  variant: Variant
  htmlType?: 'button' | 'submit' | 'reset'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  // shows the spinner instead of the text, used while something is saving
  disabled?: boolean
  // the button can not be clicked: the text stays, only a bit faded
  isInactive?: boolean
  onClick?: () => void
}

const MainButton = ({
  className = '',
  text,
  fontFamily = 'popins',
  onClick,
  htmlType = 'button',
  size,
  variant,
  leftIcon,
  rightIcon,
  disabled = false,
  isInactive = false,
}: Props) => {
  return (
    <button
      onClick={onClick}
      type={htmlType}
      className={`${style({ fontFamily, size, variant, disabled })} ${isInactive ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isInactive}
    >
      {disabled ? (
        <GeneralIcons type="InfiniteLoader" />
      ) : (
        <>
          {leftIcon}
          {text}
          {rightIcon}
        </>
      )}
    </button>
  )
}

export default MainButton
