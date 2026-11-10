import { ReactNode, useState } from 'react'

type Props = {
  text: ReactNode
  icon: ReactNode
  isFullWidth?: boolean
  position?: string
  isTextHoverable?: boolean
}
const Tooltip = ({ text, icon, isFullWidth = false, position, isTextHoverable = false }: Props) => {
  const [show, setShow] = useState<boolean>(false)
  const classNameForPosition = position || 'tooltip__container'

  const handleOpen = () => setShow(true)

  const handleCloseIcon = () => {
    if (isTextHoverable) return
    setShow(false)
  }

  const handleCloseOnText = () => {
    if (!isTextHoverable) return
    setShow(false)
  }

  return (
    <div className={`relative ${isFullWidth ? 'w-full' : ''}`} onMouseLeave={handleCloseOnText}>
      <div onMouseEnter={handleOpen} onMouseLeave={handleCloseIcon} className="cursor-pointer z-4">
        {icon}
      </div>
      {show && isTextHoverable && <div className="tooltip-hover-zone" />}
      {show && (
        <div className={`absolute ${classNameForPosition} ${show ? 'z-4' : 'z-2'}`}>
          <div className="relative bg-black rounded-xs px-5 py-2 w-full">
            <p className="font-poppins text-xs text-white text-center">{text}</p>
            <div className="tooltip__arrow h-2 w-2 bg-black" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
