import { PropsWithChildren } from 'react'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import Logo from '@/src/icons/Logo'

type LandingLayoutProps = {
  title: string
  subtitle?: string
}

const LandingLayout = ({ children, title, subtitle }: PropsWithChildren<LandingLayoutProps>) => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2">
      <div className="col-span-1 bg-green overflow-hidden hidden md:flex md:items-center md:justify-center p-6">
        <Logo type="WHITE" className="z-2 h-96 w-96" />
      </div>

      <div className="bg-black flex items-center justify-center z-2 col-span-1 md:col-span-2 lg:col-span-1">
        <div className="bg-white p-6 rounded-large w-1/2 flex flex-col items-center">
          <Heading variant="1" text={title} />
          {subtitle && <Paragraph text={subtitle} size="sm" color="grey" className="mt-2" />}
          {children}
        </div>
      </div>
    </div>
  )
}

export default LandingLayout
