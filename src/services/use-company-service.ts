import { useMemo } from 'react'
import CompanyApis from '@/src/api/companies'
import { useApi } from '@/src/hooks/use-api'
import { ICompany, ICompanyUser } from '@/src/interfaces'

type UpdateCompanyBody = {
  name: string
  street: string
  city: string
  pib: string
  registrationNumber: string
  // empty when the company has no phone
  phone: string | null
  bankAccount: string
}

export const useCompanyService = () => {
  const api = useApi()

  return useMemo(() => {
    const getCompany = async (companyId: number) => {
      const { data } = await api.get<ICompany>(CompanyApis.getCompany(companyId))

      return data
    }

    const getCompanyUsers = async (companyId: number) => {
      const { data } = await api.get<ICompanyUser[]>(CompanyApis.getCompanyUsers(companyId))

      return data
    }

    const updateCompany = async (companyId: number, body: UpdateCompanyBody) => {
      const { data } = await api.patch<ICompany>(CompanyApis.patchCompany(companyId), body)

      return data
    }

    return { getCompany, getCompanyUsers, updateCompany }
  }, [api])
}
