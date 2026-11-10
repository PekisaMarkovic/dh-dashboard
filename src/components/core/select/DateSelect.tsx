import get from 'lodash.get'
import { useCallback, useEffect, useState } from 'react'
import { Calendar } from 'react-date-range'
import { useFormContext, useWatch } from 'react-hook-form'
import { useClickAway } from '@/src/hooks/use-click-outside'
import GeneralIcons from '@/src/icons/general'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { handleAllowScroll, handleDisableScroll } from '@/src/state/shared/behaviours'
import { inputTextStyle } from '../input/InputTextStyle'
import ErrorMessage from '../typography/ErrorMessage'
import Label from '../typography/Label'
import { formatDate, parseDate } from '@/src/utils/date'

type Props = {
  placeholder?: string
  label: string
  isRequired?: boolean
  name: string
  isDisabled?: boolean
  dateFormat?: string
}

const DateSelect = ({ label, placeholder, isRequired, name, isDisabled, dateFormat = 'dd-MM-yyyy' }: Props) => {
  const selected = useWatch({ name })
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const errorObj = get(errors, name)

  const error = errorObj && errorObj.message ? (errorObj.message as string) : null

  useEffect(() => {
    register(name)
  }, [])

  const handleOpen = () => {
    if (isDisabled) return
    setOpen(true)
    dispatch(handleDisableScroll())
  }

  const handleClose = () => {
    setOpen(false)
    dispatch(handleAllowScroll())
  }

  const clickAwayRef = useClickAway<HTMLDivElement>({ clickAwayCallback: handleClose })

  const outlineStyle = () => {
    if (error) return 'border-red border-solid'
    if (open) return 'border-green border-solid'
    return 'border-grey border-solid'
  }

  const handleOnDateChange = useCallback(
    (date: Date) => {
      setValue(name, formatDate(date))
      dispatch(handleAllowScroll())
    },
    [setValue],
  )

  return (
    <div className="flex flex-col relative cursor-pointer" onClick={handleOpen} ref={clickAwayRef}>
      <Label htmlFor={name} label={label} isRequired={isRequired} />

      <div className={`flex items-center jusfity-between bg-white h-12 px-4 block w-full rounded-xs-plus border-1 ${outlineStyle()}`}>
        <input
          autoComplete="off"
          {...register(name, { value: selected || '' })}
          type={'text'}
          placeholder={placeholder}
          className={inputTextStyle({ error, variant: 'simple', disabled: undefined, textCenter: undefined })}
          style={{ width: '100%' }}
        />

        <GeneralIcons type="SelectDropdown" className={`${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="absolute bg-white z-10 border-1 border-solid border-grey border-solid rounded-xs-plus top-full left-1/2 -translate-x-1/2 mt-2">
          <Calendar
            onChange={handleOnDateChange}
            date={selected && parseDate(selected).isValid() ? parseDate(selected).toDate() : new Date()}
            dateDisplayFormat={dateFormat}
          />
        </div>
      )}

      <ErrorMessage name={error} variant="select" />
    </div>
  )
}

export default DateSelect
