import { Color } from '@/src/interfaces'

type Props = {
  variant?: Color
}
const TabUnderline = ({ variant = 'green' }: Props) => {
  return <div className={`absolute w-full h-1 bg-${variant} rounded-t-xxl bottom-0`} />
}

export default TabUnderline
