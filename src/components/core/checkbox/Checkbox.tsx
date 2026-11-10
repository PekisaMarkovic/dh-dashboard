import { ReactNode, useEffect } from 'react'
import CheckboxOption from '@/src/components/core/checkbox/CheckboxOption'
import { useFormContext, useWatch } from 'react-hook-form'

type Props = {
  label: ReactNode
  initValue?: boolean
  name: string
  noHover?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  disabled?: boolean
}

const Checkbox = ({ label, name, initValue, noHover, leftIcon, rightIcon, disabled }: Props) => {
  const checkbox = useWatch({ name })
  const { register, setValue, clearErrors } = useFormContext()

  useEffect(() => {
    register(`${name}.checked`, { value: initValue || false })
  }, [])

  const handleOnClick = () => {
    if (disabled) return
    const val = checkbox && checkbox.checked ? !checkbox.checked : true
    setValue(`${name}.checked`, val)
    if (!val) setValue(`${name}.value`, '')
    clearErrors(name)
  }

  return (
    <CheckboxOption
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      noHover={noHover}
      checked={checkbox && checkbox.checked ? checkbox.checked : false}
      handleOnClick={handleOnClick}
      label={label}
      name={name}
    />
  )
}

export default Checkbox
