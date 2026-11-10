import { PropsWithChildren, ReactNode, useCallback, useState } from 'react'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import TooltipIcon from '@/src/components/core/tooltip/TooltipIcon'
import { CustomDropdown } from '@/src/interfaces'
import { useClickAway } from '@/src/hooks/use-click-outside'
import GeneralIcons from '@/src/icons/general'
import CustomDropdowns from '@/src/components/core/dropdowns/CustomDropdowns'

type Props = {
  title: string
  subtitle?: string
  tooltip?: string
  element?: ReactNode
  isOptionsHidden?: boolean
  dropdownOptions?: CustomDropdown[]
}

const DataSection = ({ subtitle, title, children, element, tooltip, dropdownOptions, isOptionsHidden }: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = useCallback(() => setOpen(false), [])

  const clickAwayRef = useClickAway<HTMLDivElement>({ clickAwayCallback: handleClose })

  const handleOnClick = () => setOpen(!open)

  return (
    <div className={`relative bg-white rounded-sm border-1 border-light-grey-alt border-solid mt-4 mb-4 px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <Heading variant="3" text={title} size="base" color="black" />
            <TooltipIcon text={tooltip} />
          </div>
          {subtitle && <Paragraph text={subtitle} className="mt-2.5" />}
        </div>
        {element}
      </div>
      {children}

      {!isOptionsHidden && !!dropdownOptions?.length && (
        <div className={`absolute top-5 -translate-y-2/4 right-2 ${open ? 'z-4' : 'z-2'}`} ref={clickAwayRef}>
          <div className="relative">
            <GeneralIcons type="MoreIcon" className="cursor-pointer z-1" onClick={handleOnClick} />
            {open && <CustomDropdowns dropdownOptions={dropdownOptions} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataSection
