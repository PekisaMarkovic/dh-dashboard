import { useMemo } from 'react'
import DrinkApis from '@/src/api/drinks'
import { useApi } from '@/src/hooks/use-api'
import { IDrink } from '@/src/interfaces'

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

export const useDrinkService = () => {
  const api = useApi()

  return useMemo(() => {
    // without a warehouse it returns the drinks of all warehouses
    const getDrinks = async (warehouseId?: number) => {
      const { data } = await api.get<IDrink[]>(DrinkApis.getDrinks(), { params: { warehouseId } })

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

    return { getDrinks, createDrink, updateDrink, deleteDrink }
  }, [api])
}
