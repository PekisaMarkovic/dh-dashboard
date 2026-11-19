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
}

type CreateDrinkBody = UpdateDrinkBody & {
  warehouseId: number
}

export type DrinkStockFilter = 'warning' | 'critical'

export type DrinkListParams = PageParams & { warehouseId?: number; stockLevel?: DrinkStockFilter }

export type StockDigestResult = { critical: number; warning: number; recipients: number }

export const useDrinkService = () => {
  const api = useApi()

  return useMemo(() => {
    // one page of drinks; without a warehouse it is the drinks of all warehouses
    const getDrinks = async ({ warehouseId, stockLevel, search, ...paging }: DrinkListParams) => {
      const { data } = await api.get<Paginated<IDrink>>(DrinkApis.getDrinks(), {
        params: { ...paging, warehouseId, stockLevel, search: search || undefined },
      })

      return data
    }

    const createDrink = async (body: CreateDrinkBody) => {
      const { data } = await api.post(DrinkApis.createDrink(), body)

      return data
    }

    const updateDrink = async (drinkId: number, body: UpdateDrinkBody) => {
      const { data } = await api.patch(DrinkApis.patchDrink(drinkId), body)

      return data
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

    return { getDrinks, createDrink, updateDrink, deleteDrink, sendStockDigest }
  }, [api])
}
