import { FontFamily } from '@/src/interfaces'
import { Size, Variant } from '@/src/components/core/buttons/MainButton'

export const style = ({
  fontFamily,
  size,
  variant,
  disabled,
}: {
  fontFamily: FontFamily
  size: Size
  variant: Variant
  disabled: boolean
}): string => {
  const classes: string[] = [`font-${fontFamily} flex items-center gap-x-1 relative`]

  if (disabled) classes.push('cursor-not-allowed')

  switch (size) {
    case 'large':
      classes.push('py-4 px-8 text-sm rounded-xxxl')
      break

    case 'medium':
      classes.push('py-2 px-6 text-sm rounded-xxl-plus')
      break

    case 'small':
      classes.push('py-2 px-6 text-sm rounded-sm')

      break

    case 'extra-small':
      classes.push('py-1 px-4 text-sm rounded-sm')
      break

    case 'full':
      classes.push('py-2 px-6 text-sm rounded-xxl-plus w-full flex items-center justify-center')
      break

    default:
      classes.push('py-2 px-6 text-sm rounded-xxl')
      break
  }

  const variantDefault = 'text-white bg-green hover:text-green hover:bg-white border-green border-1 border-solid'
  switch (variant) {
    case 'contained':
      classes.push(variantDefault)
      break

    case 'outlined':
      classes.push('text-green bg-white hover:text-white hover:bg-green border-green border-1 border-solid')
      break

    case 'alternative':
      classes.push('text-black border-grey border-1 bg-transparent  hover:bg-lighy-grey border-solid')
      break

    case 'text':
      classes.push('text-black hover:text-green bg-transparent border-transparent border-1 border-solid')
      break

    default:
      classes.push(variantDefault)
      break
  }

  return classes.join(' ')
}
