import { HTMLAttributeAnchorTarget, ReactNode } from 'react'
import { Color } from '@/src/interfaces'

export type CustomDropdownLink = {
  type: 'link'
  text: string | ReactNode
  href: string
  target?: HTMLAttributeAnchorTarget
  download?: boolean | string
}

export type CustomDropdownButton = {
  type: 'button'
  text: string | ReactNode
  onClick?: () => void
}

export interface CustomDropdown {
  content: CustomDropdownButton | CustomDropdownLink
  textColor?: Color
}
