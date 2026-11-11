import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'

type Props = {
  label: string
  value?: string | null
}

const CompanyInfoItem = ({ label, value }: Props) => (
  <div>
    <Paragraph text={label} size="sm" />
    <Heading text={value || '-'} variant="3" size="base" color="black" />
  </div>
)

export default CompanyInfoItem
