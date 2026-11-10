const base = 'drinks'

const getDrinks = () => base
const createDrink = () => base
const patchDrink = (id: number) => `${base}/${id}`
const deleteDrink = (id: number) => `${base}/${id}`

const DrinkApis = { getDrinks, createDrink, patchDrink, deleteDrink }

export default DrinkApis
