import { useEffect, useState } from 'react'
import { formatPrice } from '@/src/utils/money'

type Props = {
  value: number
  onChange: (value: number) => void
  ariaLabel: string
  min?: number
  max?: number
  /** a short text after the number, e.g. % */
  suffix?: string
  /** how many decimals can be typed, 2 by default */
  decimals?: number
  /** a price: "2,304.500" is accepted (the comma separates thousands) and shown that way when the field is left */
  isPrice?: boolean
}

/**
 * Number field with decimals that stays between min and max.
 * The text is kept on its own while typing, so "2." or "0,5" can be typed without jumping.
 */
const DecimalInput = ({ value, onChange, ariaLabel, min = 0, max = 99999999, suffix, decimals = 2, isPrice = false }: Props) => {
  const show = (number: number) => (isPrice ? formatPrice(number) : String(number))
  // in a price the comma separates thousands, in the other fields it is the decimal point
  const read = (text: string) => (isPrice ? text.replace(/,/g, '') : text.replace(',', '.'))
  const [text, setText] = useState(show(value))

  // the value was changed from outside (e.g. the proforma was reset)
  useEffect(() => {
    if (Number(read(text)) !== value) setText(show(value))
  }, [value])

  const handleChange = (raw: string) => {
    const cleaned = read(raw).replace(/[^\d.]/g, '')
    const [whole, fraction] = cleaned.split('.')
    const next = fraction === undefined ? whole : `${whole}.${fraction.slice(0, decimals)}`
    const number = Number(next)

    setText(next)
    onChange(next !== '' && Number.isFinite(number) ? Math.min(Math.max(number, min), max) : min)
  }

  return (
    <div className="inline-flex items-center h-9 rounded-xs-plus border-1 border-solid border-grey bg-white px-2 w-full focus-within:border-green">
      <input
        aria-label={ariaLabel}
        inputMode="decimal"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setText(show(value))}
        className="min-w-0 flex-1 text-right font-poppins text-sm text-black focus:outline-none"
      />
      {suffix && <span className="ml-1 font-poppins text-sm text-grey">{suffix}</span>}
    </div>
  )
}

export default DecimalInput
