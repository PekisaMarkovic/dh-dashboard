import { useMemo } from 'react'
import ProformaApis from '@/src/api/proformas'
import { useApi } from '@/src/hooks/use-api'
import { IProforma, PageParams, Paginated } from '@/src/interfaces'

type ProformaItemBody = {
  drinkId: number
  quantity: number
  // the price for this proforma only, the price of the drink is used when it is missing
  unitPrice?: number
  // 0 - 100, lowers the price of this drink
  discountPercent?: number
}

type CreateProformaBody = {
  warehouseId?: number
  // the buyer, can be left out
  customerId?: number
  items: ProformaItemBody[]
}

export const useProformaService = () => {
  const api = useApi()

  return useMemo(() => {
    const getProformas = async ({ search, ...paging }: PageParams) => {
      const { data } = await api.get<Paginated<IProforma>>(ProformaApis.getProformas(), { params: { ...paging, search: search || undefined } })

      return data
    }

    const getProforma = async (proformaId: number) => {
      const { data } = await api.get<IProforma>(ProformaApis.getProforma(proformaId))

      return data
    }

    const createProforma = async (body: CreateProformaBody) => {
      const { data } = await api.post<IProforma>(ProformaApis.createProforma(), body)

      return data
    }

    // puts the drinks of the proforma back on the stock
    const returnProforma = async (proformaId: number) => {
      await api.post(ProformaApis.returnProforma(proformaId))
    }

    const getProformaPdf = async (proformaId: number) => {
      const { data } = await api.get<Blob>(ProformaApis.getProformaPdf(proformaId), { responseType: 'blob' })

      return data
    }

    return { getProformas, getProforma, createProforma, returnProforma, getProformaPdf }
  }, [api])
}
