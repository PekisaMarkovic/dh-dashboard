import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import LeftMenu from '@/src/layouts/partials/LeftMenu'

type Props = {
  isOpen: boolean
  onClose: () => void
}

/**
 * The left menu as a drawer that slides in over the page. It is used on tablets and phones,
 * where the menu on the left would take too much of the screen (from lg up it is always visible).
 */
const MobileMenu = ({ isOpen, onClose }: Props) => {
  const { pathname } = useLocation()

  // a page was picked, the menu has done its job
  useEffect(() => {
    onClose()
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <div className={`lg:hidden fixed inset-0 z-[1100] ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

      <div
        className={`absolute left-0 top-0 bottom-0 w-72 max-w-[85%] bg-white shadow-drop-down transition-[transform,visibility] duration-200 ${
          isOpen ? 'translate-x-0 visible' : '-translate-x-full invisible'
        }`}
      >
        <LeftMenu />
      </div>
    </div>
  )
}

export default MobileMenu
