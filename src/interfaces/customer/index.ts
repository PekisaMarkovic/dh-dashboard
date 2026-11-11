export interface ICustomer {
  customerId: number
  // older customers may have no code
  code?: string | null
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
