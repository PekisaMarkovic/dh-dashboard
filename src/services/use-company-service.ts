import { useMemo } from 'react'
import CompanyApis from '@/src/api/companies'
import { useApi } from '@/src/hooks/use-api'
import { ICompany, ICompanyUser } from '@/src/interfaces'

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

    return { getCompany, getCompanyUsers }
  }, [api])
}
