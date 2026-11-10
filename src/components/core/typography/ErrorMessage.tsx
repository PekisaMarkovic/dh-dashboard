import { useTranslation } from 'react-i18next'

export type Variant = 'input' | 'select' | 'upload' | 'custom'

type Props = {
  message?: string
  name?: string | null
  variant?: Variant
}
const ErrorMessage = ({ name, variant, message }: Props) => {
  const { t } = useTranslation(['er'])

  if (message) return <span className="font-poppins text-sm text-red">{message}</span>

  return <>{name && <span className="font-poppins text-sm text-red">{t(`er:${variant}`, { field: t(`er:fields.${name}`) })}</span>}</>
}

export default ErrorMessage
