import { useFormContext } from 'react-hook-form'
import { ChangeEventHandler, useEffect, useState } from 'react'
import InputIcon from '@/src/icons/input'

type Props = {
  placeholder?: string
  name: string
  initValue?: string
}

const InputTextSearch = ({ placeholder, name, initValue }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const { register } = useFormContext()
  const [focused, setFocused] = useState<boolean>(false)
  const { setValue } = useFormContext()

  const handleOnFocus = () => setFocused(true)
  const handleOnBlour = () => setFocused(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setValue(name, inputValue)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [inputValue])

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValue(event.target.value)
  }

  return (
    <div
      className={`flex gap-x-4 border-1 items-center rounded-xxl-plus h-full px-3.5 ${focused ? 'border-green border-solid' : 'border-light-grey-alt border-solid'}`}
    >
      <InputIcon type="Search" />

      <input
        {...register(name, { value: initValue || '' })}
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        className="focus:ring-transparent w-full focus:border-transparent focus:outline-transparent focus-visible:ring-transparent font-poppins text-sm text-black placeholder:text-text-grey"
        onFocus={handleOnFocus}
        onBlur={handleOnBlour}
      />
    </div>
  )
}

export default InputTextSearch
