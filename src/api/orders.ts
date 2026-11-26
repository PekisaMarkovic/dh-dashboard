const base = 'orders'

const getOrders = () => base
const getOrder = (id: number) => `${base}/${id}`
const patchOrderStatus = (id: number) => `${base}/${id}/status`
const getOrdersEnabled = () => `${base}/enabled`

const OrderApis = { getOrders, getOrder, patchOrderStatus, getOrdersEnabled }

export default OrderApis
