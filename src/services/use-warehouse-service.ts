import { useMemo } from 'react'
import WarehouseApis from '@/src/api/warehouses'
import { useApi } from '@/src/hooks/use-api'
import { IWarehouse } from '@/src/interfaces'

type CreateWarehouseBody = {
  name: string
  companyId?: number | null
}

type UpdateWarehouseBody = {
  name: string
}

export const useWarehouseService = () => {
  const api = useApi()

  return useMemo(() => {
    const getWarehouses = async () => {
      const { data } = await api.get<IWarehouse[]>(WarehouseApis.getWarehouses())

      return data
    }

    const createWarehouse = async (body: CreateWarehouseBody) => {
      const { data } = await api.post(WarehouseApis.createWarehouse(), body)

      return data
    }

    const updateWarehouse = async (warehouseId: number, body: UpdateWarehouseBody) => {
      const { data } = await api.patch(WarehouseApis.patchWarehouse(warehouseId), body)

      return data
    }

    const deleteWarehouse = async (warehouseId: number) => {
      await api.delete(WarehouseApis.deleteWarehouse(warehouseId))
    }

    return { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse }
  }, [api])
}
