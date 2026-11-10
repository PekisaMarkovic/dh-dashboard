import { Nullable } from '@/src/interfaces'
import { InputVaraint } from '@/src/components/core/input/InputText'

export const inputTextStyle = ({
  error,
  textCenter,
  variant,
  disabled,
}: {
  variant: InputVaraint
  error: Nullable<string>
  textCenter: boolean | undefined
  disabled: boolean | undefined
}) => {
  switch (variant) {
    case 'simple':
      return `font-poppins bg-white border-none ${
        textCenter ? 'text-center' : ''
      } text-sm text-black placeholder:text-text-grey focus:ring-green focus:border-green focus:outline-none focus-visible:ring-green block ${
        disabled ? 'cursor-not-allowed' : ''
      }`

    default:
      return `font-poppins bg-white border-1 ${
        error ? 'border-red border-solid' : 'border-grey border-solid'
      } text-sm text-black placeholder:text-text-grey h-12 px-4 focus:ring-green focus:border-green focus:outline-none focus-visible:ring-green block w-full rounded-xs-plus ${
        disabled ? 'cursor-not-allowed' : ''
      }`
  }
}
