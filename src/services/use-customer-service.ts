import { useMemo } from 'react'
import CustomerApis from '@/src/api/customers'
import { useApi } from '@/src/hooks/use-api'
import { ICustomer, ICustomerOption, PageParams, Paginated } from '@/src/interfaces'

type CustomerBody = {
  name: string
}

export const useCustomerService = () => {
  const api = useApi()

  return useMemo(() => {
    const getCustomers = async ({ search, ...paging }: PageParams) => {
      const { data } = await api.get<Paginated<ICustomer>>(CustomerApis.getCustomers(), { params: { ...paging, search: search || undefined } })

      return data
    }

    // every customer with only the id and the name, for a select
    const getCustomerOptions = async () => {
      const { data } = await api.get<ICustomerOption[]>(CustomerApis.getCustomerOptions())

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

    return { getCustomers, getCustomerOptions, createCustomer, updateCustomer, deleteCustomer }
  }, [api])
}
