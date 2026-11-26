import { useMemo } from 'react'
import CategoryApis from '@/src/api/categories'
import { useApi } from '@/src/hooks/use-api'
import { ICategory } from '@/src/interfaces'

export const useCategoryService = () => {
  const api = useApi()

  return useMemo(() => {
    // all the categories of the company, sorted by name, with the number of their drinks
    const getCategories = async () => {
      const { data } = await api.get<ICategory[]>(CategoryApis.getCategories())

      return data
    }

    const createCategory = async (name: string) => {
      const { data } = await api.post<ICategory>(CategoryApis.createCategory(), { name })

      return data
    }

    const renameCategory = async (categoryId: number, name: string) => {
      const { data } = await api.patch<ICategory>(CategoryApis.patchCategory(categoryId), { name })

      return data
    }

    // the drinks stay, they are only no longer in the category
    const deleteCategory = async (categoryId: number) => {
      await api.delete(CategoryApis.deleteCategory(categoryId))
    }

    return { getCategories, createCategory, renameCategory, deleteCategory }
  }, [api])
}
