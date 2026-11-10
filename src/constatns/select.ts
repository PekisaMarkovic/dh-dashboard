import { SelectOption } from '@/src/interfaces'

export const OVERFLOW_OPTION = {
  root: null, // Set the scrollable div as the root
  rootMargin: '0px',
  threshold: 0.8,
}

export const YEARS_OPTIONS: SelectOption[] = Array.from(
  { length: new Date().getFullYear() - 1969 },
  (_, index) => new Date().getFullYear() - index,
).map((year, index) => {
  return { id: `${index + 1}`, name: `${year}`, value: `${year}` }
})

export const TIME_OPTIONS: SelectOption[] = Array.from({ length: 24 * 2 }, (_, index) => {
  const hour = Math.floor(index / 2)
  const minutes = index % 2 === 0 ? '00' : '30'
  const minNumbers = index % 2 === 0 ? 0 : 0.3

  const timeString = `${hour.toString().padStart(2, '0')}:${minutes}`

  return {
    id: `${index + 1}`,
    name: timeString,
    value: `${hour + minNumbers}`,
  }
})
