type Props = {
  className: string
}

const Divider = ({ className }: Props) => {
  return <div className={`h-px bg-lighy-grey ${className}`} />
}

export default Divider
