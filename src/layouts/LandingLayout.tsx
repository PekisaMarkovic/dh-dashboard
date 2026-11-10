import { PropsWithChildren } from 'react'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'

type LandingLayoutProps = {
  title: string
  subtitle?: string
}

const LandingLayout = ({ children, title, subtitle }: PropsWithChildren<LandingLayoutProps>) => {
  return (
    <div className="h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-large w-full max-w-md flex flex-col items-center">
        <Heading variant="1" text={title} />
        {subtitle && <Paragraph text={subtitle} size="sm" color="grey" className="mt-2" />}
        {children}
      </div>
    </div>
  )
}

export default LandingLayout
