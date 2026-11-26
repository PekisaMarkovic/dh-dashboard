const base = 'categories'

const getCategories = () => base
const createCategory = () => base
const patchCategory = (id: number) => `${base}/${id}`
const deleteCategory = (id: number) => `${base}/${id}`

const CategoryApis = { getCategories, createCategory, patchCategory, deleteCategory }

export default CategoryApis
