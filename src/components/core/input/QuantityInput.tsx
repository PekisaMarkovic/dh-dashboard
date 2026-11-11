type Props = {
  value: number
  max: number
  min?: number
  onChange: (value: number) => void
  disabled?: boolean
  ariaLabel: string
}

const buttonClass =
  'h-9 w-9 flex items-center justify-center font-poppins text-lg text-dark-grey bg-white hover:bg-light-grey-transparent disabled:cursor-not-allowed disabled:text-grey'

/**
 * Whole number stepper that stays between min (default 0) and max
 */
const QuantityInput = ({ value, max, min = 0, onChange, disabled, ariaLabel }: Props) => {
  const clamp = (next: number) => onChange(Math.min(Math.max(Number.isFinite(next) ? Math.trunc(next) : min, min), max))

  const handleDecrease = () => clamp(value - 1)
  const handleIncrease = () => clamp(value + 1)

  return (
    <div className="inline-flex items-center rounded-xs-plus border-1 border-solid border-grey overflow-hidden bg-white">
      <button type="button" className={buttonClass} disabled={disabled || value <= min} onClick={handleDecrease} aria-label="-">
        −
      </button>
      <input
        aria-label={ariaLabel}
        inputMode="numeric"
        disabled={disabled}
        value={value}
        onChange={(e) => clamp(Number(e.target.value.replace(/\D/g, '')))}
        className="h-9 w-14 text-center font-poppins text-sm text-black bg-white focus:outline-none disabled:cursor-not-allowed disabled:bg-white"
      />
      <button type="button" className={buttonClass} disabled={disabled || value >= max} onClick={handleIncrease} aria-label="+">
        +
      </button>
    </div>
  )
}

export default QuantityInput
