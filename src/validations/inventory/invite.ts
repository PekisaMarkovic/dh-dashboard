import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const INVITE_VALIDATION = yupResolver(
  Yup.object({
    email: Yup.string().email('email').typeError('email').required('email'),
  }),
)
