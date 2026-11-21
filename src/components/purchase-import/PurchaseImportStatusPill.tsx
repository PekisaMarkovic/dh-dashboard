import { useTranslation } from 'react-i18next'
import { getImportState } from '@/src/utils/purchase-import'

type Props = Parameters<typeof getImportState>[0]

const STYLE: Record<string, string> = {
  parsing: 'bg-light-grey-transparent text-grey',
  parsed: 'bg-orange-50 text-dark-orange',
  partial: 'bg-orange-50 text-dark-orange',
  applied: 'bg-green-transparent text-green',
  failed: 'bg-red-50 text-red',
}

const PurchaseImportStatusPill = (props: Props) => {
  const { t } = useTranslation(['purchase'])
  const state = getImportState(props)

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 font-poppins text-xs font-medium ${STYLE[state]}`}>
      {t(`purchase:history.status.${state}`)}
    </span>
  )
}

export default PurchaseImportStatusPill
