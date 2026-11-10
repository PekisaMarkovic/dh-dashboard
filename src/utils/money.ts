import { VAT_RATE_PERCENT } from '@/src/constatns/vat'

const moneyFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const priceFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })

const toNumber = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0)

  return Number.isFinite(amount) ? amount : 0
}

/**
 * Formats an amount (a line total, a total value) with thousands separators and always two decimals,
 * e.g. 5222 -> "5,222.00" and 5123511.5 -> "5,123,511.50".
 */
export const formatMoney = (value: number | string | null | undefined) => moneyFormat.format(toNumber(value))

/**
 * Formats the price of a drink: thousands separators and always three decimals,
 * e.g. 2304.5 -> "2,304.500". Use it for every price per unit that is shown.
 */
export const formatPrice = (value: number | string | null | undefined) => priceFormat.format(toNumber(value))

// "2,304.500", "2304.5" and "2304" are valid, "2,30.5", "2.3045" or "-1" are not
const PRICE_INPUT = /^(\d{1,3}(,\d{3})+|\d+)(\.\d{1,3})?$/

export const isValidPriceInput = (text: string) => PRICE_INPUT.test(text.trim())

/**
 * Reads a price that was typed in the format the prices are shown in ("2,304.500").
 * Returns null when the text is not a valid price.
 */
export const parsePriceInput = (text: string) => (isValidPriceInput(text) ? Number(text.trim().replace(/,/g, '')) : null)

// A price has up to 3 decimals, the amount of a line has 2: the line is calculated in thousandths
// and rounded to cents once, the same way as in the api.
// The discount (0 - 100 %) is taken off the line.
export const lineCents = (price: number, quantity: number, discountPercent = 0) => {
  const lineMillis = Math.round(price * 1000) * quantity
  const afterDiscount = (lineMillis * (10000 - Math.round(discountPercent * 100))) / 10000

  return Math.round(afterDiscount / 10)
}

// The VAT of a line without VAT (in cents), rounded per line, so the lines add up to the totals (same as in the api)
export const vatCents = (netCents: number) => Math.round((netCents * VAT_RATE_PERCENT) / 100)

export const formatCents = (cents: number) => formatMoney(cents / 100)
