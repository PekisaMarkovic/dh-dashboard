import { ChangeEventHandler, Fragment, ReactNode, useEffect, useRef, useState } from 'react'
import DropdownIcon from '@/src/public/images/general/select-dropdown-arrow.svg'
import Divider from '../divider/Divider'
import MultySelectedOption from './partials/MultySelectedOption'
import CheckboxOption from '../checkbox/CheckboxOption'
import { useFormContext, useWatch } from 'react-hook-form'
import Label from '../typography/Label'
import ErrorMessage from '../typography/ErrorMessage'
import get from 'lodash.get'
import SearchIcon from '@/public/images/general/search.svg'
import { useTranslation } from 'react-i18next'
import { OVERFLOW_OPTION } from '@/src/constatns/select'
import { Nullable, SelectOption } from '@/src/interfaces'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { handleAllowScroll, handleDisableScroll } from '@/src/state/shared/behaviours'

type Variant = 'primary' | 'secondary' | 'extended'

type Props = {
  placeholder?: string
  label: string
  isRequired?: boolean
  isHalfSize?: boolean
  options: SelectOption[]
  occupied?: SelectOption[]
  name: string
  initValue?: SelectOption[]
  variant?: Variant
  multySelectContainerClass?: string
  isDisabled?: boolean
  labelIcon?: ReactNode
}

const MultySelect = ({
  name,
  label,
  placeholder,
  isRequired,
  options,
  initValue,
  variant,
  multySelectContainerClass,
  isHalfSize,
  isDisabled,
  occupied = [],
  labelIcon,
}: Props) => {
  const { t } = useTranslation(['g'])
  const selected = useWatch({ name })
  const selectedVals = selected ? selected.map((sel: SelectOption) => sel.value) : []
  const occupiedKeys = occupied.map((opt: SelectOption) => opt?.value)
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputvalue] = useState('')
  const [flitered, setFiltered] = useState(options)
  const [isReverse, setIsReverse] = useState<boolean>(false)
  const scrollableDivRef = useRef<Nullable<HTMLDivElement>>(null)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const isExtended = variant === 'extended'
  const position = isExtended && selected ? (isReverse ? 'bottom-full' : 'top-14') : isReverse ? 'bottom-full' : 'top-full'
  const dispatch = useAppDispatch()

  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const errorObj = get(errors, name)

  const error = errorObj && errorObj.message ? (errorObj.message as string) : null

  useEffect(() => {
    register(name, { value: initValue })
  }, [])

  const handleOpen = () => {
    if (isDisabled) return
    setOpen(!open)
    dispatch(handleDisableScroll())
  }
  const handleClose = () => {
    setIsSearching(false)
    setOpen(false)
    dispatch(handleAllowScroll())
  }

  const classes = () => {
    if (isHalfSize) return 'w-1/2'
    return 'w-full'
  }

  const outlineStyle = () => {
    if (error && !selected) return 'border-red border-solid'
    if (open) return 'border-green border-solid'
    return 'border-grey border-solid'
  }

  const handleOnChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsSearching(true)
    setInputvalue(e.target.value)
    setFiltered(options.filter((opt) => opt.name.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase())))
  }

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

      if (!open) {
        setInputvalue('')
        setFiltered(options)
      }
    }
  }, [scrollableDivRef, open])

  return (
    <div className={`flex flex-col relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <Label htmlFor={name} label={label} isRequired={isRequired} rightIcon={labelIcon} />

      <div
        className={`flex items-center jusfity-between bg-white py-3 px-4 block rounded-xs-plus border-1 ${outlineStyle()} ${multySelectContainerClass} ${classes()}`}
        onClick={handleOpen}
      >
        {variant !== 'extended' && selected && selected.length ? (
          <div className="flex-1 flex flex-wrap gap-1">
            <MultySelectedOption
              option={selected[0]}
              handleOnClick={() => {
                const newValues = selected.filter((opt: SelectOption) => opt.id != selected[0].id)
                setValue(name, newValues)
              }}
            />
            {selected.length > 1 && (
              <MultySelectedOption
                option={selected[1]}
                handleOnClick={() => {
                  const newValues = selected.filter((opt: SelectOption) => opt.id != selected[1].id)
                  setValue(name, newValues)
                }}
              />
            )}
            {selected.length > 2 && (
              <p className="font-poppins text-sm flex flex-wrap gap-1.5 items-center bg-light-grey-transparent border-1 border-light-grey-alt rounded-xxl px-2.5 py-0.5">
                +{selected.length - 2}
              </p>
            )}
          </div>
        ) : (
          <p className="flex-1 font-poppins text-sm text-grey">{placeholder}</p>
        )}

        <DropdownIcon className={`${open ? 'rotate-180' : ''}`} />
      </div>

      {isExtended && selected && (
        <div className={`flex-1 flex flex-wrap gap-1 ${selectedVals.length > 0 ? 'my-4' : 'mt-4'}`}>
          {selected
            .filter((sel: SelectOption) => !occupiedKeys.includes(sel.value))
            .map((sel: SelectOption, index: number) => (
              <MultySelectedOption
                key={index}
                option={sel}
                handleOnClick={() => {
                  setIsSearching(false)
                  const newValues = selected.filter((opt: SelectOption) => opt.id != sel.id)
                  setValue(name, newValues)
                }}
              />
            ))}
        </div>
      )}

      {open && (
        <>
          <div className={`absolute ${position} z-10 ${classes()}`}>
            <div className="h-1 bg-transparent" />

            <div
              ref={scrollableDivRef}
              className={`shadow-drop-down bg-white rounded-xs-plus max-h-60 overflow-y-scroll border-1 border-light-grey-alt`}
            >
              <div className="flex items-center gap-x-1 px-3 border-1 border-light-grey-alt mx-2 mt-4 mb-3 rounded-xxl">
                <SearchIcon />
                <input
                  autoComplete="off"
                  value={inputValue}
                  className={`py-2 flex-1 font-poppins focus:ring-transparent focus:border-transparent focus:outline-none focus-visible:ring-none w-full ${
                    selected ? 'text-sm text-black' : 'text-sm text-grey'
                  }`}
                  placeholder={t('g:search')}
                  onChange={handleOnChangeInput}
                  name={`${name}-text-search`}
                />
              </div>

              <div className={isSearching ? `max-h-28 overflow-y-scroll` : ''}>
                {selected &&
                  selected.map((selectedOpt: SelectOption, index: number) => (
                    <CheckboxOption
                      name=""
                      checked
                      key={index}
                      handleOnClick={() => {
                        const newValue = selected.filter((opt: SelectOption) => opt.id != selectedOpt.id)
                        setValue(name, newValue)
                      }}
                      label={selectedOpt.name}
                    />
                  ))}
              </div>

              {selected && selected.length ? <Divider className="mt-2 mb-2" /> : null}

              {flitered.map((option, index) => {
                return (
                  <Fragment key={index}>
                    {!selectedVals.includes(option.value) && !occupiedKeys.includes(option.value) && (
                      <CheckboxOption
                        name=""
                        checked={false}
                        key={index}
                        handleOnClick={() => {
                          if (!selectedVals.includes(option.value)) {
                            const newValues = selected ? [...selected, option] : [option]
                            setValue(name, newValues)
                            clearErrors(name)
                            setInputvalue('')
                            setIsSearching(false)
                          }
                        }}
                        label={option.name}
                      />
                    )}
                  </Fragment>
                )
              })}
            </div>
            {isReverse && <div className="h-2 bg-transparent" />}
          </div>
          <div className="fixed top-0 left-0 right-0 bottom-0 z-5" onClick={handleClose} />
        </>
      )}

      <ErrorMessage name={error} variant="select" />
    </div>
  )
}

export default MultySelect
