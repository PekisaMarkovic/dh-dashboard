import { Variant } from './NavigationLink'

export const style = (isActive: boolean, variant: Variant): string => {
  switch (variant) {
    case 'tab':
      if (isActive) return 'relative tab tab--activ relative flex items-center gap-x-1 font-poppins py-3.5 text-sm  text-grey-secondary'

      return 'relative tab tab--in-activ relative flex items-center gap-x-1 font-poppins py-3.5 text-sm text-grey'

    default:
      if (isActive)
        return 'relative side side--activ flex items-center gap-x-1 font-poppins py-2.5 px-1 border-1 border-light-grey-alt border-solid bg-light-grey-transparent text-grey-secondary text-sm rounded-sm'

      return 'relative side side--in-activ flex items-center gap-x-1 font-poppins py-2.5 px-1 border-1 border-transparent border-solid bg-transparent text-dark-grey text-sm rounded-sm'
  }
}
