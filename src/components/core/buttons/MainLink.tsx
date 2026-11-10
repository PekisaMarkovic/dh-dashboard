import { ReactNode } from 'react'
import { Size, Variant } from './MainButton'
import { Link } from 'react-router-dom'
import { style } from '@/src/components/core/buttons/style'
import { FontFamily } from '@/src/interfaces'

type Props = {
  className?: string
  text: string
  size: Size
  fontFamily?: FontFamily
  variant: Variant
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
  disabled?: boolean
  href: string
  target?: '_blank' | '_top' | '_parent' | '_self'
}

const MainLink = ({ href, size, text, fontFamily = 'popins', variant, leftIcon, rightIcon, disabled = false, target, className = '' }: Props) => {
  return (
    <Link to={href} className={`${style({ fontFamily, size, variant, disabled })} ${className}`} target={target}>
      {leftIcon}
      {text}
      {rightIcon}
    </Link>
  )
}

export default MainLink
