import WarehouseIcon from '@/src/icons/navigation/WarehouseIcon'
import DrinkIcon from '@/src/icons/navigation/DrinkIcon'
import ProformaIcon from '@/src/icons/navigation/ProformaIcon'
import CompanyIcon from '@/src/icons/navigation/CompanyIcon'
import ImportIcon from '@/src/icons/navigation/ImportIcon'
import CustomerIcon from '@/src/icons/navigation/CustomerIcon'
import WebsiteIcon from '@/src/icons/navigation/WebsiteIcon'

export type NavigationIconType = 'Warehouse' | 'Drink' | 'Customer' | 'Proforma' | 'Company' | 'Import' | 'Website'

interface Props extends React.SVGProps<SVGSVGElement> {
  type: NavigationIconType
}

const NavigationIcons = ({ type, ...rest }: Props) => {
  switch (type) {
    case 'Warehouse':
      return <WarehouseIcon {...rest} />
    case 'Drink':
      return <DrinkIcon {...rest} />
    case 'Customer':
      return <CustomerIcon {...rest} />
    case 'Proforma':
      return <ProformaIcon {...rest} />
    case 'Import':
      return <ImportIcon {...rest} />
    case 'Company':
      return <CompanyIcon {...rest} />
    case 'Website':
      return <WebsiteIcon {...rest} />

    default:
      return null
  }
}

export default NavigationIcons
