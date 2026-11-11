const base = 'companies'

const getCompany = (id: number) => `${base}/${id}`
const getCompanyUsers = (id: number) => `${base}/${id}/users`
const patchCompany = (id: number) => `${base}/${id}`

const CompanyApis = { getCompany, getCompanyUsers, patchCompany }

export default CompanyApis
