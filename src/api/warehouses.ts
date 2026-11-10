const base = 'warehouses'

const getWarehouses = () => base
const createWarehouse = () => base
const patchWarehouse = (id: number) => `${base}/${id}`
const deleteWarehouse = (id: number) => `${base}/${id}`

const WarehouseApis = { getWarehouses, createWarehouse, patchWarehouse, deleteWarehouse }

export default WarehouseApis
