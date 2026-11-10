import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type LinkProps = {
  link?: string
  children: ReactNode
}

const LinkWrapper = ({ children, link }: LinkProps) => {
  return (
    <>
      {link ? (
        <Link to={link} target="_blank">
          {children}
        </Link>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
export default LinkWrapper
