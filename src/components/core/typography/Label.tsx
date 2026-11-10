import { ReactNode, useState } from 'react'

type Props = {
  htmlFor?: string
  label: string
  isRequired?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLabelHidden?: boolean
}

const Label = ({ htmlFor, label, isRequired, leftIcon, rightIcon, isLabelHidden }: Props) => {
  const [entered, setEntered] = useState<boolean>(false)
  const hiddenStyle = isLabelHidden ? 'h-0 w-0 overflow-hidden -z-1' : ''

  const handleOnMouseEnter = () => setEntered(true)
  const handleOnMouseLeave = () => setEntered(false)

  return (
    <div
      className={`absolute bg-white left-3.5 top-0 -translate-y-2/4 px-1 ${entered ? 'z-10' : 'z-1'} ${hiddenStyle}`}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <div className="flex gap-x-1 items-center">
        <label htmlFor={htmlFor} className="font-poppins text-black text-xs">
          {leftIcon}
          {label}
          {isRequired && <span className="text-red">*</span>}
        </label>
        {rightIcon}
      </div>
    </div>
  )
}

export default Label
