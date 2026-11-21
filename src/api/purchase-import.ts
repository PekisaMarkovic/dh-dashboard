const base = 'purchase-import'

const parse = () => `${base}/parse`
const apply = () => `${base}/apply`
const history = () => base
const detail = (id: number) => `${base}/${id}`
const remove = (id: number) => `${base}/${id}`

const PurchaseImportApis = { parse, apply, history, detail, remove }

export default PurchaseImportApis
