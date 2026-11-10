import { Color } from '@/src/interfaces'
import Divider from '@/src/components/core/divider/Divider'

type Props = {
  text: string
  color: Color
}

const DividerWithText = ({ text, color }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center relative">
      <Divider className="w-full absolute top-1/2" />
      <p className={`relative z-10 px-2.5 text-xs text-${color} font-inter font-medium bg-white`}>{text}</p>
    </div>
  )
}

export default DividerWithText
