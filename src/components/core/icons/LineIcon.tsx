import { ReactNode } from 'react'

type Props = {
  // the path of a 24 x 24 line icon, or its own paths as children
  d?: string
  children?: ReactNode
  className?: string
  strokeWidth?: number
}

// a 24 x 24 line icon in the color of the text around it
const LineIcon = ({ d, children, className = 'h-4 w-4', strokeWidth = 2 }: Props) => (
  <svg
    viewBox="0 0 24 24"
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d ? <path d={d} /> : children}
  </svg>
)

export default LineIcon
