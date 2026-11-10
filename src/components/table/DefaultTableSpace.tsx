type Props = {
  isLast?: boolean
}

const DefaultTableSpace = ({ isLast }: Props) => (
  <div
    className={`relative pl-4 pr-6 grid grid-cols-6 ${isLast ? 'border-b-1 border-b-light-grey-alt border-solid' : 'border-b-1 border-b-transparent border-solid'} h-11`}
  />
)

export default DefaultTableSpace
