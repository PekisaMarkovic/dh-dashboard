import { ChangeEventHandler, Fragment, useEffect, useRef, useState } from 'react'
import DropdownIcon from '@/src/public/images/general/select-dropdown-arrow.svg'
import SingleOption from '@/src/components/core/select/partials/SingleOption'
import { useFormContext, useWatch } from 'react-hook-form'
import { Nullable, SelectOption } from '@/src/interfaces'
import { OVERFLOW_OPTION } from '@/src/constatns/select'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { handleAllowScroll, handleDisableScroll } from '@/src/state/shared/behaviours'

type Props = {
  placeholder?: string
  options: SelectOption[]
  name: string
  initValue?: SelectOption
  occupied?: SelectOption[]
  isDisabled?: boolean
  handleOnChangeSideEffect?: () => void
}

const SimpleSingleSelect = ({ placeholder, options, name, initValue, handleOnChangeSideEffect, occupied = [], isDisabled }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const selected = useWatch({ name })
  const occupiedKeys = occupied.map((opt) => opt.value)
  const [inputValue, setInputvalue] = useState(selected ? selected.name : '')
  const [flitered, setFiltered] = useState(options)
  const inputRef = useRef<Nullable<HTMLInputElement>>(null)
  const [isReverse, setIsReverse] = useState<boolean>(false)
  const scrollableDivRef = useRef<Nullable<HTMLDivElement>>(null)
  const dispatch = useAppDispatch()
  const { register, setValue } = useFormContext()

  useEffect(() => {
    register(name, { value: initValue })
  }, [])

  const handleOpen = () => {
    if (isDisabled) return
    setOpen(!open)
    dispatch(handleDisableScroll())
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

  return (
    <div className={`flex flex-col relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleOpen}>
      <div className={`flex items-center jusfity-between bg-white block w-full rounded-xs-plus`}>
        <input
          autoComplete="off"
          name={`${name}-text-search`}
          disabled={isDisabled}
          ref={inputRef}
          value={inputValue}
          className={`flex-1 font-poppins focus:ring-transparent focus:border-transparent focus:outline-none focus-visible:ring-none ${
            isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } ${selected ? 'text-sm text-black' : 'text-sm text-grey'}`}
          placeholder={placeholder}
          onChange={handleOnChangeInput}
        />

        <DropdownIcon className={`${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <>
          <div className={`absolute ${isReverse ? 'bottom-full' : 'top-full'} w-full z-10`}>
            <div className="h-1.5 bg-transparent" />
            <div
              ref={scrollableDivRef}
              className="shadow-drop-down bg-white rounded-xs-plus max-h-60 overflow-y-scroll border-1 border-light-grey-alt border-solid"
            >
              {flitered.map((option, index) => (
                <Fragment key={index}>
                  {!occupiedKeys.includes(option.value) ? (
                    <SingleOption
                      noWrap
                      handleOnClick={() => {
                        if (selected?.value === option.value) {
                          setValue(name, {})
                          setInputvalue('')
                        } else {
                          setValue(name, option)
                          setInputvalue(option.name)
                        }
                        if (handleOnChangeSideEffect) handleOnChangeSideEffect()

                        dispatch(handleAllowScroll())
                      }}
                      option={option}
                      checked={selected ? selected.value === option.value : false}
                    />
                  ) : null}
                </Fragment>
              ))}
            </div>
            {isReverse && <div className="h-1.5 bg-transparent" />}
          </div>
          <div className="fixed top-0 left-0 right-0 bottom-0 z-5" onClick={handleClose} />
        </>
      )}
    </div>
  )
}

export default SimpleSingleSelect
