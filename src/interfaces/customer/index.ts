export interface ICustomer {
  customerId: number
  name: string
  companyId: number
  createdAt: string
  updatedAt: string
}

// only what a select needs
export interface ICustomerOption {
  customerId: number
  name: string
}
