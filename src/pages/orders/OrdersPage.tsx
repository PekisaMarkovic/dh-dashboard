import GeneralLayout from '@/src/layouts/GeneralLayout'
import Orders from '@/src/modules/orders/Orders'

const OrdersPage = () => (
  <GeneralLayout isBottomHidden>
    <Orders />
  </GeneralLayout>
)

export default OrdersPage
