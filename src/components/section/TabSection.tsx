import { PropsWithChildren } from 'react'

const TabSection = ({ children }: PropsWithChildren) => {
  return <div className="flex gap-x-10 items-center border-b-1 border-b-lighy-grey flex-1 border-solid">{children}</div>
}

export default TabSection
