import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { isValidDateText } from '@/src/utils/date'

// only phone, date of birth and language are editable, phone and date of birth are optional
export const UPDATE_PROFILE_VALIDATION = yupResolver(
  Yup.object({
    // read only, shown in the form
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string(),
    language: Yup.object({
      value: Yup.string()
        .required('language')
        .test('language', 'language', (v) => v === 'en' || v === 'sr'),
    }).required('language'),
    phoneNumber: Yup.string().typeError('phoneNumber').max(50, 'phoneNumber'),
    // empty, or a real date written as DD-MM-YYYY, e.g. 10-11-2026
    dateOfBirth: Yup.string()
      .typeError('dateOfBirth')
      .test('date-format', 'dateOfBirth', (value) => !value || isValidDateText(value)),
  }),
)
