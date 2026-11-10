import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import SingleOption from '@/src/components/core/select/partials/SingleOption'
import { useFormContext, useWatch } from 'react-hook-form'
import ErrorMessage, { Variant } from '@/src/components/core/typography/ErrorMessage'
import Label from '@/src/components/core/typography/Label'
import get from 'lodash.get'
import { Nullable, SelectOption, Spacing } from '@/src/interfaces'
import { OVERFLOW_OPTION } from '@/src/constatns/select'
import GeneralIcons from '@/src/icons/general'
import { handleAllowScroll, handleDisableScroll } from '@/src/state/shared/behaviours'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'

type Props = {
  placeholder?: string
  label: string
  isRequired?: boolean
  options: SelectOption[]
  name: string
  initValue?: SelectOption
  isLabelHidden?: boolean
  // smaller box, e.g. for toolbars
  compact?: boolean
  isDisabled?: boolean
  mt?: Spacing
  mb?: Spacing
  errorMessageType?: Variant
  onClickCallback?: () => void
}

const SingleSelect = ({
  label,
  placeholder,
  isRequired,
  options,
  name,
  initValue,
  isLabelHidden = false,
  compact = false,
  mt,
  mb,
  isDisabled,
  errorMessageType = 'select',
  onClickCallback,
}: Props) => {
  let marginTop = ''
  let marginBottom = ''

  if (mt) {
    marginTop = `mt-${mt}`
  }
  if (mb) {
    marginBottom = `mt-${mb}`
  }

  const selected = useWatch({ name })
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputvalue] = useState(selected?.name || '')
  const [flitered, setFiltered] = useState(options)
  const inputRef = useRef<Nullable<HTMLInputElement>>(null)
  const scrollableDivRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<Nullable<number>>(null)
  const [isReverse, setIsReverse] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const {
    register,
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext()
  const errorObj = get(errors, name)

  const error = errorObj && errorObj.message ? (errorObj.message as string) : null

  useEffect(() => {
    register(name, { value: initValue })
  }, [])

  const handleToggle = () => {
    if (isDisabled) return
    setOpen(!open)

    if (!open) {
      dispatch(handleDisableScroll())
    } else {
      dispatch(handleAllowScroll())
    }
  }

  const handleClose = () => {
    if (inputRef && inputRef.current) inputRef.current.blur()
    setOpen(false)
    setIsReverse(false)
    dispatch(handleAllowScroll())
  }

  const handleOnChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(name, '')
    setInputvalue(e.target.value)
    setFiltered(options.filter((opt) => opt.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())))
  }

  const outlineStyle = () => {
    if (error) return 'border-red'
    if (open) return 'border-green'
    return 'border-grey'
  }

  const handleScroll = () => {
    if (scrollableDivRef.current) {
      const { scrollTop, clientHeight } = scrollableDivRef.current

      if (scrollTop > contentHeight! - (clientHeight + 5)) {
        scrollableDivRef.current.scrollTop = contentHeight! - (clientHeight + 5)
      }
    }
  }

  useEffect(() => {
    if (scrollableDivRef.current && open) {
      setContentHeight(scrollableDivRef.current.scrollHeight)
    }
  }, [scrollableDivRef, open])

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) setIsReverse(true)
    })
  }

  useEffect(() => {
    let observer: IntersectionObserver | null = null

    if (scrollableDivRef.current && open) {
      observer = new IntersectionObserver(handleIntersection, OVERFLOW_OPTION)
      observer.observe(scrollableDivRef.current)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [scrollableDivRef, open])

  useEffect(() => {
    setInputvalue(selected?.name || '')
  }, [selected?.name])

  useEffect(() => {
    setFiltered(options)
  }, [options])

  return (
    <div className={`flex flex-col relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${marginTop} ${marginBottom}`}>
      <Label htmlFor={name} label={label} isRequired={isRequired} isLabelHidden={isLabelHidden} />

      <div
        className={`flex items-center jusfity-between bg-white ${compact ? 'h-9 px-3' : 'h-12 px-4'} block w-full rounded-xs-plus border-1 border-solid ${outlineStyle()} border-solid`}
        onClick={handleToggle}
      >
        <input
          disabled={isDisabled}
          autoComplete="off"
          ref={inputRef}
          value={inputValue}
          type="text"
          name={`${name}-text-search`}
          className={`flex-1 min-w-0 font-poppins ${
            isDisabled ? 'cursor-not-allowed' : ''
          } focus:ring-transparent focus:border-transparent focus:outline-none focus-visible:ring-none ${
            selected ? 'text-sm text-black' : 'text-sm text-grey'
          }`}
          placeholder={placeholder}
          onChange={handleOnChangeInput}
        />

        <GeneralIcons type="ArrowSelect" className={`${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <>
          <div className={`absolute ${isReverse ? 'bottom-full' : 'top-full'} w-full z-10`}>
            <div className="h-1.5 bg-transparent" />
            <div
              ref={scrollableDivRef}
              onScroll={handleScroll}
              className="shadow-drop-down bg-white w-full rounded-xs-plus max-h-60 overflow-y-scroll border-1 border-light-grey-alt border-solid"
            >
              {flitered.map((option, index) => (
                <SingleOption
                  handleOnClick={() => {
                    if (selected?.value === option.value) {
                      setValue(name, {})
                      setInputvalue('')
                    } else {
                      setValue(name, option)
                      setInputvalue(option.name)
                    }
                    setOpen(false)

                    clearErrors(name)

                    if (onClickCallback) onClickCallback()

                    dispatch(handleAllowScroll())
                  }}
                  option={option}
                  checked={selected ? selected.value === option.value : false}
                  key={index}
                />
              ))}
            </div>
            {isReverse && <div className="h-1.5 bg-transparent" />}
          </div>
          <div className="fixed top-0 left-0 right-0 bottom-0 z-5" onClick={handleClose} />
        </>
      )}

      <ErrorMessage name={error} variant={errorMessageType} />
    </div>
  )
}

export default SingleSelect
