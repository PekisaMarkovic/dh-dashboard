import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const FIRST_TIME_REGISTER_VALIDATION = yupResolver(
  Yup.object({
    firstName: Yup.string().typeError('firstName').required('firstName'),
    lastName: Yup.string().typeError('lastName').required('lastName'),
    password: Yup.string().typeError('password').required('password').min(8, 'password'),
  }),
)
