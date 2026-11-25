const base = 'drinks'

const getDrinks = () => base
const createDrink = () => base
const patchDrink = (id: number) => `${base}/${id}`
const deleteDrink = (id: number) => `${base}/${id}`
const drinkImage = (id: number) => `${base}/${id}/image`

const sendStockDigest = () => 'stock-alerts/digest'

const DrinkApis = { getDrinks, createDrink, patchDrink, deleteDrink, drinkImage, sendStockDigest }

export default DrinkApis
