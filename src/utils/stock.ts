import { IDrink } from '@/src/interfaces'

export type StockLevel = 'ok' | 'warning' | 'critical'

type StockInfo = Pick<IDrink, 'quantity' | 'warningQuantity' | 'criticalQuantity'>

/**
 * How low the stock of a drink is. A level of 0 means that level is off.
 * - critical: fell below the "has to be bought again" quantity (red)
 * - warning: fell below the warning quantity (orange)
 */
export const getStockLevel = ({ quantity, warningQuantity, criticalQuantity }: StockInfo): StockLevel => {
  if (criticalQuantity > 0 && quantity < criticalQuantity) return 'critical'
  if (warningQuantity > 0 && quantity < warningQuantity) return 'warning'

  return 'ok'
}

// the whole row gets a see-through background in the color of the level.
// Orange is a warm amber and red is a deep crimson, so they are easy to tell apart
export const STOCK_ROW_CLASS: Record<StockLevel, string> = {
  ok: '',
  warning: 'bg-[rgba(255,149,0,0.16)]',
  critical: 'bg-[rgba(225,29,46,0.14)]',
}

// the quantity itself is bright orange or bright red
export const STOCK_TEXT_CLASS: Record<StockLevel, string> = {
  ok: 'text-black',
  warning: 'text-[#F28500] font-semibold',
  critical: 'text-[#E11D2E] font-semibold',
}
