import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const LOG_IN_VALIDATION = yupResolver(
  Yup.object({
    email: Yup.string().email('email').typeError('email').required('email'),
    password: Yup.string().typeError('password').required('password'),
  }),
)
