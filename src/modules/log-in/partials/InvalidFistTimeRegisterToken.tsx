import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import MainLink from '@/src/components/core/buttons/MainLink'

const InvalidFistTimeRegisterToken = () => {
  const { t } = useTranslation(['log-in', 'g'])

  return (
    <div className="w-full flex flex-col gap-y-4 mt-8">
      <Paragraph text={t('log-in:invitation.invalid')} size="lg" color="red" className="mb-2 text-center ml-auto mr-auto" />

      <MainLink href={ROUTE_NAMES.index} text={t('g:button.signIn')} variant="alternative" size="medium" className="justify-center" />
    </div>
  )
}

export default InvalidFistTimeRegisterToken
