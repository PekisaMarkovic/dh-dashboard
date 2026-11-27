import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// every text of the site is required (the site can not be published without them), the same rules as the api (UpdateWebsiteDto).
// The error of a field is its name, the text is in translations/*/errors.json and it is shown under the input.
const required = (name: string, max: number) => Yup.string().typeError(name).trim().required(name).max(max, name)

// digits, +, -, spaces, brackets
const PHONE_PATTERN = /^[0-9+\-()\s/.]{6,50}$/

export const GENERAL_VALIDATION = yupResolver(
  Yup.object({
    name: required('name', 150),
    city: required('city', 100),
    address: required('address', 150),
    phone: required('phone', 50).matches(PHONE_PATTERN, 'phone'),
    instagram: required('instagram', 255).matches(/^https?:\/\/\S+$/, 'instagram'),
    // one day per line
    workingHours: required('workingHours', 500),
  }),
)

export const HERO_VALIDATION = yupResolver(
  Yup.object({
    title: required('title', 150),
    subtitle: required('subtitle', 150),
    text: required('text', 500),
    // only when the button is shown
    buttonText: Yup.string().when('showButton.checked', { is: false, then: (s) => s.notRequired(), otherwise: () => required('buttonText', 60) }),
  }),
)

export const FEATURED_VALIDATION = yupResolver(Yup.object({ title: required('title', 150), buttonText: required('buttonText', 60) }))

export const STORY_VALIDATION = yupResolver(
  Yup.object({
    title: required('title', 150),
    paragraph1: required('paragraph1', 1000),
    paragraph2: required('paragraph2', 1000),
    buttonText: required('buttonText', 60),
  }),
)

export const INFO_VALIDATION = yupResolver(
  Yup.object({ title: required('title', 150), text: required('text', 1000), buttonText: required('buttonText', 60) }),
)

// the messages are the names of the SEO fields (seoTitle...), the form fields are title and description
export const SEO_VALIDATION = yupResolver(Yup.object({ title: required('seoTitle', 70), description: required('seoDescription', 160) }))

// lowercase letters, digits and single dashes, the same as the api (SLUG_PATTERN)
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const PAGE_VALIDATION = yupResolver(
  Yup.object({
    title: required('pageTitle', 100),
    // the home page has no address, its field is disabled
    slug: Yup.string().trim().max(100, 'slug').matches(SLUG_PATTERN, { message: 'slug', excludeEmptyString: true }),
  }),
)

// a new page: only its name, the address is made from it
export const NEW_PAGE_VALIDATION = yupResolver(Yup.object({ title: required('pageTitle', 100) }))
