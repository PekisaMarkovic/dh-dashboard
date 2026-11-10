export interface IDrink {
  drinkId: number
  name: string
  price: number
  quantity: number
  warehouseId: number
  companyId: number
}

export interface IWarehouse {
  warehouseId: number
  name: string
  companyId: number
}
