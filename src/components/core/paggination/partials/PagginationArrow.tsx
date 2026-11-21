import GeneralIcons from '@/src/icons/general'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPage: Function
  disabled: boolean
  reverse: boolean
}

const PagginationArrow = ({ disabled, setPage, reverse }: Props) => {
  const handleClick = () => setPage()

  return (
    <li
      aria-disabled={disabled}
      className={`flex justify-center items-center min-w-8 h-8 px-1.5 md:min-w-9 md:h-9 md:px-2 select-none bg-lighy-grey text-dark-grey ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-1 cursor-pointer'
      } rounded-sm`}
      onClick={handleClick}
    >
      <GeneralIcons type="ArrowRight" className={`h-3 w-[6.5px] md:h-[13px] md:w-[7px] ${reverse ? 'rotate-180' : ''}`} />
    </li>
  )
}

export default PagginationArrow
