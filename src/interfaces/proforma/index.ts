export interface IProformaItem {
  proformaItemId: number
  name: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export type ProformaStatus = 'active' | 'returned'

export interface IProforma {
  proformaId: number
  number: string
  warehouseId: number
  warehouseName: string
  total: number
  createdAt: string
  status: ProformaStatus
  returnedAt?: string | null
  createdByName?: string
  items?: IProformaItem[]
}
