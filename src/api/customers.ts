const base = 'customers'

const getCustomers = () => base
const createCustomer = () => base
const patchCustomer = (id: number) => `${base}/${id}`
const deleteCustomer = (id: number) => `${base}/${id}`

const CustomerApis = { getCustomers, createCustomer, patchCustomer, deleteCustomer }

export default CustomerApis
