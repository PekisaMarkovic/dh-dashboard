const base = 'companies'

const getCompany = (id: number) => `${base}/${id}`
const getCompanyUsers = (id: number) => `${base}/${id}/users`

const CompanyApis = { getCompany, getCompanyUsers }

export default CompanyApis
