export type Nullable<T> = T | null

export type Spacing = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'

export type FontFamily = 'popins' | 'inter'

export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'

export type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'

export type TestimonialsLayoutVariantType = 'AGENCY' | 'TALENT' | 'EDIT_TALENT' | 'EDIT_CASE_STUDY' | 'NEW_CASE_STUDY'

export type SelectOption = { id: string; name: string; value: string; checked?: boolean }

export type Color =
  | 'white'
  | 'green'
  | 'green-transparent'
  | 'dark-grey'
  | 'grey'
  | 'grey-secondary'
  | 'grey-900'
  | 'lighy-grey'
  | 'light-grey-transparent'
  | 'light-grey-alt'
  | 'black'
  | 'blue'
  | 'blue-secondary'
  | 'blue-50'
  | 'blue-900'
  | 'yellow'
  | 'dark-orange'
  | 'orange'
  | 'orange-50'
  | 'transparent'
  | 'red'
  | 'red-50'
  | 'red-100'
  | 'red-600'
  | 'red-900'
  | 'red-light'
  | 'red-dark'
  | 'purple-light'
  | 'purple-dark'
  | 'state-info'
  | 'state-warning'

export interface Paginated<T> {
  items: T[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export interface LocationPoint {
  x: number
  y: number
}
