const base = 'proformas'

const getProformas = () => base
const getProforma = (id: number) => `${base}/${id}`
const createProforma = () => base
const patchProforma = (id: number) => `${base}/${id}`
const returnProforma = (id: number) => `${base}/${id}/return`
const getProformaPdf = (id: number) => `${base}/${id}/pdf`

const ProformaApis = { getProformas, getProforma, createProforma, patchProforma, getProformaPdf, returnProforma }

export default ProformaApis
