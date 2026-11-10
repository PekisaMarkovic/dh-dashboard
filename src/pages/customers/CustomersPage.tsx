import GeneralLayout from '@/src/layouts/GeneralLayout'
import Customers from '@/src/modules/customers/Customers'

const CustomersPage = () => (
  <GeneralLayout isBottomHidden>
    <Customers />
  </GeneralLayout>
)

export default CustomersPage
