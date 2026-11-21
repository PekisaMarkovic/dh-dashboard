type Props = {
  page: number
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPage: Function
  isActive: boolean
}

// the same size as the arrows, big enough for a finger
const SinglePage = ({ isActive, page, setPage }: Props) => {
  const handleClick = () => setPage(page)

  return (
    <li
      key={page}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center justify-center min-w-8 h-8 px-1.5 text-xs md:min-w-9 md:h-9 md:px-2 md:text-sm cursor-pointer select-none font-poppins ${
        isActive ? 'bg-green text-white' : 'bg-lighy-grey text-dark-grey'
      } rounded-sm`}
      onClick={handleClick}
    >
      {page}
    </li>
  )
}

export default SinglePage
