import { SelectOption } from '@/src/interfaces'

type Props = {
  option: SelectOption
  handleOnClick?: () => void
}

const MultySelectedOption = ({ option, handleOnClick }: Props) => (
  <p className="font-poppins text-sm flex flex-wrap gap-1.5 items-center bg-light-grey-transparent border-1 border-lighy-grey border-solid rounded-xxl px-2.5 py-0.5">
    {option.name}
    {handleOnClick && (
      <button
        type="button"
        aria-label={option.name}
        // the chip is inside the select: the click removes the option and does not open the list
        onClick={(event) => {
          event.stopPropagation()
          handleOnClick()
        }}
        className="text-grey hover:text-red"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    )}
  </p>
)

export default MultySelectedOption
