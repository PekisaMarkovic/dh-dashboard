export interface IDrink {
  drinkId: number
  code: string
  name: string
  price: number
  quantity: number
  // below this quantity the drink is orange (0 = off)
  warningQuantity: number
  // below this quantity the drink has to be bought again and is red (0 = off)
  criticalQuantity: number
  warehouseId: number
  companyId: number
  // the image of the drink (WebP, at most 1200x1200), null = no image
  image: IImage | null
  // the categories of the drink (the lists and the detail load them)
  categories?: ICategory[]
}

// a category of drinks of the company (Pivo, Vino...), a drink can be in several
export interface ICategory {
  categoryId: number
  name: string
  // only in the list of the categories: how many drinks are in it
  drinksCount?: number
}

export interface IImage {
  imageId: number
  // public address of the file
  url: string
  mimeType: string
  // bytes
  size: number
  width: number
  height: number
  altText: string | null
}

export interface IWarehouse {
  warehouseId: number
  name: string
  companyId: number
  // the preselected warehouse of the company, only one is default
  isDefault: boolean
  // how many drinks it has and what they are worth in cents, calculated by the api
  drinksCount: number
  totalValueCents: number
}
