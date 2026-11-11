import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// the same rules as in the api
export const PIB_PATTERN = /^\d{9}$/
export const REGISTRATION_NUMBER_PATTERN = /^\d{8}$/
// 18 digits (160600000276128785) or with dashes (160-0000002761287-85)
export const BANK_ACCOUNT_PATTERN = /^(\d{18}|\d{3}-\d{1,13}-\d{2})$/
export const PHONE_PATTERN = /^[0-9+()/\-\s]{5,50}$/

export const COMPANY_VALIDATION = yupResolver(
  Yup.object({
    name: Yup.string().typeError('name').trim().required('name').max(150, 'name'),
    street: Yup.string().typeError('street').trim().required('street').max(150, 'street'),
    city: Yup.string().typeError('city').trim().required('city').max(100, 'city'),
    pib: Yup.string().typeError('pib').trim().required('pib').matches(PIB_PATTERN, 'pib'),
    registrationNumber: Yup.string()
      .typeError('registrationNumber')
      .trim()
      .required('registrationNumber')
      .matches(REGISTRATION_NUMBER_PATTERN, 'registrationNumber'),
    // the phone can stay empty
    phone: Yup.string()
      .typeError('phone')
      .trim()
      .test('phone-format', 'phone', (value) => !value || PHONE_PATTERN.test(value)),
    bankAccount: Yup.string().typeError('bankAccount').trim().required('bankAccount').matches(BANK_ACCOUNT_PATTERN, 'bankAccount'),
  }),
)
