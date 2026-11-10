export interface IProformaItem {
  proformaItemId: number
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
