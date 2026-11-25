type Props = {
  // public address of the image, empty = the drink has no image and the placeholder is shown
  src?: string | null
  alt: string
  // sm: in the lists, md: the picked recommended drinks, lg: in the modal
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASS = { sm: 'h-10 w-10 rounded-md', md: 'h-16 w-16 rounded-lg', lg: 'h-24 w-24 rounded-lg' }
const ICON_CLASS = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-12 w-12' }

// the image of a drink, a bottle icon while the drink has none
const DrinkImage = ({ src, alt, size = 'sm' }: Props) => (
  <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-gray-50 ${SIZE_CLASS[size]}`}>
    {src ? (
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-contain" />
    ) : (
      <svg viewBox="0 0 48 48" className={`${ICON_CLASS[size]} text-gray-300`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 4h8v8l3 5c.6 1 1 2.1 1 3.2V42a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V20.2c0-1.1.4-2.2 1-3.2l3-5V4Z" />
        <path d="M16 26h16M16 36h16" />
      </svg>
    )}
  </div>
)

export default DrinkImage
