import { useTranslation } from 'react-i18next'
import Badge, { BadgeTone } from '@/src/components/core/indicators/Badge'
import { getImportState } from '@/src/utils/purchase-import'

type Props = Parameters<typeof getImportState>[0]

const TONE: Record<string, BadgeTone> = {
  parsing: 'grey',
  parsed: 'orange',
  partial: 'orange',
  applied: 'green',
  failed: 'red',
}

const PurchaseImportStatusPill = (props: Props) => {
  const { t } = useTranslation(['purchase'])
  const state = getImportState(props)

  return <Badge text={t(`purchase:history.status.${state}`)} tone={TONE[state]} />
}

export default PurchaseImportStatusPill
