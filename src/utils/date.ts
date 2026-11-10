import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/en'
import 'dayjs/locale/sr'

dayjs.extend(customParseFormat)

// the one format every date in the app is shown in, change it here to change it everywhere
export const DATE_FORMAT = 'DD-MM-YYYY'

type DateInput = Date | string | number | null | undefined

/**
 * A date as the user sees it, empty text when there is no (valid) date
 */
export function formatDate(input: DateInput): string {
  if (input === null || input === undefined || input === '') return ''

  const date = dayjs(input)

  return date.isValid() ? date.format(DATE_FORMAT) : ''
}

/**
 * Reads a date that was typed or picked in DATE_FORMAT
 */
export function parseDate(text: string) {
  return dayjs(text, DATE_FORMAT)
}

/**
 * True only for a real date written exactly in DATE_FORMAT, e.g. 10-11-2026 (31-02-2026 is not)
 */
export function isValidDateText(text: string): boolean {
  return dayjs(text, DATE_FORMAT, true).isValid()
}

/**
 * Date in DATE_FORMAT -> YYYY-MM-DD, which is what the api wants
 */
export function formatToIsoDate(text: string): string {
  return parseDate(text).format('YYYY-MM-DD')
}

/**
 * Dates get the language of the app too (month names, weekdays)
 */
export function setDateLanguage(language: string) {
  dayjs.locale(language === 'sr' ? 'sr' : 'en')
}
