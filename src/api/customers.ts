const base = 'customers'

const getCustomers = () => base
const getCustomerOptions = () => `${base}/options`
const createCustomer = () => base
const patchCustomer = (id: number) => `${base}/${id}`
const deleteCustomer = (id: number) => `${base}/${id}`

const CustomerApis = { getCustomers, getCustomerOptions, createCustomer, patchCustomer, deleteCustomer }

export default CustomerApis
