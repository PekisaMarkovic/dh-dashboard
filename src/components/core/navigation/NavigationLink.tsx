import { Link } from 'react-router-dom'
import { style } from '@/src/components/core/navigation/style'
import { MouseEventHandler, ReactNode } from 'react'
import TabUnderline from '@/src/components/core/navigation/partials/TabUnderline'

export type Variant = 'side' | 'tab'

type Props = {
  href: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  text: string
  isActiv: boolean
  variant: Variant
  handleOnClick?: MouseEventHandler<HTMLAnchorElement>
}

const NavigationLink = ({ href, leftIcon, rightIcon, text, isActiv, variant, handleOnClick }: Props) => {
  return (
    <Link to={href} className={style(isActiv, variant)} onClick={handleOnClick}>
      {leftIcon}
      {text}
      {rightIcon}

      {variant === 'tab' && isActiv && <TabUnderline />}
    </Link>
  )
}

export default NavigationLink
