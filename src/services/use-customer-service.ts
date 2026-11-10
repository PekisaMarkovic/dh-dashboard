import { useMemo } from 'react'
import CustomerApis from '@/src/api/customers'
import { useApi } from '@/src/hooks/use-api'
import { ICustomer } from '@/src/interfaces'

type CustomerBody = {
  name: string
}

export const useCustomerService = () => {
  const api = useApi()

  return useMemo(() => {
    const getCustomers = async () => {
      const { data } = await api.get<ICustomer[]>(CustomerApis.getCustomers())

      return data
    }

    const createCustomer = async (body: CustomerBody) => {
      const { data } = await api.post<ICustomer>(CustomerApis.createCustomer(), body)

      return data
    }

    const updateCustomer = async (customerId: number, body: CustomerBody) => {
      const { data } = await api.patch<ICustomer>(CustomerApis.patchCustomer(customerId), body)

      return data
    }

    const deleteCustomer = async (customerId: number) => {
      await api.delete(CustomerApis.deleteCustomer(customerId))
    }

    return { getCustomers, createCustomer, updateCustomer, deleteCustomer }
  }, [api])
}
