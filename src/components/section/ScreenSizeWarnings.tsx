import { PropsWithChildren, useEffect, useState } from 'react'
import Paragraph from '@/src/components/core/typography/Paragraph'
import Logo from '@/src/icons/Logo'
import { useTranslation } from 'react-i18next'

const ScreenSizeWarning = ({ children }: PropsWithChildren) => {
  const [showWarning, setShowWarning] = useState(false)
  const { t } = useTranslation(['g'])

  useEffect(() => {
    const checkScreenSize = () => {
      setShowWarning(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (!showWarning) return children

  return (
    <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-green ">
      <div className="w-1/2 flex items-center justify-center flex-col">
        <Logo type="WHITE" />

        <Paragraph size="lg" color="white" className="text-center mt-8" text={t('g:screenWraning')} />
      </div>
    </div>
  )
}
export default ScreenSizeWarning
