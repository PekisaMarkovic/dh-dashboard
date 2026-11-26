import { useMemo } from 'react'
import DrinkApis from '@/src/api/drinks'
import { useApi } from '@/src/hooks/use-api'
import { IDrink, PageParams, Paginated } from '@/src/interfaces'

type UpdateDrinkBody = {
  code: string
  name: string
  price: number
  quantity: number
  warningQuantity: number
  criticalQuantity: number
  // the sent list replaces the categories of the drink
  categoryIds: number[]
}

type CreateDrinkBody = UpdateDrinkBody & {
  warehouseId: number
}

export type DrinkStockFilter = 'warning' | 'critical'

export type DrinkListParams = PageParams & { warehouseId?: number; stockLevel?: DrinkStockFilter; categoryIds?: string }

export type StockDigestResult = { critical: number; warning: number; recipients: number }

export const useDrinkService = () => {
  const api = useApi()

  return useMemo(() => {
    // one page of drinks; without a warehouse it is the drinks of all warehouses
    // categoryIds: "1,4" = the drinks in any of these categories
    const getDrinks = async ({ warehouseId, stockLevel, categoryIds, search, ...paging }: DrinkListParams) => {
      const { data } = await api.get<Paginated<IDrink>>(DrinkApis.getDrinks(), {
        params: { ...paging, warehouseId, stockLevel, categoryIds, search: search || undefined },
      })

      return data
    }

    const createDrink = async (body: CreateDrinkBody) => {
      const { data } = await api.post<IDrink>(DrinkApis.createDrink(), body)

      return data
    }

    const updateDrink = async (drinkId: number, body: UpdateDrinkBody) => {
      const { data } = await api.patch<IDrink>(DrinkApis.patchDrink(drinkId), body)

      return data
    }

    // the api makes a WebP (at most 1200x1200) of any jpg / png / webp and replaces the old image
    const uploadDrinkImage = async (drinkId: number, file: File) => {
      const body = new FormData()
      body.append('file', file)
      // the api sends json by default, which would turn the form data into json and lose the file
      const { data } = await api.put<IDrink>(DrinkApis.drinkImage(drinkId), body, { headers: { 'Content-Type': 'multipart/form-data' } })

      return data
    }

    const deleteDrinkImage = async (drinkId: number) => {
      await api.delete(DrinkApis.drinkImage(drinkId))
    }

    const deleteDrink = async (drinkId: number) => {
      await api.delete(DrinkApis.deleteDrink(drinkId))
    }

    // not used by any button right now (the button on the drinks page was taken away, it can come back).
    // Sends the overview of the low stock to all employees right now (the same email as the one at 8:00)
    const sendStockDigest = async () => {
      const { data } = await api.post<StockDigestResult>(DrinkApis.sendStockDigest())

      return data
    }

    return { getDrinks, createDrink, updateDrink, uploadDrinkImage, deleteDrinkImage, deleteDrink, sendStockDigest }
  }, [api])
}
