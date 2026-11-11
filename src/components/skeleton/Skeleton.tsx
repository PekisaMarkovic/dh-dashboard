type Props = {
  className?: string
}

/**
 * A grey pulsing block that stands where the real content will be while it loads.
 * Give it the size with classes, e.g. "h-4 w-40".
 */
const Skeleton = ({ className = '' }: Props) => <div aria-hidden="true" className={`animate-pulse rounded-xs bg-lighy-grey ${className}`} />

export default Skeleton
