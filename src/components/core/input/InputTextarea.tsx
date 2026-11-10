import get from 'lodash.get'
import ErrorMessage from '@/src/components/core/typography/ErrorMessage'
import Label from '@/src/components/core/typography/Label'
import { useFormContext, useWatch } from 'react-hook-form'
import { ChangeEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  placeholder?: string
  label: string
  isRequired?: boolean
  rows?: number
  initValue?: string
  name: string
  maxChar?: number
  isDisabled?: boolean
}

const InputTextarea = ({ name, rows = 4, label, placeholder, isRequired, initValue, maxChar, isDisabled }: Props) => {
  const { t } = useTranslation(['g'])
  const value = useWatch({ name }) as string
  const charsInString = value?.length || 0
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useFormContext()
  const errorObj = get(errors, name)

  const error = errorObj && errorObj.message ? (errorObj.message as string) : null
  const maxCharError = maxChar && charsInString > maxChar ? t('g:fields.maxCharError') : undefined

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (isDisabled) return
    setValue(name, e.target.value)
    clearErrors(name)
  }

  return (
    <div className="flex flex-col relative">
      <Label htmlFor={name} label={label} isRequired={isRequired} />
      <div className="flex flex-col">
        <textarea
          disabled={isDisabled}
          {...register(name, { value: initValue || '' })}
          rows={rows}
          className={`font-poppins ${isDisabled ? 'cursor-not-allowed' : ''} bg-white border-1 ${
            error || maxCharError ? 'border-red' : 'border-grey'
          } text-sm text-black placeholder:text-text-grey py-3 px-4 focus:ring-green focus:border-green focus:outline-none focus-visible:ring-green block w-full rounded-xs-plus`}
          placeholder={placeholder}
          onChange={handleInputChange}
          maxLength={maxChar}
        />
        {maxChar && (
          <span className={`font-poppins text-dark-grey ml-auto text-xs ${maxCharError && 'text-red'}`}>
            {t('g:fields.maxChar', { numberOfChars: `${maxChar - charsInString}` })}
          </span>
        )}
      </div>
      <ErrorMessage name={error} message={maxCharError} variant="input" />
    </div>
  )
}

export default InputTextarea
