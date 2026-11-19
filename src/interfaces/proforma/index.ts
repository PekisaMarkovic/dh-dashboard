export interface IProformaItem {
  proformaItemId: number
  // empty when the drink was deleted after the proforma was made
  drinkId?: number | null
  code?: string | null
  name: string
  unitPrice: number
  quantity: number
  discountPercent: number
  lineTotal: number
}

export type ProformaStatus = 'active' | 'returned'

export interface IProforma {
  proformaId: number
  number: string
  warehouseId: number
  warehouseName: string
  customerId?: number | null
  customerName?: string | null
  // the amount without VAT, the VAT and what is to be paid
  total: number
  vatAmount: number
  totalWithVat: number
  createdAt: string
  status: ProformaStatus
  returnedAt?: string | null
  createdByName?: string
  items?: IProformaItem[]
}
