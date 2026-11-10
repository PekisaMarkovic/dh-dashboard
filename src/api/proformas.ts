const base = 'proformas'

const getProformas = () => base
const getProforma = (id: number) => `${base}/${id}`
const createProforma = () => base
const returnProforma = (id: number) => `${base}/${id}/return`
const getProformaPdf = (id: number) => `${base}/${id}/pdf`

const ProformaApis = { getProformas, getProforma, createProforma, getProformaPdf, returnProforma }

export default ProformaApis
