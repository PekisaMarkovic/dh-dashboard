import { PropsWithChildren, useCallback, useState } from 'react'
import GeneralIcons from '@/src/icons/general'
import { CustomDropdown } from '@/src/interfaces'
import { useClickAway } from '@/src/hooks/use-click-outside'
import CustomDropdowns from '@/src/components/core/dropdowns/CustomDropdowns'

interface DefaultTableRowContainerProps {
  cols?: number
  isOptionsHidden?: boolean
  dropdownOptions?: CustomDropdown[]
  onRowClick?: () => void
}

const DefaultTableRowContainer = ({
  children,
  cols = 9,
  dropdownOptions = [],
  isOptionsHidden = false,
  onRowClick,
}: PropsWithChildren<DefaultTableRowContainerProps>) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = useCallback(() => setOpen(false), [])

  const clickAwayRef = useClickAway<HTMLDivElement>({ clickAwayCallback: handleClose })

  const handleOnClick = () => setOpen(!open)

  return (
    <div
      className={`relative pl-4 pr-6 grid grid-cols-${cols} border-b-1 border-b-light-grey-alt border-solid ${open ? 'z-4' : 'z-2'} ${onRowClick ? 'cursor-pointer hover:bg-light-grey-transparent' : ''}`}
      onClick={onRowClick}
    >
      {children}

      {!isOptionsHidden && !!dropdownOptions.length && (
        <div className={`absolute top-1/2 -translate-y-2/4 right-2 ${open ? 'z-4' : 'z-2'}`} ref={clickAwayRef} onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <GeneralIcons type="MoreIcon" className="cursor-pointer z-1" onClick={handleOnClick} />
            {open && <CustomDropdowns dropdownOptions={dropdownOptions} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default DefaultTableRowContainer
