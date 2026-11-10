type Props = {
  page: number
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPage: Function
  isActive: boolean
}
const SinglePage = ({ isActive, page, setPage }: Props) => {
  return (
    <li
      key={page}
      className={`cursor-pointer fonts-poppins py-1 px-2 ${isActive ? 'bg-green text-white' : 'bg-lighy-grey text-dark-grey'} rounded-sm`}
      onClick={() => setPage(page)}
    >
      {page}
    </li>
  )
}

export default SinglePage
