import { ChangeEventHandler, useRef, useState } from 'react'
import DropdownIcon from '@/public/images/general/select-dropdown-arrow.svg'
import DisabledDropdownIcon from '@/public/images/general/select-dropdown-arrow-disabled.svg'
import SingleOption from '@/src/components/core/select/partials/SingleOption'
import ErrorMessage from '@/src/components/core/typography/ErrorMessage'
import Label from '@/src/components/core/typography/Label'
import { Nullable, SelectOption } from '@/src/interfaces'
import { useClickAway } from '@/src/hooks/use-click-outside'

type Props = {
  placeholder?: string
  label: string
  isRequired?: boolean
  options: SelectOption[]
  name: string
  initValue?: SelectOption
  isReverse?: boolean
  errorMessage?: string | null
  selected: Nullable<SelectOption>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setSelected: Function
  disabled?: boolean
}

const SingleSelectFormless = ({
  label,
  placeholder,
  isRequired,
  options,
  name,
  isReverse = false,
  errorMessage,
  selected,
  setSelected,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputvalue] = useState(selected ? selected.name : '')
  const [flitered, setFiltered] = useState(options)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleToggle = () => {
    if (disabled) return

    setOpen(!open)
  }

  const handleClose = () => {
    if (inputRef && inputRef.current) inputRef.current.blur()
    setOpen(false)
  }

  const clickAwayRef = useClickAway<HTMLDivElement>({ clickAwayCallback: handleClose })

  const handleOnChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelected(null)
    setInputvalue(e.target.value)
    setFiltered(options.filter((opt) => opt.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())))
  }

  const outlineStyle = () => {
    if (errorMessage) return 'border-red'
    if (disabled) return 'border-grey'
    if (open) return 'border-green'
    return 'border-grey'
  }

  return (
    <div className={`flex flex-col relative ${!disabled && 'cursor-pointer'}`} ref={clickAwayRef}>
      <Label htmlFor={name} label={label} isRequired={isRequired} />

      <div
        className={`flex items-center jusfity-between bg-white py-3 px-4 block w-full rounded-xs-plus border-1 ${outlineStyle()} border-solid`}
        onClick={handleToggle}
      >
        <input
          autoComplete="off"
          ref={inputRef}
          value={inputValue}
          className={`flex-1 font-poppins focus:ring-transparent focus:border-transparent focus:outline-none focus-visible:ring-none ${
            selected ? 'text-sm text-black' : 'text-sm text-grey'
          } ${disabled && 'text-grey'}`}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleOnChangeInput}
        />

        {disabled ? <DisabledDropdownIcon /> : <DropdownIcon className={`${open ? 'rotate-180' : ''}`} />}
      </div>

      {open && (
        <div className={`absolute ${isReverse ? 'bottom-full' : 'top-full'} w-full z-10`}>
          <div className="h-1.5 bg-transparent" />
          <div className="shadow-md bg-white w-full rounded-xs-plus max-h-60 overflow-y-scroll">
            {flitered.map((option, index) => (
              <SingleOption
                handleOnClick={() => {
                  setSelected(option)
                }}
                option={option}
                checked={selected ? selected.value === option.value : false}
                key={index}
              />
            ))}
          </div>
          {isReverse && <div className="h-1.5 bg-transparent" />}
        </div>
      )}

      <ErrorMessage name={errorMessage} variant="select" />
    </div>
  )
}

export default SingleSelectFormless
