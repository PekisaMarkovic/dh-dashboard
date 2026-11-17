import { useTranslation } from 'react-i18next'
import Heading from '@/src/components/core/typography/Heading'
import { VAT_RATE_PERCENT } from '@/src/constatns/vat'
import { formatCents } from '@/src/utils/money'

type Props = {
  /** the amount to pay (with VAT), in cents */
  grossCents: number
  /** the VAT inside it, in cents */
  vatCents: number
}

/**
 * The three amounts of a proforma in one row: without VAT, the VAT and what is to be paid (the prices include VAT).
 */
const ProformaTotals = ({ grossCents, vatCents }: Props) => {
  const { t } = useTranslation('proforma')

  return (
    <div className="flex flex-wrap items-baseline justify-end gap-x-8 gap-y-1 whitespace-nowrap">
      <div className="flex items-baseline gap-x-2">
        <Heading text={t('totals.net')} variant="3" size="sm" color="grey" />
        <Heading text={formatCents(grossCents - vatCents)} variant="3" size="base" color="black" />
      </div>
      <div className="flex items-baseline gap-x-2">
        <Heading text={t('totals.vat', { rate: VAT_RATE_PERCENT })} variant="3" size="sm" color="grey" />
        <Heading text={formatCents(vatCents)} variant="3" size="base" color="black" />
      </div>
      <div className="flex items-baseline gap-x-2">
        <Heading text={t('totals.gross')} variant="3" size="base" color="grey" />
        <Heading text={formatCents(grossCents)} variant="3" size="xl" color="black" />
      </div>
    </div>
  )
}

export default ProformaTotals
