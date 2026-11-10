import i18n from 'i18next'
import { setDateLanguage } from '@/src/utils/date'
import { SelectOption } from '@/src/interfaces/general'

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'sr', label: 'Srpski' },
] as const

export type Language = (typeof LANGUAGES)[number]['value']

export const DEFAULT_LANGUAGE: Language = 'en'

const STORAGE_KEY = 'lang'

export const isLanguage = (value: unknown): value is Language => LANGUAGES.some((l) => l.value === value)

export const getStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

/**
 * Switch the UI language right away and remember it for the next page load
 */
export const applyLanguage = (language?: string | null) => {
  const next = isLanguage(language) ? language : DEFAULT_LANGUAGE

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // storage can be blocked, the language still changes for this session
  }

  setDateLanguage(next)

  return i18n.changeLanguage(next)
}

// the shape SingleSelect works with
export const LANGUAGE_OPTIONS: SelectOption[] = LANGUAGES.map((l) => ({ id: l.value, name: l.label, value: l.value }))

export const languageToOption = (language?: string | null): SelectOption => LANGUAGE_OPTIONS.find((o) => o.value === language) || LANGUAGE_OPTIONS[0]
