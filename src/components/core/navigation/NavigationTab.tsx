import { style } from '@/src/components/core/navigation/style'
import { MouseEventHandler, ReactNode } from 'react'
import TabUnderline from '@/src/components/core/navigation/partials/TabUnderline'
import { Link } from 'react-router-dom'

export type Variant = 'side' | 'tab'

type Props = {
  href: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  text: string
  isActiv: boolean
  variant: Variant
  perc: number
  noPerc?: boolean
  handleOnClick?: MouseEventHandler<HTMLAnchorElement>
}

const NavigationTab = ({ href, leftIcon, rightIcon, text, isActiv, variant, perc, noPerc = false, handleOnClick }: Props) => {
  const checkPercentage = () => {
    if (noPerc) return <></>
    if (perc === 100) return <span className="ml-2 text-green">{perc}%</span>
    return <span className="ml-2 text-orange">{perc}%</span>
  }

  const checkUnderlineColor = () => {
    if (noPerc) return 'green'
    if (perc === 100) return 'green'
    return 'orange'
  }

  return (
    <Link to={href} className={style(isActiv, variant)} onClick={handleOnClick}>
      {leftIcon}
      <span>
        {text}
        {checkPercentage()}
      </span>
      {rightIcon}

      {variant === 'tab' && isActiv && <TabUnderline variant={checkUnderlineColor()} />}
    </Link>
  )
}

export default NavigationTab
