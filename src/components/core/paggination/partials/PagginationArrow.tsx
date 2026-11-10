import GeneralIcons from '@/src/icons/general'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPage: Function
  disabled: boolean
  reverse: boolean
}

const PagginationArrow = ({ disabled, setPage, reverse }: Props) => {
  return (
    <li
      className={`flex justify-center items-center fonts-poppins py-1 px-5 bg-lighy-grey text-dark-grey ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-1 cursor-pointer'
      } rounded-sm`}
      onClick={() => setPage()}
    >
      <GeneralIcons type="ArrowRight" className={`${reverse ? 'rotate-180' : ''}`} />
    </li>
  )
}

export default PagginationArrow
