const base = 'drinks'

const getDrinks = () => base
const createDrink = () => base
const patchDrink = (id: number) => `${base}/${id}`
const deleteDrink = (id: number) => `${base}/${id}`

const sendStockDigest = () => 'stock-alerts/digest'

const DrinkApis = { getDrinks, createDrink, patchDrink, deleteDrink, sendStockDigest }

export default DrinkApis
